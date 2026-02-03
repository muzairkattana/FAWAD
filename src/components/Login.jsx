import { useState } from 'react'
import { motion } from 'framer-motion'
import { appAuth } from '../lib/adminAuth'

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [shake, setShake] = useState(0)

    const handleLogin = (e) => {
        e.preventDefault()
        if (username.toLowerCase() === 'hypervisor' && password.toLowerCase() === 'fawad') {
            onLogin()
        } else {
            setError(username.toLowerCase() !== 'hypervisor' ? "Oops! You’re not Ayesha 😜" : "Wrong password… nice try hacker 😂")
            setShake(prev => prev + 1)
        }
    }

    return (
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
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
                    padding: window.innerWidth < 768 ? '2rem 1.5rem' : '3rem',
                    borderRadius: '30px',
                    boxShadow: 'var(--shadow-hover)',
                    textAlign: 'center',
                    maxWidth: '450px',
                    width: '90%',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    zIndex: 10
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

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '15px 20px',
                                borderRadius: '15px',
                                border: '2px solid #fce4ec',
                                outline: 'none',
                                fontSize: '16px',
                                background: '#fff9fa',
                                transition: 'all 0.3s ease'
                            }}
                            className="login-input"
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '15px 20px',
                                borderRadius: '15px',
                                border: '2px solid #fce4ec',
                                outline: 'none',
                                fontSize: '16px',
                                background: '#fff9fa',
                                transition: 'all 0.3s ease'
                            }}
                            className="login-input"
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(255, 107, 129, 0.4)' }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        style={{
                            padding: '15px',
                            borderRadius: '15px',
                            border: 'none',
                            background: 'var(--primary)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            marginTop: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        Enter 🌸
                    </motion.button>
                </form>

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
