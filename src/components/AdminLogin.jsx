import { useState } from 'react'
import { motion } from 'framer-motion'
import { adminAuth } from '../lib/adminAuth'

export default function AdminLogin({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

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
                    padding: window.innerWidth < 768 ? '30px 25px' : '40px',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    maxWidth: window.innerWidth < 768 ? '95%' : '450px',
                    width: '100%'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: window.innerWidth < 768 ? '25px' : '30px' }}>
                    <motion.div
                        animate={{ rotate: [0, -5, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        style={{ fontSize: window.innerWidth < 768 ? '2.5rem' : '3rem', marginBottom: '15px' }}
                    >
                        🔐
                    </motion.div>
                    <h1 style={{
                        color: '#4a5568',
                        fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem',
                        marginBottom: '10px',
                        fontFamily: 'Georgia, serif'
                    }}>
                        Admin Panel
                    </h1>
                    <p style={{
                        color: '#718096',
                        fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
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
                            fontSize: window.innerWidth < 768 ? '0.85rem' : '0.9rem',
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
                                padding: window.innerWidth < 768 ? '12px 14px' : '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '10px',
                                fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
                                fontFamily: 'Georgia, serif',
                                transition: 'border-color 0.3s ease',
                                boxSizing: 'border-box'
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
                            fontSize: window.innerWidth < 768 ? '0.85rem' : '0.9rem',
                            marginBottom: '8px',
                            fontWeight: 'bold'
                        }}>
                            Password:
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: window.innerWidth < 768 ? '12px 40px 12px 14px' : '12px 40px 12px 16px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '10px',
                                    fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
                                    fontFamily: 'Georgia, serif',
                                    transition: 'border-color 0.3s ease',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    color: '#718096',
                                    padding: '4px'
                                }}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                background: 'rgba(245, 101, 101, 0.1)',
                                border: '1px solid #f56565',
                                color: '#c53030',
                                padding: window.innerWidth < 768 ? '8px 12px' : '10px 15px',
                                borderRadius: '8px',
                                fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem',
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
                            padding: window.innerWidth < 768 ? '12px 20px' : '14px 24px',
                            borderRadius: '12px',
                            fontSize: window.innerWidth < 768 ? '1rem' : '1.1rem',
                            fontFamily: 'Georgia, serif',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                            marginTop: '10px'
                        }}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%' }}
                                />
                                Signing In...
                            </span>
                        ) : '🔐 Sign In'}
                    </motion.button>
                </form>

                <div style={{
                    textAlign: 'center',
                    marginTop: window.innerWidth < 768 ? '20px' : '30px'
                }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.history.back()}
                        style={{
                            background: 'transparent',
                            color: '#718096',
                            border: '1px solid #cbd5e0',
                            padding: window.innerWidth < 768 ? '8px 16px' : '10px 20px',
                            borderRadius: '8px',
                            fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem',
                            cursor: 'pointer',
                            fontFamily: 'Georgia, serif',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        ← Back to App
                    </motion.button>
                </div>

                {/* Security Tips */}
                <div style={{
                    marginTop: window.innerWidth < 768 ? '20px' : '25px',
                    padding: window.innerWidth < 768 ? '15px' : '20px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(102, 126, 234, 0.2)'
                }}>
                    <h3 style={{
                        color: '#4a5568',
                        fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
                        marginBottom: '10px',
                        fontFamily: 'Georgia, serif'
                    }}>
                        🔒 Security Tips:
                    </h3>
                    <div style={{
                        fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem',
                        color: '#718096',
                        lineHeight: '1.6'
                    }}>
                        <div style={{ marginBottom: '8px' }}>• Keep your password secure</div>
                        <div style={{ marginBottom: '8px' }}>• Use a strong, unique password</div>
                        <div style={{ marginBottom: '8px' }}>• Change credentials regularly</div>
                        <div>• Logout when finished</div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
