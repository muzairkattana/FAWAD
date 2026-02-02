import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Decision({ onYes, onNo }) {
    const [noCount, setNoCount] = useState(0)
    const [noPos, setNoPos] = useState({ x: 0, y: 0 })

    const moveNoButton = () => {
        // Move it slightly to make it "shy"
        const x = Math.random() * 150 - 75
        const y = Math.random() * 150 - 75
        setNoPos({ x, y })
        setNoCount(prev => prev + 1)
    }

    const handleNoClick = () => {
        // If somehow clicked
        onNo()
    }

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card"
            style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '3rem',
                borderRadius: '20px',
                boxShadow: 'var(--shadow-card)',
                textAlign: 'center',
                maxWidth: '500px',
                width: '90%'
            }}
        >
            <h1 style={{ color: 'var(--primary)', fontFamily: 'var(--font-fun)', fontSize: '2.5rem' }}>
                Hypervisor has a very important question for you 🥹💌
            </h1>

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

            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '40px' }}>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onYes}
                    style={{
                        padding: '15px 40px',
                        fontSize: '1.5rem',
                        background: 'var(--primary)',
                        color: 'white',
                        borderRadius: '50px',
                        boxShadow: '0 5px 15px rgba(255, 107, 129, 0.4)'
                    }}
                >
                    YES ✅
                </motion.button>

                <motion.button
                    animate={noPos}
                    transition={{ type: 'spring', stiffness: 300 }}
                    onMouseEnter={moveNoButton}
                    onClick={handleNoClick}
                    style={{
                        padding: '15px 40px',
                        fontSize: '1.2rem',
                        background: '#e0e0e0',
                        color: '#666',
                        borderRadius: '50px'
                    }}
                >
                    NO ❌
                </motion.button>
            </div>

            {noCount > 2 && <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#999' }}>Why are you trying to click No? 😢</p>}

        </motion.div>
    )
}
