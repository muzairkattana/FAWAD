import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key"

// Check if we have real Supabase credentials
const hasRealSupabaseCredentials = supabaseUrl !== "https://your-project.supabase.co" &&
    supabaseAnonKey !== "your-anon-key"

// Diagnostic function to check configuration
export const checkSupabaseConfig = () => {
    const config = {
        supabaseUrl,
        supabaseAnonKey,
        hasRealCredentials: hasRealSupabaseCredentials,
        supabaseClient: supabase ? 'created' : 'null',
        environment: import.meta.env.MODE
    }
    
    console.log('🔍 Supabase Configuration:', config)
    return config
}

export const supabase = hasRealSupabaseCredentials ? createClient(supabaseUrl, supabaseAnonKey) : null

// Admin authentication functions
export const adminAuth = {
    // Login admin user
    async login(email, password) {
        // Check localStorage first for custom admin credentials
        const localAdminEmail = localStorage.getItem('admin_email') || 'admin@valentine.app'
        const localAdminPass = localStorage.getItem('admin_password_hash') || btoa('Admin@123' + 'salt')

        if (email === localAdminEmail && btoa(password + 'salt') === localAdminPass) {
            // Log the login action to localStorage
            await this.logAction('default-admin-id', 'LOGIN', 'Admin logged in (localStorage mode)', null, navigator.userAgent)
            
            return {
                admin: {
                    id: 'default-admin-id',
                    email: localAdminEmail,
                    app_username: localStorage.getItem('app_username') || 'hypervisor',
                    app_password: localStorage.getItem('app_password') || 'fawad'
                },
                sessionToken: 'default-session-token',
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        }

        // Fallback to real Supabase if available
        if (!hasRealSupabaseCredentials) {
            throw new Error('Invalid credentials')
        }

        try {
            // First check if admin exists and verify password
            const { data: admin, error } = await supabase
                .from('admin_users')
                .select('*')
                .eq('email', email)
                .eq('is_active', true)
                .single()

            if (error || !admin) {
                throw new Error('Invalid credentials')
            }

            // Verify password (in production, you'd use bcrypt.compare)
            const isValidPassword = await this.verifyPassword(password, admin.password_hash)

            if (!isValidPassword) {
                throw new Error('Invalid credentials')
            }

            // Create session token
            const sessionToken = this.generateSessionToken()
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

            // Store session
            const { error: sessionError } = await supabase
                .from('admin_sessions')
                .insert({
                    admin_id: admin.id,
                    session_token: sessionToken,
                    expires_at: expiresAt.toISOString()
                })

            if (sessionError) {
                throw new Error('Failed to create session')
            }

            // Update last login
            await supabase
                .from('admin_users')
                .update({ last_login: new Date().toISOString() })
                .eq('id', admin.id)

            // Log the login action
            await this.logAction(admin.id, 'LOGIN', 'Admin logged in', null, navigator.userAgent)

            return {
                admin: {
                    id: admin.id,
                    email: admin.email,
                    app_username: admin.app_username,
                    app_password: admin.app_password
                },
                sessionToken,
                expiresAt
            }

        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    },

    // Logout admin user
    async logout(sessionToken) {
        if (!hasRealSupabaseCredentials) {
            // Fallback - just clear localStorage
            return
        }

        try {
            const { data: session } = await supabase
                .from('admin_sessions')
                .select('admin_id')
                .eq('session_token', sessionToken)
                .single()

            if (session) {
                await this.logAction(session.admin_id, 'LOGOUT', 'Admin logged out', null, navigator.userAgent)
            }

            await supabase
                .from('admin_sessions')
                .delete()
                .eq('session_token', sessionToken)

        } catch (error) {
            console.error('Logout error:', error)
            throw error
        }
    },

    // Verify session
    async verifySession(sessionToken) {
        // Fallback for no Supabase
        if (!hasRealSupabaseCredentials) {
            if (sessionToken === 'default-session-token') {
                return {
                    admin: {
                        id: 'default-admin-id',
                        email: localStorage.getItem('admin_email') || 'admin@valentine.app',
                        app_username: localStorage.getItem('app_username') || 'hypervisor',
                        app_password: localStorage.getItem('app_password') || 'fawad',
                        is_active: true
                    },
                    sessionToken
                }
            } else {
                throw new Error('Invalid session')
            }
        }

        try {
            const { data: session, error } = await supabase
                .from('admin_sessions')
                .select(`
                    admin_id,
                    expires_at,
                    admin_users (
                        id,
                        email,
                        app_username,
                        app_password,
                        is_active
                    )
                `)
                .eq('session_token', sessionToken)
                .eq('expires_at', 'gt', new Date().toISOString())
                .single()

            if (error || !session || !session.admin_users.is_active) {
                throw new Error('Invalid session')
            }

            return {
                admin: session.admin_users,
                sessionToken
            }

        } catch (error) {
            console.error('Session verification error:', error)
            throw error
        }
    },

    // Update app credentials
    async updateAppCredentials(sessionToken, appUsername, appPassword) {
        // Always save to localStorage as a primary or fallback
        localStorage.setItem('app_username', appUsername)
        localStorage.setItem('app_password', appPassword)

        // Log the action to localStorage
        await this.logAction('default-admin-id', 'UPDATE_CREDENTIALS', 
            `Updated app credentials - Username: ${appUsername}`, null, navigator.userAgent)

        // Check if we should try Supabase
        const shouldTrySupabase = hasRealSupabaseCredentials && supabase
        
        if (!shouldTrySupabase) {
            console.log('✅ App credentials updated (localStorage only - no Supabase config):', { appUsername, appPassword })
            return { app_username: appUsername, app_password: appPassword }
        }

        try {
            console.log('🔄 Attempting to update credentials in Supabase...')
            const session = await this.verifySession(sessionToken)

            const { data, error } = await supabase
                .from('admin_users')
                .update({
                    app_username: appUsername,
                    app_password: appPassword
                })
                .eq('id', session.admin.id)
                .select()
                .single()

            if (error) {
                console.error('❌ Supabase update failed:', error)
                throw new Error(`Database update failed: ${error.message}`)
            }

            console.log('✅ Credentials updated in Supabase successfully:', data)
            await this.logAction(session.admin.id, 'UPDATE_CREDENTIALS',
                `Updated app credentials - Username: ${appUsername}`, null, navigator.userAgent)

            return data

        } catch (error) {
            console.error('❌ Update credentials error:', error)
            console.log('⚠️ Falling back to localStorage only - credentials saved locally but not in database')
            return { app_username: appUsername, app_password: appPassword }
        }
    },

    // Update admin email and password
    async updateAdminCredentials(sessionToken, newEmail, newPassword) {
        // Save to localStorage for demo persistence
        if (newEmail) localStorage.setItem('admin_email', newEmail)
        if (newPassword) localStorage.setItem('admin_password_hash', btoa(newPassword + 'salt'))

        // Log the action to localStorage
        await this.logAction('default-admin-id', 'UPDATE_ADMIN_CREDENTIALS', 
            `Updated admin credentials - Email: ${newEmail}`, null, navigator.userAgent)

        // Check if we should try Supabase
        const shouldTrySupabase = hasRealSupabaseCredentials && supabase
        
        if (!shouldTrySupabase) {
            console.log('✅ Admin credentials updated (localStorage only - no Supabase config):', { newEmail })
            return { email: newEmail }
        }

        try {
            console.log('🔄 Attempting to update admin credentials in Supabase...')
            const session = await this.verifySession(sessionToken)

            const updates = {}
            if (newEmail) updates.email = newEmail
            if (newPassword) updates.password_hash = await this.hashPassword(newPassword)

            const { data, error } = await supabase
                .from('admin_users')
                .update(updates)
                .eq('id', session.admin.id)
                .select()
                .single()

            if (error) {
                console.error('❌ Supabase admin update failed:', error)
                throw new Error(`Database update failed: ${error.message}`)
            }

            console.log('✅ Admin credentials updated in Supabase successfully:', data)
            await this.logAction(session.admin.id, 'UPDATE_ADMIN_CREDENTIALS',
                'Updated admin email/password', null, navigator.userAgent)

            return data

        } catch (error) {
            console.error('❌ Update admin credentials error:', error)
            console.log('⚠️ Falling back to localStorage only - admin credentials saved locally but not in database')
            return { email: newEmail }
        }
    },

    // Get admin logs
    async getAdminLogs(sessionToken, limit = 50) {
        // Always try localStorage first
        try {
            const localLogs = JSON.parse(localStorage.getItem('admin_logs_fallback') || '[]')
            if (localLogs.length > 0) {
                console.log('📋 Loading logs from localStorage:', localLogs.length)
                return localLogs.slice(0, limit)
            }
        } catch (error) {
            console.error('Failed to load logs from localStorage:', error)
        }

        // Fallback for no Supabase
        if (!hasRealSupabaseCredentials) {
            return [
                {
                    id: '1',
                    action: 'LOGIN',
                    details: 'Admin logged in (fallback mode)',
                    created_at: new Date().toISOString()
                }
            ]
        }

        try {
            const session = await this.verifySession(sessionToken)

            const { data, error } = await supabase
                .from('admin_logs')
                .select('*')
                .eq('admin_id', session.admin.id)
                .order('created_at', { ascending: false })
                .limit(limit)

            if (error) {
                console.error('Failed to fetch logs from Supabase:', error)
                // Return localStorage logs as fallback
                const localLogs = JSON.parse(localStorage.getItem('admin_logs_fallback') || '[]')
                return localLogs.slice(0, limit)
            }

            console.log('📋 Loaded logs from Supabase:', data.length)
            return data

        } catch (error) {
            console.error('Failed to load logs:', error)
            // Return localStorage logs as fallback
            const localLogs = JSON.parse(localStorage.getItem('admin_logs_fallback') || '[]')
            return localLogs.slice(0, limit)
        }
    },

    // Helper functions
    generateSessionToken() {
        return Array.from({ length: 32 }, () =>
            Math.random().toString(36).charAt(2)
        ).join('')
    },

    async hashPassword(password) {
        // In production, you'd use bcrypt from a secure backend
        // For demo, we'll use a simple hash (NOT SECURE FOR PRODUCTION)
        return btoa(password + 'salt')
    },

    async verifyPassword(password, hash) {
        // In production, you'd use bcrypt.compare
        // For demo, we'll use simple verification (NOT SECURE FOR PRODUCTION)
        return btoa(password + 'salt') === hash
    },

    async logAction(adminId, action, details, ipAddress, userAgent) {
        // Always log to localStorage as fallback
        try {
            const existingLogs = JSON.parse(localStorage.getItem('admin_logs_fallback') || '[]')
            const newLog = {
                id: Date.now().toString(),
                admin_id: adminId,
                action,
                details,
                ip_address: ipAddress,
                user_agent: userAgent,
                created_at: new Date().toISOString()
            }
            existingLogs.unshift(newLog) // Add to beginning
            localStorage.setItem('admin_logs_fallback', JSON.stringify(existingLogs.slice(0, 100))) // Keep last 100 logs
            console.log('✅ Action logged to localStorage:', action)
        } catch (error) {
            console.error('Failed to log to localStorage:', error)
        }

        if (!hasRealSupabaseCredentials) {
            return
        }

        try {
            const { error } = await supabase
                .from('admin_logs')
                .insert({
                    admin_id: adminId,
                    action,
                    details,
                    ip_address: ipAddress,
                    user_agent: userAgent
                })

            if (error) {
                console.error('Failed to log to Supabase:', error)
            } else {
                console.log('✅ Action logged to Supabase:', action)
            }
        } catch (error) {
            console.error('Failed to log action to Supabase:', error)
        }
    }
}

// Application credential checker
export const appAuth = {
    async checkCredentials(username, password) {
        try {
            // Check localStorage first (local override)
            const localUser = localStorage.getItem('app_username')
            const localPass = localStorage.getItem('app_password')

            if (localUser && localPass) {
                if (username === localUser && password === localPass) {
                    return true
                }
                // If local exists but doesn't match, we still try Supabase if available
            }

            // If we have real Supabase credentials, use them
            if (hasRealSupabaseCredentials && supabase) {
                const { data, error } = await supabase
                    .from('admin_users')
                    .select('app_username, app_password')
                    .eq('is_active', true)
                    .limit(1)
                    .single()

                if (!error && data) {
                    return username === data.app_username && password === data.app_password
                }
            }

            // Global fallback to default credentials if nothing else matches
            return username.toLowerCase() === 'hypervisor' && password.toLowerCase() === 'fawad'

        } catch (error) {
            console.error('Credential check error:', error)
            return username.toLowerCase() === 'hypervisor' && password.toLowerCase() === 'fawad'
        }
    }
}
