import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ValentineGame({ onWin }) {
    const [score, setScore] = useState(0)
    const [hearts, setHearts] = useState([])
    const [gameOver, setGameOver] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)

    const spawnHeart = useCallback(() => {
        const id = Date.now() + Math.random()
        const x = Math.random() * (window.innerWidth - 50)
        const size = 30 + Math.random() * 30
        const duration = 2 + Math.random() * 2

        setHearts(prev => [...prev, { id, x, size, duration }])

        // Remove heart after it falls
        setTimeout(() => {
            setHearts(prev => prev.filter(h => h.id !== id))
        }, duration * 1000)
    }, [])

    useEffect(() => {
        if (gameStarted && !gameOver) {
            const interval = setInterval(spawnHeart, 800)
            return () => clearInterval(interval)
        }
    }, [gameStarted, gameOver, spawnHeart])

    useEffect(() => {
        if (score >= 15) {
            setGameOver(true)
            setTimeout(onWin, 2000)
        }
    }, [score, onWin])

    const catchHeart = (id) => {
        setScore(prev => prev + 1)
        setHearts(prev => prev.filter(h => h.id !== id))
    }

    return (
        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            background: 'rgba(255, 182, 193, 0.1)',
            borderRadius: '20px',
            border: '2px dashed #ff6b81',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'crosshair'
        }}>
            {!gameStarted ? (
                <div style={{ textAlign: 'center', zIndex: 10 }}>
                    <h2 style={{ color: '#ff4757', fontFamily: 'var(--font-fun)' }}>Heart Catcher 🏹</h2>
                    <p style={{ color: '#5d4037', marginBottom: '20px' }}>Catch 15 hearts to reveal the secret!</p>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setGameStarted(true)}
                        style={{
                            padding: '10px 30px',
                            background: '#ff6b81',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            fontSize: '1.2rem',
                            cursor: 'pointer'
                        }}
                    >
                        Start Game!
                    </motion.button>
                </div>
            ) : (
                <>
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#ff4757',
                        zIndex: 10
                    }}>
                        Hearts: {score} / 15
                    </div>

                    <AnimatePresence>
                        {hearts.map(heart => (
                            <motion.div
                                key={heart.id}
                                initial={{ y: -100, x: heart.x, opacity: 1 }}
                                animate={{ y: window.innerHeight }}
                                transition={{ duration: heart.duration, ease: 'linear' }}
                                onClick={() => catchHeart(heart.id)}
                                style={{
                                    position: 'absolute',
                                    fontSize: `${heart.size}px`,
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                }}
                            >
                                ❤️
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {gameOver && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                                position: 'absolute',
                                background: 'white',
                                padding: '30px',
                                borderRadius: '20px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                textAlign: 'center',
                                zIndex: 100
                            }}
                        >
                            <h2 style={{ color: '#ff4757' }}>Well Done! 🎉</h2>
                            <p>You caught all the love!</p>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    )
}
