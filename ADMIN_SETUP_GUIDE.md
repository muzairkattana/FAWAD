# 🔐 Admin Management System Setup

**Complete secure admin system for managing application credentials**

## 📋 **Setup Instructions:**

### **1. Supabase Database Setup**

1. **Go to your Supabase project**
2. **Navigate to SQL Editor**
3. **Run the SQL file**: `supabase-admin-setup.sql`

This will create:
- `admin_users` table - Admin accounts
- `admin_sessions` table - Session management  
- `admin_logs` table - Activity logging
- Default admin account

### **2. Environment Variables**

Add to your `.env` file:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### **3. Default Admin Credentials**

**Email:** `admin@valentine.app`  
**Password:** `Admin@123`

⚠️ **Change these immediately after first login!**

## 🎯 **Features:**

### **🔐 Security:**
- Secure password hashing
- Session management with expiry
- Activity logging
- Row Level Security (RLS)
- Input validation

### **⚙️ Management:**
- Update application login credentials
- Change admin email/password
- View activity logs
- Session management

### **📊 Monitoring:**
- Login/logout tracking
- Credential change history
- IP address logging
- User agent tracking

## 🚀 **How to Use:**

### **Access Admin Panel:**
1. Navigate to `/admin` in your browser
2. Login with default credentials
3. **Immediately change admin credentials!**

### **Update App Credentials:**
1. Go to "Credentials" tab
2. Update username/password for app login
3. Changes take effect immediately

### **View Activity Logs:**
1. Go to "Logs" tab
2. See all admin actions
3. Track login attempts and changes

## 🔧 **Technical Details:**

### **Database Schema:**
```sql
admin_users:
- id (UUID)
- email (VARCHAR)
- password_hash (VARCHAR)
- app_username (VARCHAR)
- app_password (VARCHAR)
- is_active (BOOLEAN)
- last_login (TIMESTAMP)
- created_at/updated_at (TIMESTAMP)

admin_sessions:
- id (UUID)
- admin_id (UUID)
- session_token (VARCHAR)
- expires_at (TIMESTAMP)
- created_at (TIMESTAMP)

admin_logs:
- id (UUID)
- admin_id (UUID)
- action (VARCHAR)
- details (TEXT)
- ip_address (INET)
- user_agent (TEXT)
- created_at (TIMESTAMP)
```

### **Security Features:**
- **Password Hashing**: bcrypt (in production)
- **Session Tokens**: 32-character random strings
- **Session Expiry**: 24 hours
- **RLS Policies**: Row-level security
- **Input Validation**: Client and server-side
- **Audit Trail**: Complete activity logging

### **API Endpoints:**
```javascript
// Authentication
adminAuth.login(email, password)
adminAuth.logout(sessionToken)
adminAuth.verifySession(sessionToken)

// Credential Management
adminAuth.updateAppCredentials(sessionToken, username, password)
adminAuth.updateAdminCredentials(sessionToken, email, password)

// Logging
adminAuth.getAdminLogs(sessionToken, limit)
```

## 🌐 **Integration:**

### **App Login Integration:**
The main app now uses `appAuth.checkCredentials()` which:
1. Checks Supabase for current credentials
2. Falls back to defaults if Supabase unavailable
3. Allows real-time credential updates

### **Admin Routes:**
- `/admin` - Admin login page
- Protected routes with `AdminRoute` component
- Session validation on each admin page

## 📱 **Mobile Support:**
- Responsive admin dashboard
- Touch-friendly controls
- Mobile-optimized forms
- Works on all devices

## 🔒 **Best Practices:**

### **Security:**
1. **Change default passwords immediately**
2. **Use strong admin passwords**
3. **Regular session cleanup**
4. **Monitor activity logs**
5. **Keep Supabase secure**

### **Maintenance:**
1. **Regular backup of admin_users table**
2. **Monitor failed login attempts**
3. **Clean up expired sessions**
4. **Review activity logs weekly**

## 🚨 **Troubleshooting:**

### **Login Issues:**
- Check Supabase connection
- Verify email/password format
- Check RLS policies
- Clear browser cache

### **Session Issues:**
- Check session expiry
- Verify localStorage
- Check browser cookies
- Re-login if needed

### **Database Issues:**
- Run SQL setup script
- Check table permissions
- Verify RLS policies
- Check Supabase logs

---

**🎉 Your admin system is now ready!**

Keep your application secure with proper credential management! 🛡️
