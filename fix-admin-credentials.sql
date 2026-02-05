-- Fix Admin Credentials Script
-- Run this in Supabase SQL Editor to update admin credentials

-- First, let's see what's currently in the database
SELECT 'Current Admin Users:' as info;
SELECT id, email, app_username, app_password, is_active, created_at FROM admin_users;

-- Update admin credentials to common values
-- You can change these to whatever you want

-- OPTION 1: Update to simple credentials
UPDATE admin_users 
SET 
    email = 'admin@valentine.app',
    password_hash = 'QWRtaW4=', -- Base64 for 'admin'
    app_username = 'admin',
    app_password = 'admin'
WHERE email = 'admin@valentine.app';

-- OPTION 2: Update to your preferred credentials (uncomment and modify)
-- UPDATE admin_users 
-- SET 
--     email = 'your-email@example.com',
--     password_hash = 'eW91ci1wYXNzd29yZA==', -- Base64 for 'your-password'
--     app_username = 'your-username',
--     app_password = 'your-app-password'
-- WHERE email = 'admin@valentine.app';

-- OPTION 3: Keep original but ensure they work
-- UPDATE admin_users 
-- SET 
--     password_hash = 'QWRtaW5AMTIz', -- Base64 for 'Admin@123'
--     app_username = 'hypervisor',
--     app_password = 'fawad'
-- WHERE email = 'admin@valentine.app';

-- Show updated credentials
SELECT 'Updated Admin Credentials:' as info;
SELECT id, email, app_username, app_password, is_active FROM admin_users;

-- Create/Update multiple admin users if needed
INSERT INTO admin_users (email, password_hash, app_username, app_password) VALUES
    ('admin@valentine.app', 'QWRtaW4=', 'admin', 'admin'), -- admin/admin
    ('test@test.com', 'dGVzdA==', 'testuser', 'testpass') -- test/testpass
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    app_username = EXCLUDED.app_username,
    app_password = EXCLUDED.app_password;

-- Final verification
SELECT 'All Admin Users After Update:' as info;
SELECT email, app_username, '***' as password_hash, is_active FROM admin_users ORDER BY email;
