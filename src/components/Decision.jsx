import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Decision({ onYes, onNo }) {
    const [noText, setNoText] = useState('NO ❌')
    const [noScale, setNoScale] = useState(1)
    const [noOpacity, setNoOpacity] = useState(1)
    const [yesScale, setYesScale] = useState(1)
    const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })
    const [noClickCount, setNoClickCount] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 480)
            setIsTablet(window.innerWidth < 768)
        }
        
        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)
        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    const funTexts = [
        "Are you sure? 🤨",
        "Think again... 🧐",
        "Really? 🥺",
        "Wait! ✋",
        "Ouch! 🤕",
        "Wrong button! 🔄",
        "Maybe YES? 💖",
        "Don't do this! 😭",
        "Last chance! ⏳",
        "Okay, fine... bye! 🏃💨"
    ]

    const handleNoHover = useCallback(() => {
        if (noClickCount >= 10) return

        const x = (Math.random() - 0.5) * 400
        const y = (Math.random() - 0.5) * 400
        
        setNoPosition({ x, y })
        setNoText(funTexts[Math.min(noClickCount, funTexts.length - 1)])
        setNoClickCount(prev => prev + 1)
        setNoScale(prev => Math.max(0, prev - 0.1))
        setYesScale(prev => prev + 0.15)

        if (noClickCount >= 9) {
            setNoOpacity(0)
        }
    }, [noClickCount])

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
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card"
                style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 182, 193, 0.9))',
                    padding: isMobile ? '1.5rem' : isTablet ? '2rem 1rem' : '3rem',
                    borderRadius: '30px',
                    boxShadow: '0 20px 60px rgba(255, 107, 129, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.5)',
                    textAlign: 'center',
                    maxWidth: isMobile ? 'none' : isTablet ? '500px' : '600px',
                    width: isMobile ? '95%' : '90%',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 107, 129, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    margin: '0 auto',
                    boxSizing: 'border-box'
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
                fontSize: isMobile ? '1.8rem' : isTablet ? '2.2rem' : '3.2rem',
                fontWeight: 'bold',
                textShadow: '0 6px 12px rgba(255, 107, 129, 0.4)',
                marginBottom: isMobile ? '15px' : '25px',
                animation: 'glow 3s ease-in-out infinite alternate',
                textAlign: 'center',
                letterSpacing: '1px',
                lineHeight: isMobile ? '1.2' : '1.4'
            }}>
                Would you be my best friend? 💕
            </h1>

            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                    fontFamily: 'var(--font-hand)',
                    fontSize: isMobile ? '1.1rem' : isTablet ? '1.3rem' : '1.6rem',
                    color: '#d63384',
                    marginBottom: isMobile ? '25px' : '35px',
                    fontStyle: 'italic',
                    lineHeight: '1.7',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: isMobile ? '10px 15px' : '15px 25px',
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
                gap: isMobile ? '10px' : isTablet ? '15px' : '20px',
                marginBottom: isMobile ? '20px' : '30px',
                flexWrap: 'wrap'
            }}>
                <div style={{
                    textAlign: 'center',
                    padding: isMobile ? '8px' : '10px',
                    background: 'rgba(255, 182, 193, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 107, 129, 0.2)'
                }}>
                    <div style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', marginBottom: '5px' }}>💝</div>
                    <div style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', color: '#880e4f' }}>Trust</div>
                </div>
                <div style={{
                    textAlign: 'center',
                    padding: isMobile ? '8px' : '10px',
                    background: 'rgba(255, 182, 193, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 107, 129, 0.2)'
                }}>
                    <div style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', marginBottom: '5px' }}>🌟</div>
                    <div style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', color: '#880e4f' }}>Support</div>
                </div>
                <div style={{
                    textAlign: 'center',
                    padding: isMobile ? '8px' : '10px',
                    background: 'rgba(255, 182, 193, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 107, 129, 0.2)'
                }}>
                    <div style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', marginBottom: '5px' }}>💕</div>
                    <div style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', color: '#880e4f' }}>Love</div>
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
                gap: isMobile ? '20px' : isTablet ? '25px' : '30px',
                marginTop: isMobile ? '30px' : isTablet ? '35px' : '40px',
                minHeight: '150px',
                flexDirection: isMobile ? 'column' : 'row',
                position: 'relative',
                maxWidth: '100%',
                margin: '0 auto',
                padding: '20px'
            }}>
                <motion.button
                    animate={{ scale: yesScale }}
                    whileHover={{ scale: yesScale * 1.1 }}
                    whileTap={{ scale: yesScale * 0.9 }}
                    onClick={onYes}
                    style={{
                        padding: isMobile ? '12px 25px' : isTablet ? '15px 35px' : '15px 40px',
                        fontSize: isMobile ? '1.2rem' : isTablet ? '1.4rem' : '1.5rem',
                        background: 'var(--primary)',
                        color: 'white',
                        borderRadius: '50px',
                        boxShadow: '0 10px 30px rgba(255, 107, 129, 0.5)',
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 20,
                        minWidth: isMobile ? '140px' : isTablet ? '160px' : '180px',
                        fontFamily: 'var(--font-fun)',
                        fontWeight: 'bold',
                        transition: 'background 0.3s ease',
                        boxSizing: 'border-box'
                    }}
                >
                    YES ✅
                </motion.button>

                <AnimatePresence>
                    {noOpacity > 0 && (
                        <motion.button
                            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                            animate={{ 
                                x: noPosition.x, 
                                y: noPosition.y,
                                scale: noScale,
                                opacity: noOpacity
                            }}
                            transition={{ type: 'spring', damping: 15, stiffness: 150 }}
                            onMouseEnter={handleNoHover}
                            onClick={handleNoHover}
                            style={{
                                padding: isMobile ? '10px 20px' : isTablet ? '12px 25px' : '12px 30px',
                                fontSize: isMobile ? '1rem' : isTablet ? '1.1rem' : '1.2rem',
                                background: '#e0e0e0',
                                color: '#666',
                                borderRadius: '50px',
                                border: 'none',
                                cursor: 'pointer',
                                minWidth: isMobile ? '120px' : isTablet ? '130px' : '150px',
                                fontFamily: 'var(--font-fun)',
                                fontWeight: 'bold',
                                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                                zIndex: 10,
                                position: noClickCount > 0 ? 'absolute' : 'relative',
                                boxSizing: 'border-box'
                            }}
                        >
                            {noText}
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
