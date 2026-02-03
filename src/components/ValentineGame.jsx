import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function ValentineGame({ onWin }) {
    const [gameStarted, setGameStarted] = useState(false)
    const [score, setScore] = useState(0)
    const [hearts, setHearts] = useState([])
    const [level, setLevel] = useState(1)
    const [levelScore, setLevelScore] = useState(0)
    const [showLevelComplete, setShowLevelComplete] = useState(false)
    const [gameOver, setGameOver] = useState(false)

    const levels = [
        { name: 'Sweet Beginning', target: 10, speed: 2, background: '#ffebee' },
        { name: 'Growing Love', target: 15, speed: 1.8, background: '#fce4ec' },
        { name: 'True Romance', target: 20, speed: 1.5, background: '#f8bbd9' },
        { name: 'Eternal Love', target: 25, speed: 1.2, background: '#f48fb1' },
        { name: 'Perfect Match', target: 30, speed: 1, background: '#f06292' }
    ]

    const currentLevel = levels[level - 1] || levels[0]

    const spawnHeart = useCallback(() => {
        const id = Date.now() + Math.random()
        const x = Math.random() * 300 + 50
        const size = 25 + Math.random() * 20
        const duration = currentLevel.speed + Math.random() * 1

        setHearts(prev => [...prev, { id, x, size, duration }])

        setTimeout(() => {
            setHearts(prev => prev.filter(h => h.id !== id))
        }, duration * 1000)
    }, [currentLevel])

    useEffect(() => {
        if (gameStarted && !gameOver && !showLevelComplete) {
            const interval = setInterval(spawnHeart, 1200)
            return () => clearInterval(interval)
        }
    }, [gameStarted, gameOver, showLevelComplete, spawnHeart])

    useEffect(() => {
        if (levelScore >= currentLevel.target) {
            setShowLevelComplete(true)
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            })
            
            setTimeout(() => {
                if (level >= levels.length) {
                    setGameOver(true)
                    setTimeout(onWin, 3000)
                } else {
                    setLevel(prev => prev + 1)
                    setLevelScore(0)
                    setShowLevelComplete(false)
                }
            }, 2000)
        }
    }, [levelScore, level, currentLevel.target, levels.length, onWin])

    const catchHeart = useCallback((heartId) => {
        setScore(prev => prev + 1)
        setLevelScore(prev => prev + 1)
        setHearts(prev => prev.filter(h => h.id !== heartId))
    }, [])

    return (
        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            background: currentLevel.background,
            border: '2px solid #d81b60',
            borderRadius: '12px',
            overflow: 'hidden',
            fontFamily: 'Georgia, serif'
        }}>
            {!gameStarted ? (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '30px',
                    borderRadius: '15px',
                    border: '2px solid #d81b60',
                    boxShadow: '0 8px 25px rgba(216, 27, 96, 0.2)'
                }}>
                    <h2 style={{
                        color: '#880e4f',
                        fontSize: '1.5rem',
                        marginBottom: '15px',
                        fontFamily: 'Georgia, serif'
                    }}>
                        💕 Heart Catcher 💕
                    </h2>
                    <p style={{
                        color: '#ad1457',
                        fontSize: '1rem',
                        marginBottom: '10px'
                    }}>
                        Level {level}: {currentLevel.name}
                    </p>
                    <p style={{
                        color: '#6a1b9a',
                        fontSize: '0.9rem',
                        marginBottom: '20px'
                    }}>
                        Catch {currentLevel.target} hearts to advance
                    </p>
                    <button
                        onClick={() => setGameStarted(true)}
                        style={{
                            background: '#d81b60',
                            color: 'white',
                            border: 'none',
                            padding: '12px 25px',
                            borderRadius: '25px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            fontFamily: 'Georgia, serif',
                            boxShadow: '0 4px 15px rgba(216, 27, 96, 0.3)'
                        }}
                    >
                        Start Game
                    </button>
                </div>
            ) : (
                <>
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: '#880e4f',
                        border: '1px solid #d81b60'
                    }}>
                        <div>Level {level}: {currentLevel.name}</div>
                        <div>Hearts: {levelScore}/{currentLevel.target}</div>
                        <div>Total: {score}</div>
                    </div>

                    {hearts.map(heart => (
                        <div
                            key={heart.id}
                            onClick={() => catchHeart(heart.id)}
                            style={{
                                position: 'absolute',
                                left: `${heart.x}px`,
                                top: `${heart.y}px`,
                                fontSize: `${heart.size}px`,
                                cursor: 'pointer',
                                userSelect: 'none',
                                animation: `fall ${heart.duration}s linear`,
                                filter: 'drop-shadow(0 2px 4px rgba(216, 27, 96, 0.3))'
                            }}
                        >
                            ❤️
                        </div>
                    ))}

                    <AnimatePresence>
                        {showLevelComplete && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    padding: '25px',
                                    borderRadius: '15px',
                                    textAlign: 'center',
                                    border: '2px solid #d81b60',
                                    boxShadow: '0 8px 25px rgba(216, 27, 96, 0.3)'
                                }}
                            >
                                <h3 style={{
                                    color: '#880e4f',
                                    fontSize: '1.3rem',
                                    marginBottom: '10px',
                                    fontFamily: 'Georgia, serif'
                                }}>
                                    💕 Level {level} Complete! 💕
                                </h3>
                                <p style={{
                                    color: '#ad1457',
                                    fontSize: '1rem'
                                }}>
                                    Beautiful! Get ready for Level {level + 1}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {gameOver && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    padding: '30px',
                                    borderRadius: '15px',
                                    textAlign: 'center',
                                    border: '2px solid #d81b60',
                                    boxShadow: '0 8px 25px rgba(216, 27, 96, 0.3)'
                                }}
                            >
                                <h2 style={{
                                    color: '#880e4f',
                                    fontSize: '1.5rem',
                                    marginBottom: '15px',
                                    fontFamily: 'Georgia, serif'
                                }}>
                                    💕 Perfect Love! 💕
                                </h2>
                                <p style={{
                                    color: '#ad1457',
                                    fontSize: '1.1rem'
                                }}>
                                    You scored {score} points! You're amazing! 💕
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}

            <style jsx>{`
                @keyframes fall {
                    from {
                        transform: translateY(-50px);
                    }
                    to {
                        transform: translateY(500px);
                    }
                }
            `}</style>
        </div>
    )
}
