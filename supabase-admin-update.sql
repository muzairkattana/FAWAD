-- Simple Admin System Update (for existing databases)
-- Run this if you already have the admin tables and just need to fix issues

-- Fix RLS policies (disable them for admin system)
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs DISABLE ROW LEVEL SECURITY;

-- Grant proper permissions for anon/public access
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON admin_users TO anon, authenticated;
GRANT ALL ON admin_sessions TO anon, authenticated;
GRANT ALL ON admin_logs TO anon, authenticated;

-- Update default admin password to use Base64 encoding
UPDATE admin_users 
SET password_hash = 'QWRtaW5AMTIz' 
WHERE email = 'admin@valentine.app';

-- Add sample logs if table is empty
INSERT INTO admin_logs (admin_id, action, details, user_agent) 
SELECT 
    (SELECT id FROM admin_users WHERE email = 'admin@valentine.app' LIMIT 1),
    'LOGIN', 
    'Admin system initialized', 
    'System Setup'
WHERE NOT EXISTS (SELECT 1 FROM admin_logs LIMIT 1);

-- Show current admin users
SELECT 'Current Admin Users:' as info;
SELECT id, email, app_username, is_active, last_login, created_at FROM admin_users;

-- Show recent logs
SELECT 'Recent Admin Logs:' as info;
SELECT action, details, created_at FROM admin_logs ORDER BY created_at DESC LIMIT 5;
