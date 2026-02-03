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
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const buttonWidth = 120
        const buttonHeight = 50
        
        // Calculate safe zones (avoid moving off screen)
        const maxX = viewportWidth - buttonWidth - 50
        const maxY = viewportHeight - buttonHeight - 50
        const minX = 50
        const minY = 100
        
        // Generate random position within safe zones
        const randomX = Math.random() * (maxX - minX) + minX
        const randomY = Math.random() * (maxY - minY) + minY
        
        // Move button to random position
        setNoPos({ x: randomX - (viewportWidth / 2), y: randomY - (viewportHeight / 2) })
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
                background: 'rgba(255, 255, 255, 0.95)',
                padding: window.innerWidth < 768 ? '2rem 1rem' : '3rem',
                borderRadius: '20px',
                boxShadow: 'var(--shadow-card)',
                textAlign: 'center',
                maxWidth: '500px',
                width: '95%'
            }}
        >
            <h1 style={{
                color: 'var(--primary)',
                fontFamily: 'var(--font-fun)',
                fontSize: window.innerWidth < 768 ? '1.8rem' : '2.5rem'
            }}>
                Thanks for being my bestie 🥹💌
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

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: window.innerWidth < 768 ? '15px' : '30px',
                marginTop: window.innerWidth < 768 ? '20px' : '40px',
                minHeight: '100px',
                flexDirection: window.innerWidth < 768 ? 'column' : 'row'
            }}>
                <motion.button
                    whileHover={{ scale: yesScale * 1.1 }}
                    whileTap={{ scale: yesScale * 0.9 }}
                    animate={{ scale: yesScale }}
                    onClick={onYes}
                    style={{
                        padding: '15px 40px',
                        fontSize: '1.5rem',
                        background: 'var(--primary)',
                        color: 'white',
                        borderRadius: '50px',
                        boxShadow: '0 5px 15px rgba(255, 107, 129, 0.4)',
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 10
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
                        padding: '15px 40px',
                        fontSize: '1.2rem',
                        background: '#e0e0e0',
                        color: '#666',
                        borderRadius: '50px',
                        border: 'none',
                        position: 'relative',
                        cursor: 'not-allowed',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none'
                    }}
                >
                    {noText}
                </motion.button>
            </div>

            {noCount > 5 && <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#999', fontStyle: 'italic' }}>Why are you trying to click No? Just say YES already! 😢</p>}

        </motion.div>
    )
}
