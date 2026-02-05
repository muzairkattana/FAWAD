# 🔧 Complete Credential Fix Guide

**Issue: Wrong credentials in database vs code expectations**

---

## 📋 **Current Credential Systems:**

### **👤 User Login (Frontend App):**
- **Username:** `hypervisor`
- **Password:** `fawad`
- **Used in:** Login.jsx component

### **🛡️ Admin Login (Admin Panel):**
- **Email:** `admin@valentine.app`
- **Password:** `Admin@123`
- **Used in:** AdminLogin.jsx component

---

## 🚀 **Quick Fix - Run This SQL:**

### **Step 1: Check Current Database:**
```sql
-- See what's currently in your database
SELECT email, app_username, app_password, is_active FROM admin_users;
```

### **Step 2: Fix Credentials:**
```sql
-- Update admin credentials to match code expectations
UPDATE admin_users 
SET 
    email = 'admin@valentine.app',
    password_hash = 'QWRtaW5AMTIz', -- Base64 for 'Admin@123'
    app_username = 'hypervisor',
    app_password = 'fawad'
WHERE email = 'admin@valentine.app';

-- If no admin user exists, create one
INSERT INTO admin_users (email, password_hash, app_username, app_password) 
VALUES (
    'admin@valentine.app', 
    'QWRtaW5AMTIz', -- Base64 for 'Admin@123'
    'hypervisor', 
    'fawad'
) ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    app_username = EXCLUDED.app_username,
    app_password = EXCLUDED.app_password;
```

### **Step 3: Verify Fix:**
```sql
-- Check updated credentials
SELECT email, app_username, app_password, is_active FROM admin_users;
```

---

## 🔍 **What's Happening:**

### **User Login Flow:**
1. **Login.jsx** calls `appAuth.checkCredentials(username, password)`
2. **Checks:** `username === 'hypervisor' && password === 'fawad'`
3. **OR checks** database `app_username` and `app_password`

### **Admin Login Flow:**
1. **AdminLogin.jsx** calls `adminAuth.login(email, password)`
2. **Checks:** database `email` and `password_hash`
3. **Password:** Base64 encoded 'Admin@123' = 'QWRtaW5AMTIz'

---

## 🎯 **Test Both Logins:**

### **👤 User Login Test:**
1. **Go to:** `http://localhost:5173/`
2. **Username:** `hypervisor`
3. **Password:** `fawad`
4. **Should:** Login successfully

### **🛡️ Admin Login Test:**
1. **Go to:** `http://localhost:5173/admin`
2. **Email:** `admin@valentine.app`
3. **Password:** `Admin@123`
4. **Should:** Login successfully

---

## 🚨 **Common Issues:**

### **❌ "Wrong Credentials" - User Login:**
- **Check:** Database `app_username` = 'hypervisor'
- **Check:** Database `app_password` = 'fawad'
- **Fix:** Run the SQL update above

### **❌ "Wrong Credentials" - Admin Login:**
- **Check:** Database `email` = 'admin@valentine.app'
- **Check:** Database `password_hash` = 'QWRtaW5AMTIz'
- **Fix:** Run the SQL update above

### **❌ Environment Variables Missing:**
- **Add:** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- **Check:** Supabase Dashboard → Project Settings → API

---

## 🔧 **Base64 Password Helper:**

### **Common Passwords:**
- `'admin'` = `'YWRtaW4='`
- `'Admin@123'` = `'QWRtaW5AMTIz'`
- `'fawad'` = `'ZmF3YWQ='`
- `'test'` = `'dGVzdA=='`

### **Generate Your Own:**
```javascript
// In browser console:
btoa('your-password-here')
```

---

## 🎉 **Expected Results:**

### **✅ After SQL Fix:**
- **User Login:** `hypervisor` / `fawad` ✅
- **Admin Login:** `admin@valentine.app` / `Admin@123` ✅
- **Database:** Contains matching credentials ✅
- **Both Logins:** Work perfectly ✅

---

**🎯 Run the SQL fix above and both login systems will work perfectly!**

The issue was just mismatched credentials between your code and database. 🚀✨
