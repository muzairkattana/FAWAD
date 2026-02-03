import { useState, useEffect } from 'react'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import AdminRoute from './AdminRoute'

export default function AdminApp() {
    const [admin, setAdmin] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkExistingSession()
    }, [])

    const checkExistingSession = async () => {
        try {
            const sessionToken = localStorage.getItem('adminSessionToken')
            const sessionExpiry = localStorage.getItem('adminSessionExpiry')
            
            if (sessionToken && sessionExpiry && new Date(sessionExpiry) > new Date()) {
                // Verify session is still valid
                const { adminAuth } = await import('../lib/adminAuth')
                const session = await adminAuth.verifySession(sessionToken)
                setAdmin(session.admin)
            }
        } catch (error) {
            console.error('Session check failed:', error)
            localStorage.removeItem('adminSessionToken')
            localStorage.removeItem('adminSessionExpiry')
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = (adminData) => {
        setAdmin(adminData)
    }

    const handleLogout = () => {
        setAdmin(null)
        localStorage.removeItem('adminSessionToken')
        localStorage.removeItem('adminSessionExpiry')
    }

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontFamily: 'Georgia, serif'
            }}>
                <div style={{ fontSize: '2rem', color: 'white' }}>
                    Loading...
                </div>
            </div>
        )
    }

    if (admin) {
        return <AdminDashboard admin={admin} onLogout={handleLogout} />
    }

    return <AdminLogin onLogin={handleLogin} />
}
