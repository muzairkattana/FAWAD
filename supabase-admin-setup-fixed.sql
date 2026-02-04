-- Fixed Supabase SQL for Admin Management System

-- Clean up existing objects to avoid conflicts
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS cleanup_expired_sessions();
DROP FUNCTION IF EXISTS log_admin_action();
DROP TABLE IF EXISTS admin_logs;
DROP TABLE IF EXISTS admin_sessions;
DROP TABLE IF EXISTS admin_users;

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    app_username VARCHAR(100) NOT NULL DEFAULT 'hypervisor',
    app_password VARCHAR(100) NOT NULL DEFAULT 'fawad',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_sessions table for session management
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_logs table for audit trail
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);

-- Enable RLS (Row Level Security) - DISABLED FOR ADMIN SYSTEM
-- Admin system uses custom authentication, not Supabase Auth
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs DISABLE ROW LEVEL SECURITY;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM admin_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a default admin user (you'll change this password)
-- Hash for 'Admin@123' (you should change this)
INSERT INTO admin_users (email, password_hash, app_username, app_password) 
VALUES (
    'admin@valentine.app', 
    'QWRtaW5AMTIz', -- Base64 encoded 'Admin@123'
    'hypervisor', 
    'fawad'
) ON CONFLICT (email) DO NOTHING;

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
    p_admin_id UUID,
    p_action VARCHAR(100),
    p_details TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO admin_logs (admin_id, action, details, ip_address, user_agent)
    VALUES (p_admin_id, p_action, p_details, p_ip_address, p_user_agent);
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions for anon/public access (since we're not using Supabase Auth)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON admin_users TO anon, authenticated;
GRANT ALL ON admin_sessions TO anon, authenticated;
GRANT ALL ON admin_logs TO anon, authenticated;

-- Create some sample logs for testing
INSERT INTO admin_logs (admin_id, action, details, user_agent) 
VALUES 
    ((SELECT id FROM admin_users WHERE email = 'admin@valentine.app' LIMIT 1), 'LOGIN', 'Admin logged in', 'Mozilla/5.0 (Test)'),
    ((SELECT id FROM admin_users WHERE email = 'admin@valentine.app' LIMIT 1), 'UPDATE_CREDENTIALS', 'Updated app credentials', 'Mozilla/5.0 (Test)')
ON CONFLICT DO NOTHING;
