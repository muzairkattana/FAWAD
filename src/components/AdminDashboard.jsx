import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { adminAuth, checkSupabaseConfig } from '../lib/adminAuth'

export default function AdminDashboard({ admin, onLogout }) {
    const [appUsername, setAppUsername] = useState(admin.app_username)
    const [appPassword, setAppPassword] = useState(admin.app_password)
    const [adminEmail, setAdminEmail] = useState(admin.email)
    const [adminPassword, setAdminPassword] = useState('')
    const [newAdminPassword, setNewAdminPassword] = useState('')
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [activeTab, setActiveTab] = useState('credentials')

    useEffect(() => {
        loadLogs()
        // Check Supabase configuration and show diagnostic info
        const config = checkSupabaseConfig()
        
        // Show configuration status in console
        if (!config.hasRealCredentials) {
            console.warn('⚠️ Admin system running in fallback mode')
            console.warn('📝 To enable database persistence, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables')
        } else {
            console.log('✅ Admin system configured with Supabase database')
        }
    }, [])

    const loadLogs = async () => {
        try {
            const sessionToken = localStorage.getItem('adminSessionToken')
            const adminLogs = await adminAuth.getAdminLogs(sessionToken)
            setLogs(adminLogs)
        } catch (error) {
            console.error('Failed to load logs:', error)
        }
    }

    const updateAppCredentials = async () => {
        setLoading(true)
        setMessage('')
        try {
            const sessionToken = localStorage.getItem('adminSessionToken')
            await adminAuth.updateAppCredentials(sessionToken, appUsername, appPassword)
            setMessage('✅ App credentials updated successfully!')
            
            // Refresh logs to show the update
            await loadLogs()
        } catch (error) {
            setMessage('❌ Failed to update credentials')
        } finally {
            setLoading(false)
        }
    }

    const updateAdminCredentials = async () => {
        if (!adminPassword) {
            setMessage('❌ Please enter current password')
            return
        }
        setLoading(true)
        setMessage('')
        try {
            const sessionToken = localStorage.getItem('adminSessionToken')
            await adminAuth.updateAdminCredentials(sessionToken, adminEmail, newAdminPassword)
            setMessage('✅ Admin credentials updated successfully!')
            setAdminPassword('')
            setNewAdminPassword('')
            
            // Refresh logs to show the update
            await loadLogs()
        } catch (error) {
            setMessage('❌ Failed to update admin credentials')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            const sessionToken = localStorage.getItem('adminSessionToken')
            await adminAuth.logout(sessionToken)
            localStorage.removeItem('adminSessionToken')
            localStorage.removeItem('adminSessionExpiry')
            onLogout()
        } catch (error) {
            console.error('Logout error:', error)
            onLogout()
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'Georgia, serif',
            padding: '20px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        padding: '30px',
                        borderRadius: '20px',
                        marginBottom: '20px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <div>
                            <h1 style={{
                                color: '#4a5568',
                                fontSize: '2rem',
                                margin: 0
                            }}>
                                🛡️ Admin Dashboard
                            </h1>
                            <div style={{
                                fontSize: '0.9rem',
                                marginTop: '5px',
                                color: checkSupabaseConfig().hasRealCredentials ? '#22543d' : '#742a2a',
                                background: checkSupabaseConfig().hasRealCredentials ? '#c6f6d5' : '#fed7d7',
                                padding: '5px 10px',
                                borderRadius: '5px',
                                display: 'inline-block'
                            }}>
                                {checkSupabaseConfig().hasRealCredentials ? '🟢 Database Connected' : '🟡 Local Storage Only'}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: '#e53e3e',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontFamily: 'Georgia, serif'
                            }}
                        >
                            Logout
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        {['credentials', 'admin', 'logs'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    background: activeTab === tab ? '#667eea' : '#e2e8f0',
                                    color: activeTab === tab ? 'white' : '#4a5568',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontFamily: 'Georgia, serif'
                                }}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                style={{
                                    background: message.includes('✅') ? '#c6f6d5' : '#fed7d7',
                                    border: `1px solid ${message.includes('✅') ? '#9ae6b4' : '#fc8181'}`,
                                    color: message.includes('✅') ? '#22543d' : '#742a2a',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    marginBottom: '20px'
                                }}
                            >
                                {message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {activeTab === 'credentials' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                background: 'rgba(102, 126, 234, 0.1)',
                                padding: '20px',
                                borderRadius: '12px'
                            }}
                        >
                            <h2 style={{ color: '#4a5568', marginBottom: '20px' }}>
                                🎮 Application Login Credentials
                            </h2>
                            <div style={{ 
                                background: '#e6fffa', 
                                padding: '10px', 
                                borderRadius: '8px', 
                                marginBottom: '15px',
                                fontSize: '0.9rem',
                                color: '#234e52'
                            }}>
                                💡 <strong>Current values:</strong> Username: "{appUsername}", Password: "{appPassword}"
                            </div>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', color: '#4a5568', marginBottom: '5px' }}>
                                        App Username:
                                    </label>
                                    <input
                                        type="text"
                                        value={appUsername}
                                        onChange={(e) => setAppUsername(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #cbd5e0',
                                            borderRadius: '8px',
                                            fontFamily: 'Georgia, serif'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#4a5568', marginBottom: '5px' }}>
                                        App Password:
                                    </label>
                                    <input
                                        type="text"
                                        value={appPassword}
                                        onChange={(e) => setAppPassword(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #cbd5e0',
                                            borderRadius: '8px',
                                            fontFamily: 'Georgia, serif'
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={updateAppCredentials}
                                    disabled={loading}
                                    style={{
                                        background: loading ? '#a0aec0' : '#48bb78',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        fontFamily: 'Georgia, serif'
                                    }}
                                >
                                    {loading ? 'Updating...' : 'Update App Credentials'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'admin' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                background: 'rgba(245, 101, 101, 0.1)',
                                padding: '20px',
                                borderRadius: '12px'
                            }}
                        >
                            <h2 style={{ color: '#4a5568', marginBottom: '20px' }}>
                                🔐 Admin Account Settings
                            </h2>
                            <div style={{ 
                                background: '#fef5e7', 
                                padding: '10px', 
                                borderRadius: '8px', 
                                marginBottom: '15px',
                                fontSize: '0.9rem',
                                color: '#7e5109'
                            }}>
                                🔑 <strong>Current admin email:</strong> "{adminEmail}"
                            </div>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', color: '#4a5568', marginBottom: '5px' }}>
                                        Admin Email:
                                    </label>
                                    <input
                                        type="email"
                                        value={adminEmail}
                                        onChange={(e) => setAdminEmail(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #cbd5e0',
                                            borderRadius: '8px',
                                            fontFamily: 'Georgia, serif'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#4a5568', marginBottom: '5px' }}>
                                        Current Password:
                                    </label>
                                    <input
                                        type="password"
                                        value={adminPassword}
                                        onChange={(e) => setAdminPassword(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #cbd5e0',
                                            borderRadius: '8px',
                                            fontFamily: 'Georgia, serif'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#4a5568', marginBottom: '5px' }}>
                                        New Password (leave empty to keep current):
                                    </label>
                                    <input
                                        type="password"
                                        value={newAdminPassword}
                                        onChange={(e) => setNewAdminPassword(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #cbd5e0',
                                            borderRadius: '8px',
                                            fontFamily: 'Georgia, serif'
                                        }}
                                    />
                                </div>
                                <button
                                    onClick={updateAdminCredentials}
                                    disabled={loading}
                                    style={{
                                        background: loading ? '#a0aec0' : '#e53e3e',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        fontFamily: 'Georgia, serif'
                                    }}
                                >
                                    {loading ? 'Updating...' : 'Update Admin Settings'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'logs' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                background: 'rgba(237, 242, 247, 0.8)',
                                padding: '20px',
                                borderRadius: '12px'
                            }}
                        >
                            <h2 style={{ color: '#4a5568', marginBottom: '20px' }}>
                                📋 Activity Logs
                            </h2>
                            <div style={{
                                maxHeight: '400px',
                                overflowY: 'auto',
                                background: 'white',
                                borderRadius: '8px',
                                padding: '10px'
                            }}>
                                {logs.length === 0 ? (
                                    <p style={{ color: '#718096', textAlign: 'center' }}>
                                        No logs available
                                    </p>
                                ) : (
                                    logs.map(log => (
                                        <div
                                            key={log.id}
                                            style={{
                                                padding: '10px',
                                                borderBottom: '1px solid #e2e8f0',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontWeight: 'bold', color: '#4a5568' }}>
                                                    {log.action}
                                                </span>
                                                <span style={{ color: '#718096' }}>
                                                    {new Date(log.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            {log.details && (
                                                <div style={{ color: '#718096', marginTop: '5px' }}>
                                                    {log.details}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
