import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { appAuth } from '../lib/adminAuth'

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [shake, setShake] = useState(0)
    const [loading, setLoading] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const isValid = await appAuth.checkCredentials(username, password)
            if (isValid) {
                onLogin()
            } else {
                setError(username.toLowerCase() !== 'hypervisor' ? "Oops! You’re not Ayesha 😜" : "Wrong password… nice try hacker 😂")
                setShake(prev => prev + 1)
            }
        } catch (err) {
            setError("Something went wrong. Try again!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: isMobile ? '1rem' : '2rem',
            boxSizing: 'border-box'
        }}>
            {/* Added hearts bg for consistency */}
            <div className="hearts-bg">
                <div className="heart">❤️</div>
                <div className="heart">💖</div>
                <div className="heart">💝</div>
                <div className="heart">💕</div>
                <div className="heart">💗</div>
                <div className="heart">💓</div>
                <div className="heart">💞</div>
                <div className="heart">💟</div>
                <div className="heart">❣️</div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: 'spring' }}
                style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: isMobile ? '1.5rem' : '3rem',
                    borderRadius: '30px',
                    boxShadow: 'var(--shadow-hover)',
                    textAlign: 'center',
                    width: isMobile ? '95%' : '90%',
                    maxWidth: isMobile ? 'none' : '450px',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    zIndex: 10,
                    boxSizing: 'border-box'
                }}
            >
                <motion.div
                    animate={{ rotate: [0, -5, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    style={{ fontSize: '4rem', marginBottom: '10px' }}
                >
                    💖
                </motion.div>

                <motion.h1
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    style={{
                        color: 'var(--primary)',
                        fontFamily: 'var(--font-fun)',
                        marginBottom: '10px',
                        fontSize: '2.5rem'
                    }}
                >
                    Hi Ayesha 👋✨
                </motion.h1>
                <p style={{ color: '#888', marginBottom: '30px', fontSize: '1.1rem' }}>
                    A special surprise is waiting... <br />
                    <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Just for the Hypervisor 😌</span>
                </p>

                <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        onSubmit={handleLogin}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: isMobile ? '1rem' : '1.5rem',
                            width: '100%'
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: isMobile ? '12px 16px' : '15px 20px',
                                        borderRadius: '15px',
                                        border: '2px solid #fce4ec',
                                        outline: 'none',
                                        fontSize: isMobile ? '14px' : '16px',
                                        background: '#fff9fa',
                                        transition: 'all 0.3s ease',
                                        boxSizing: 'border-box'
                                    }}
                                    className="login-input"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: isMobile ? '12px 16px' : '15px 20px',
                                        borderRadius: '15px',
                                        border: '2px solid #fce4ec',
                                        outline: 'none',
                                        fontSize: isMobile ? '14px' : '16px',
                                        background: '#fff9fa',
                                        transition: 'all 0.3s ease',
                                        boxSizing: 'border-box'
                                    }}
                                    className="login-input"
                                />
                            </div>
                        </motion.div>

                        <motion.button
                            whileHover={!loading ? { scale: 1.05, boxShadow: '0 8px 25px rgba(255, 107, 129, 0.4)' } : {}}
                            whileTap={!loading ? { scale: 0.95 } : {}}
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: isMobile ? '12px 24px' : '15px',
                                borderRadius: '15px',
                                border: 'none',
                                background: loading ? '#ccc' : 'var(--primary)',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: isMobile ? '1rem' : '1.2rem',
                                marginTop: isMobile ? '0.5rem' : '10px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                opacity: loading ? 0.7 : 1,
                                minWidth: isMobile ? '120px' : 'auto',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        >
                            {loading ? 'Entering... ✨' : 'Enter 🌸'}
                        </motion.button>
                    </motion.form>

                {error && (
                    <motion.p
                        key={shake}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: [0, -10, 10, -10, 0], opacity: 1 }}
                        style={{ color: '#e84118', marginTop: '20px', fontWeight: '500', fontSize: '0.95rem' }}
                    >
                        {error}
                    </motion.p>
                )}

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/admin'}
                        style={{
                            background: 'transparent',
                            color: '#718096',
                            border: '1px solid #cbd5e0',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            fontFamily: 'Georgia, serif',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        🔐 Admin Access
                    </motion.button>
                </div>
            </motion.div>
        </div>
    )
}
