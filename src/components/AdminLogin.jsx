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
            
            // Note: Session management should use database or secure storage
            // localStorage removed as requested
            
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
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated background elements */}
            <motion.div
                animate={{ 
                    x: [0, 100, 0],
                    y: [0, -100, 0],
                    rotate: [0, 180, 360]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    top: '10%',
                    left: '10%'
                }}
            />
            <motion.div
                animate={{ 
                    x: [0, -100, 0],
                    y: [0, 100, 0],
                    rotate: [0, -180, -360]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                    borderRadius: '50%',
                    bottom: '20%',
                    right: '15%'
                }}
            />
            <motion.div
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    width: '150px',
                    height: '150px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
                    borderRadius: '50%',
                    top: '60%',
                    left: '5%'
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                    background: 'rgba(255, 255, 255, 0.98)',
                    padding: window.innerWidth < 768 ? '35px 30px' : '50px 45px',
                    borderRadius: '25px',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 10px 25px rgba(0, 0, 0, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    maxWidth: window.innerWidth < 768 ? '95%' : '480px',
                    width: '100%',
                    backdropFilter: 'blur(20px)',
                    position: 'relative',
                    zIndex: 10
                }}
            >
                {/* Decorative top border */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '0',
                    right: '0',
                    height: '4px',
                    background: 'linear-gradient(90deg, #667eea, #764ba2, #667eea)',
                    borderRadius: '25px 25px 0 0'
                }} />

                <div style={{ textAlign: 'center', marginBottom: window.innerWidth < 768 ? '30px' : '40px' }}>
                    <motion.div
                        animate={{ 
                            rotate: [0, -10, 10, -10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                            rotate: { repeat: Infinity, duration: 4 },
                            scale: { repeat: Infinity, duration: 2 }
                        }}
                        style={{ 
                            fontSize: window.innerWidth < 768 ? '3rem' : '4rem', 
                            marginBottom: '20px',
                            filter: 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3))'
                        }}
                    >
                        🔐
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            color: '#2d3748',
                            fontSize: window.innerWidth < 768 ? '1.8rem' : '2.2rem',
                            marginBottom: '12px',
                            fontFamily: 'Georgia, serif',
                            fontWeight: 'bold',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}
                    >
                        Admin Portal
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            color: '#718096',
                            fontSize: window.innerWidth < 768 ? '0.95rem' : '1.1rem',
                            marginBottom: '25px',
                            fontWeight: '400'
                        }}
                    >
                        Secure Access to Management System
                    </motion.p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <label style={{
                            display: 'block',
                            color: '#4a5568',
                            fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
                            marginBottom: '10px',
                            fontWeight: '600',
                            letterSpacing: '0.5px'
                        }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '1.2rem',
                                color: '#a0aec0'
                            }}>
                                📧
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: window.innerWidth < 768 ? '15px 15px 15px 45px' : '18px 15px 18px 45px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontSize: window.innerWidth < 768 ? '0.95rem' : '1rem',
                                    fontFamily: 'Georgia, serif',
                                    transition: 'all 0.3s ease',
                                    boxSizing: 'border-box',
                                    background: '#f8fafc'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#667eea'
                                    e.target.style.background = '#ffffff'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e2e8f0'
                                    e.target.style.background = '#f8fafc'
                                    e.target.style.boxShadow = 'none'
                                }}
                                placeholder="admin@example.com"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <label style={{
                            display: 'block',
                            color: '#4a5568',
                            fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
                            marginBottom: '10px',
                            fontWeight: '600',
                            letterSpacing: '0.5px'
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '1.2rem',
                                color: '#a0aec0'
                            }}>
                                🔑
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: window.innerWidth < 768 ? '15px 50px 15px 45px' : '18px 50px 18px 45px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    fontSize: window.innerWidth < 768 ? '0.95rem' : '1rem',
                                    fontFamily: 'Georgia, serif',
                                    transition: 'all 0.3s ease',
                                    boxSizing: 'border-box',
                                    background: '#f8fafc'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#667eea'
                                    e.target.style.background = '#ffffff'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e2e8f0'
                                    e.target.style.background = '#f8fafc'
                                    e.target.style.boxShadow = 'none'
                                }}
                                placeholder="Enter your password"
                            />
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1.3rem',
                                    color: '#718096',
                                    padding: '5px',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#667eea'}
                                onMouseLeave={(e) => e.target.style.color = '#718096'}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </motion.button>
                        </div>
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            style={{
                                background: 'linear-gradient(135deg, rgba(245, 101, 101, 0.1), rgba(229, 62, 62, 0.05))',
                                border: '1px solid rgba(245, 101, 101, 0.3)',
                                color: '#c53030',
                                padding: window.innerWidth < 768 ? '12px 16px' : '14px 18px',
                                borderRadius: '10px',
                                fontSize: window.innerWidth < 768 ? '0.85rem' : '0.9rem',
                                textAlign: 'center',
                                fontWeight: '500'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        style={{
                            background: loading 
                                ? 'linear-gradient(135deg, #a0aec0, #718096)' 
                                : 'linear-gradient(135deg, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            padding: window.innerWidth < 768 ? '16px 24px' : '18px 28px',
                            borderRadius: '12px',
                            fontSize: window.innerWidth < 768 ? '1rem' : '1.1rem',
                            fontFamily: 'Georgia, serif',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: loading 
                                ? '0 4px 15px rgba(160, 174, 192, 0.3)' 
                                : '0 8px 25px rgba(102, 126, 234, 0.4), 0 4px 15px rgba(118, 75, 162, 0.3)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    style={{ 
                                        width: '18px', 
                                        height: '18px', 
                                        border: '2px solid white', 
                                        borderTop: '2px solid transparent', 
                                        borderRadius: '50%' 
                                    }}
                                />
                                Authenticating...
                            </span>
                        ) : (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                🔐 Secure Login
                            </span>
                        )}
                    </motion.button>
                </form>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    style={{
                        textAlign: 'center',
                        marginTop: window.innerWidth < 768 ? '25px' : '35px'
                    }}
                >
                    <motion.button
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.history.back()}
                        style={{
                            background: 'transparent',
                            color: '#718096',
                            border: '1px solid #cbd5e0',
                            padding: window.innerWidth < 768 ? '10px 20px' : '12px 24px',
                            borderRadius: '10px',
                            fontSize: window.innerWidth < 768 ? '0.85rem' : '0.9rem',
                            cursor: 'pointer',
                            fontFamily: 'Georgia, serif',
                            transition: 'all 0.3s ease',
                            fontWeight: '500'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(102, 126, 234, 0.05)'
                            e.target.style.borderColor = '#667eea'
                            e.target.style.color = '#667eea'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent'
                            e.target.style.borderColor = '#cbd5e0'
                            e.target.style.color = '#718096'
                        }}
                    >
                        ← Return to Application
                    </motion.button>
                </motion.div>

                {/* Bottom decorative element */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '0',
                    right: '0',
                    height: '3px',
                    background: 'linear-gradient(90deg, #764ba2, #667eea, #764ba2)',
                    borderRadius: '0 0 25px 25px'
                }} />
            </motion.div>
        </div>
    )
}
