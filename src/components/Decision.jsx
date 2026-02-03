import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Decision({ onYes, onNo }) {
    const [noCount, setNoCount] = useState(0)
    const [noPos, setNoPos] = useState({ x: 0, y: 0 })
    const [noText, setNoText] = useState('NO ❌')
    const [yesScale, setYesScale] = useState(1)

    const noTexts = [
        'Are you sure?',
        'Think again!',
        'Last chance!',
        'Really?',
        'Don\'t do this!',
        'I will cry 😢',
        'Please? 🥺',
        'Wrong button!',
        'Missed me!',
        'Try the other one!',
        'Nice try!',
        'Nope!',
        'Not this one!',
        'You can\'t catch me! 😜',
        'Too slow! ⚡',
        'Nice attempt! 😂',
        'Keep trying! 🏃‍♀️',
        'Almost there! (not really) 🤪',
        'Your mouse is broken! 🖱️',
        'I\'m invincible! 💪',
        'Give up yet? 😏',
        'This is fun! 🎮',
        'You\'ll never get me! 🏃',
        'Touch me if you can! 👆',
        'I\'m like a ghost! 👻',
        'Nope! Not today! 🙅‍♀️',
        'Try harder! 💪',
        'I\'m everywhere! 🌍',
        'Catch me if you can! 🏃‍♀️',
        'You\'re getting warmer! (cold actually) 🧊'
    ]

    const moveNoButton = (e) => {
        e.preventDefault()
        
        // Get container dimensions instead of viewport
        const containerWidth = Math.min(window.innerWidth - 100, 800) // Max 800px, min viewport-100px
        const containerHeight = Math.min(window.innerHeight - 200, 600) // Max 600px, min viewport-200px
        const buttonWidth = 120
        const buttonHeight = 50
        
        // Calculate safe zones within container
        const maxX = (containerWidth / 2) - buttonWidth - 20
        const maxY = (containerHeight / 2) - buttonHeight - 20
        const minX = -(containerWidth / 2) + buttonWidth + 20
        const minY = -(containerHeight / 2) + buttonHeight + 20
        
        // Generate random position within safe zones
        const randomX = Math.random() * (maxX - minX) + minX
        const randomY = Math.random() * (maxY - minY) + minY
        
        // Move button to random position
        setNoPos({ x: randomX, y: randomY })
        setNoCount(prev => prev + 1)

        // Change text randomly
        const randomIndex = Math.floor(Math.random() * noTexts.length)
        setNoText(noTexts[randomIndex])

        // Make YES bigger
        setYesScale(prev => Math.min(prev + 0.05, 3)) // Cap at 3x
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
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 182, 193, 0.9))',
                    padding: window.innerWidth < 480 ? '1.5rem' : window.innerWidth < 768 ? '2rem 1rem' : '3rem',
                    borderRadius: '30px',
                    boxShadow: '0 20px 60px rgba(255, 107, 129, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.5)',
                    textAlign: 'center',
                    maxWidth: window.innerWidth < 480 ? '350px' : window.innerWidth < 768 ? '500px' : '600px',
                    width: window.innerWidth < 480 ? '90%' : '95%',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 107, 129, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative corners */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    width: '30px',
                    height: '30px',
                    borderTop: '3px solid #ff6b81',
                    borderLeft: '3px solid #ff6b81',
                    borderRadius: '10px 0 0 0'
                }} />
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '30px',
                    height: '30px',
                    borderTop: '3px solid #ff6b81',
                    borderRight: '3px solid #ff6b81',
                    borderRadius: '0 10px 0 0'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    width: '30px',
                    height: '30px',
                    borderBottom: '3px solid #ff6b81',
                    borderLeft: '3px solid #ff6b81',
                    borderRadius: '0 0 0 10px'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    width: '30px',
                    height: '30px',
                    borderBottom: '3px solid #ff6b81',
                    borderRight: '3px solid #ff6b81',
                    borderRadius: '0 0 10px 0'
                }} />

            <h1 style={{
                background: 'linear-gradient(45deg, #ff6b81, #ff8fa3, #ffa5c0, #ffd700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'var(--font-antique)',
                fontSize: window.innerWidth < 480 ? '1.8rem' : window.innerWidth < 768 ? '2.2rem' : '3.2rem',
                fontWeight: 'bold',
                textShadow: '0 6px 12px rgba(255, 107, 129, 0.4)',
                marginBottom: window.innerWidth < 480 ? '15px' : '25px',
                animation: 'glow 3s ease-in-out infinite alternate',
                textAlign: 'center',
                letterSpacing: '1px',
                lineHeight: window.innerWidth < 480 ? '1.2' : '1.4'
            }}>
                Would you be my best friend? 💕
            </h1>

            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                    fontFamily: 'var(--font-hand)',
                    fontSize: window.innerWidth < 480 ? '1.1rem' : window.innerWidth < 768 ? '1.3rem' : '1.6rem',
                    color: '#d63384',
                    marginBottom: window.innerWidth < 480 ? '25px' : '35px',
                    fontStyle: 'italic',
                    lineHeight: '1.7',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: window.innerWidth < 480 ? '10px 15px' : '15px 25px',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 107, 129, 0.3)',
                    backdropFilter: 'blur(5px)'
                }}
            >
                "True friendship is the most precious gift one can receive..." ✨
            </motion.p>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: window.innerWidth < 480 ? '10px' : '20px',
                marginBottom: window.innerWidth < 480 ? '20px' : '30px',
                flexWrap: 'wrap'
            }}>
                <div style={{
                    textAlign: 'center',
                    padding: window.innerWidth < 480 ? '8px' : '10px',
                    background: 'rgba(255, 182, 193, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 107, 129, 0.2)'
                }}>
                    <div style={{ fontSize: window.innerWidth < 480 ? '1.2rem' : '1.5rem', marginBottom: '5px' }}>💝</div>
                    <div style={{ fontSize: window.innerWidth < 480 ? '0.8rem' : '0.9rem', color: '#880e4f' }}>Trust</div>
                </div>
                <div style={{
                    textAlign: 'center',
                    padding: window.innerWidth < 480 ? '8px' : '10px',
                    background: 'rgba(255, 182, 193, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 107, 129, 0.2)'
                }}>
                    <div style={{ fontSize: window.innerWidth < 480 ? '1.2rem' : '1.5rem', marginBottom: '5px' }}>🌟</div>
                    <div style={{ fontSize: window.innerWidth < 480 ? '0.8rem' : '0.9rem', color: '#880e4f' }}>Support</div>
                </div>
                <div style={{
                    textAlign: 'center',
                    padding: window.innerWidth < 480 ? '8px' : '10px',
                    background: 'rgba(255, 182, 193, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 107, 129, 0.2)'
                }}>
                    <div style={{ fontSize: window.innerWidth < 480 ? '1.2rem' : '1.5rem', marginBottom: '5px' }}>💕</div>
                    <div style={{ fontSize: window.innerWidth < 480 ? '0.8rem' : '0.9rem', color: '#880e4f' }}>Love</div>
                </div>
            </div>

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

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: window.innerWidth < 480 ? '20px' : window.innerWidth < 768 ? '25px' : '30px',
                marginTop: window.innerWidth < 480 ? '30px' : window.innerWidth < 768 ? '35px' : '40px',
                minHeight: window.innerWidth < 480 ? '120px' : '100px',
                flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                position: 'relative',
                maxWidth: window.innerWidth < 480 ? '300px' : window.innerWidth < 768 ? '400px' : '500px',
                margin: '0 auto'
            }}>
                <motion.button
                    whileHover={{ scale: yesScale * 1.1 }}
                    whileTap={{ scale: yesScale * 0.9 }}
                    animate={{ scale: yesScale }}
                    onClick={onYes}
                    style={{
                        padding: window.innerWidth < 480 ? '12px 25px' : '15px 40px',
                        fontSize: window.innerWidth < 480 ? '1.2rem' : '1.5rem',
                        background: 'var(--primary)',
                        color: 'white',
                        borderRadius: '50px',
                        boxShadow: '0 5px 15px rgba(255, 107, 129, 0.4)',
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 10,
                        minWidth: window.innerWidth < 480 ? '120px' : '140px',
                        fontFamily: 'var(--font-fun)',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease'
                    }}
                >
                    YES ✅
                </motion.button>

                <motion.button
                    animate={noPos}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    onMouseEnter={moveNoButton}
                    onTouchStart={moveNoButton}
                    onClick={(e) => {
                        e.preventDefault()
                        moveNoButton(e)
                    }}
                    style={{
                        padding: window.innerWidth < 480 ? '12px 25px' : '15px 40px',
                        fontSize: window.innerWidth < 480 ? '1rem' : '1.2rem',
                        background: '#e0e0e0',
                        color: '#666',
                        borderRadius: '50px',
                        border: 'none',
                        position: 'relative',
                        cursor: 'not-allowed',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none',
                        minWidth: window.innerWidth < 480 ? '120px' : '140px',
                        fontFamily: 'var(--font-fun)',
                        fontWeight: 'bold',
                        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {noText}
                </motion.button>
            </div>

            {noCount > 5 && <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#999', fontStyle: 'italic' }}>Why are you trying to click No? Just say YES already! 😢</p>}

        </motion.div>
    )
}
