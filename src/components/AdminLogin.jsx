import { useState } from 'react'
import { motion } from 'framer-motion'
import { adminAuth } from '../lib/adminAuth'

export default function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await adminAuth.login(email, password)
            
            // Store session token
            localStorage.setItem('adminSessionToken', result.sessionToken)
            localStorage.setItem('adminSessionExpiry', result.expiresAt)
            
            onLogin(result.admin)
        } catch (error) {
            setError(error.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Georgia, serif',
            padding: '20px'
        }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '40px',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    maxWidth: '450px',
                    width: '100%'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{
                        color: '#4a5568',
                        fontSize: '2rem',
                        marginBottom: '10px',
                        fontFamily: 'Georgia, serif'
                    }}>
                        🔐 Admin Panel
                    </h1>
                    <p style={{
                        color: '#718096',
                        fontSize: '1rem',
                        marginBottom: '20px'
                    }}>
                        Secure Admin Access
                    </p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{
                            display: 'block',
                            color: '#4a5568',
                            fontSize: '0.9rem',
                            marginBottom: '8px',
                            fontWeight: 'bold'
                        }}>
                            Admin Email:
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '10px',
                                fontSize: '1rem',
                                fontFamily: 'Georgia, serif',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            color: '#4a5568',
                            fontSize: '0.9rem',
                            marginBottom: '8px',
                            fontWeight: 'bold'
                        }}>
                            Password:
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '10px',
                                fontSize: '1rem',
                                fontFamily: 'Georgia, serif',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                background: 'rgba(245, 101, 101, 0.1)',
                                border: '1px solid #f56565',
                                color: '#c53030',
                                padding: '10px 15px',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                textAlign: 'center'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        style={{
                            background: loading ? '#a0aec0' : 'linear-gradient(45deg, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            padding: '14px 24px',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontFamily: 'Georgia, serif',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                        }}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </motion.button>
                </form>

                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(102, 126, 234, 0.2)'
                }}>
                    <h3 style={{
                        color: '#4a5568',
                        fontSize: '1rem',
                        marginBottom: '10px',
                        fontFamily: 'Georgia, serif'
                    }}>
                        📋 Default Credentials:
                    </h3>
                    <div style={{
                        fontSize: '0.9rem',
                        color: '#718096',
                        lineHeight: '1.6'
                    }}>
                        <strong>Email:</strong> admin@valentine.app<br/>
                        <strong>Password:</strong> Admin@123<br/>
                        <small style={{ color: '#e53e3e' }}>
                            ⚠️ Change these credentials after first login!
                        </small>
                    </div>
                </div>

                <div style={{
                    textAlign: 'center',
                    marginTop: '20px'
                }}>
                    <button
                        onClick={() => window.history.back()}
                        style={{
                            background: 'transparent',
                            color: '#718096',
                            border: '1px solid #cbd5e0',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            fontFamily: 'Georgia, serif'
                        }}
                    >
                        ← Back to App
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
