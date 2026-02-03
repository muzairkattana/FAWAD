import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ValentineGame({ onWin }) {
    const [score, setScore] = useState(0)
    const [hearts, setHearts] = useState([])
    const [gameOver, setGameOver] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [level, setLevel] = useState(1)
    const [levelScore, setLevelScore] = useState(0)
    const [showLevelComplete, setShowLevelComplete] = useState(false)

    const levels = [
        { name: 'Beginner Love', target: 10, speed: 2, spawnRate: 1000, heartSize: { min: 30, max: 50 } },
        { name: 'Sweet Heart', target: 15, speed: 1.8, spawnRate: 800, heartSize: { min: 25, max: 45 } },
        { name: 'Love Master', target: 20, speed: 1.5, spawnRate: 600, heartSize: { min: 20, max: 40 } },
        { name: 'Cupid Champion', target: 25, speed: 1.2, spawnRate: 500, heartSize: { min: 15, max: 35 } },
        { name: 'Legendary Love', target: 30, speed: 1, spawnRate: 400, heartSize: { min: 10, max: 30 } }
    ]

    const currentLevel = levels[level - 1] || levels[0]

    const spawnHeart = useCallback(() => {
        const id = Date.now() + Math.random()
        const x = Math.random() * (window.innerWidth - (window.innerWidth < 768 ? 80 : 50))
        const sizeRange = currentLevel.heartSize
        const size = sizeRange.min + Math.random() * (sizeRange.max - sizeRange.min)
        const duration = currentLevel.speed + Math.random() * 1

        setHearts(prev => [...prev, { id, x, size, duration }])

        // Remove heart after it falls
        setTimeout(() => {
            setHearts(prev => prev.filter(h => h.id !== id))
        }, duration * 1000)
    }, [currentLevel])

    useEffect(() => {
        if (gameStarted && !gameOver && !showLevelComplete) {
            const interval = setInterval(spawnHeart, currentLevel.spawnRate)
            return () => clearInterval(interval)
        }
    }, [gameStarted, gameOver, showLevelComplete, spawnHeart, currentLevel.spawnRate])

    useEffect(() => {
        if (levelScore >= currentLevel.target) {
            setShowLevelComplete(true)
            setTimeout(() => {
                if (level >= levels.length) {
                    setGameOver(true)
                    setTimeout(onWin, 2000)
                } else {
                    setLevel(prev => prev + 1)
                    setLevelScore(0)
                    setShowLevelComplete(false)
                }
            }, 2000)
        }
    }, [levelScore, level, currentLevel.target, levels.length, onWin])

    const catchHeart = (id) => {
        setScore(prev => prev + 1)
        setLevelScore(prev => prev + 1)
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
                    <h2 style={{ color: '#ff4757', fontFamily: 'var(--font-fun)', fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem' }}>Heart Catcher 🏹</h2>
                    <p style={{ color: '#5d4037', marginBottom: '20px', fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem' }}>Level {level}: {currentLevel.name} - Catch {currentLevel.target} hearts!</p>
                    <div style={{ marginBottom: '20px', fontSize: window.innerWidth < 768 ? '1rem' : '1.2rem', color: '#ff6b81' }}>
                        Total Score: {score} | Level Progress: {levelScore}/{currentLevel.target}
                    </div>
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
                            fontSize: window.innerWidth < 768 ? '1rem' : '1.2rem',
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
                        fontSize: window.innerWidth < 768 ? '1rem' : '1.2rem',
                        fontWeight: 'bold',
                        color: '#ff4757',
                        zIndex: 10,
                        textAlign: 'left'
                    }}>
                        Level {level}<br />
                        Hearts: {levelScore}/{currentLevel.target}<br />
                        Total: {score}
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

                    {showLevelComplete && (
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
                            <h2 style={{ color: '#ff4757', fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem' }}>Level {level} Complete! 🎉</h2>
                            <p style={{ fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem' }}>Great job! Get ready for Level {level + 1}!</p>
                        </motion.div>
                    )}

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
                            <h2 style={{ color: '#ff4757', fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem' }}>Legendary Love Master! �</h2>
                            <p style={{ fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem' }}>You caught all {score} hearts! You're amazing!</p>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    )
}
