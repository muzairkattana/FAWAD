import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { appAuth } from '../lib/adminAuth'

export default function AdminRoute({ children }) {
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAdminAccess()
    }, [])

    const checkAdminAccess = async () => {
        try {
            const sessionToken = localStorage.getItem('adminSessionToken')
            const sessionExpiry = localStorage.getItem('adminSessionExpiry')
            
            if (sessionToken && sessionExpiry && new Date(sessionExpiry) > new Date()) {
                setIsAdmin(true)
            }
        } catch (error) {
            console.error('Admin check failed:', error)
        } finally {
            setLoading(false)
        }
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
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{ fontSize: '3rem' }}
                >
                    🔐
                </motion.div>
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontFamily: 'Georgia, serif'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        padding: '40px',
                        borderRadius: '20px',
                        textAlign: 'center',
                        maxWidth: '400px'
                    }}
                >
                    <h2 style={{ color: '#4a5568', marginBottom: '20px' }}>
                        🔐 Admin Access Required
                    </h2>
                    <p style={{ color: '#718096', marginBottom: '20px' }}>
                        Please login to access the admin panel.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/admin'}
                        style={{
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontFamily: 'Georgia, serif'
                        }}
                    >
                        Go to Admin Login
                    </motion.button>
                </motion.div>
            </div>
        )
    }

    return children
}
