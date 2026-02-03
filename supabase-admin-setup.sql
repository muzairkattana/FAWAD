-- Supabase SQL for Admin Management System

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

-- Enable RLS (Row Level Security)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY "Admins can view their own profile" ON admin_users
    FOR SELECT USING (
        auth.uid()::text = id::text
    );

CREATE POLICY "Admins can update their own profile" ON admin_users
    FOR UPDATE USING (
        auth.uid()::text = id::text
    );

-- RLS Policies for admin_sessions
CREATE POLICY "Admins can view their own sessions" ON admin_sessions
    FOR SELECT USING (
        auth.uid()::text = admin_id::text
    );

CREATE POLICY "Admins can manage their own sessions" ON admin_sessions
    FOR ALL USING (
        auth.uid()::text = admin_id::text
    );

-- RLS Policies for admin_logs
CREATE POLICY "Admins can view their own logs" ON admin_logs
    FOR SELECT USING (
        auth.uid()::text = admin_id::text
    );

CREATE POLICY "Admins can create their own logs" ON admin_logs
    FOR INSERT WITH CHECK (
        auth.uid()::text = admin_id::text
    );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
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
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6', -- Admin@123
    'hypervisor', 
    'fawad'
) ON CONFLICT (email) DO NOTHING;

-- Create a function to log admin actions
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON admin_users TO authenticated;
GRANT ALL ON admin_sessions TO authenticated;
GRANT ALL ON admin_logs TO authenticated;
