import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import AntiqueChat from './AntiqueChat'
import ValentineGame from './ValentineGame'
import TicTacToeGame from './TicTacToeGame'

export default function ThankYou({ onLogout }) {
    const [isOpen, setIsOpen] = useState(false)

    const handleOpen = () => {
        setIsOpen(true)
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        })
    }

    const [showReasons, setShowReasons] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const [showGame, setShowGame] = useState(false)
    const [showTicTacToe, setShowTicTacToe] = useState(false)

    const reasons = [
        "Your smile debugs my worst days ☀️",
        "You're the coolest hypervisor I know 💻",
        "You make every moment feel high-definition ✨",
        "More precious than a bug-free production push 🚀",
        "You have the kindest soul I've ever met 💖"
    ]

    const specialMoments = [
        "Every moment with you is like deploying to production - exciting and rewarding! 🚀",
        "You're the missing semicolon in my life's code - completing everything perfectly! 💻",
        "Like a perfect algorithm, you make my heart run in O(1) time! ⚡",
        "You're my favorite API - always reliable and full of amazing responses! 💝"
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                width: '100%',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: window.innerWidth < 768 ? '40px 20px' : '100px 20px',
                background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://www.transparenttextures.com/patterns/aged-paper.png")',
                backgroundColor: '#1b110e',
                overflowY: 'auto'
            }}
        >
            {!isOpen ? (
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 1, 0] }}
                    transition={{ rotate: { duration: 0.5, repeat: Infinity, repeatDelay: 1 } }}
                    onClick={handleOpen}
                    style={{
                        cursor: 'pointer',
                        background: '#f4e7d1',
                        padding: window.innerWidth < 768 ? '30px 20px' : '40px',
                        borderRadius: '10px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        maxWidth: window.innerWidth < 768 ? '300px' : '400px',
                        textAlign: 'center',
                        position: 'relative',
                        border: '2px solid #d4c5a9'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        height: '90%',
                        border: '2px dashed #bfa588',
                        pointerEvents: 'none'
                    }} />

                    <h2 style={{
                        fontFamily: 'var(--font-antique)',
                        color: '#5d4037',
                        fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem',
                        marginBottom: '10px',
                        animation: 'pulse 2s infinite'
                    }}>
                        A Secret Checkpoint 🔒
                    </h2>
                    <p style={{ fontFamily: 'var(--font-typewriter)', color: '#795548' }}>
                        Tap to open the letter...
                    </p>
                    <div style={{
                        marginTop: '20px',
                        fontSize: window.innerWidth < 768 ? '2rem' : '3rem',
                        filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.2))',
                        animation: 'bounce 2s infinite'
                    }}>
                        💌
                    </div>
                    <p style={{
                        marginTop: '15px',
                        fontFamily: 'var(--font-typewriter)',
                        color: '#d32f2f',
                        fontSize: '0.9rem',
                        fontStyle: 'italic'
                    }}>
                        Click here to reveal your special message! ✨
                    </p>
                </motion.div>
            ) : (
                <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, rotateX: 90 }}
                        animate={{ opacity: 1, rotateX: 0 }}
                        transition={{ duration: 0.8, type: 'spring' }}
                        style={{
                            background: '#fcf6e8',
                            backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
                            width: '100%',
                            padding: window.innerWidth < 768 ? '1.5rem' : '3rem',
                            borderRadius: '5px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                            position: 'relative',
                            color: '#4e342e'
                        }}
                    >
                        {/* Decorative Postmark */}
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            right: '25px',
                            width: '80px',
                            height: '80px',
                            border: '2px double #a1887f',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'rotate(-15deg)',
                            opacity: 0.6,
                            fontFamily: 'var(--font-typewriter)',
                            fontSize: '0.8rem',
                            textAlign: 'center',
                            lineHeight: '1.2'
                        }}>
                            VALENTINE<br />POST<br />2025
                        </div>

                        <h1 style={{
                            fontFamily: 'var(--font-antique)',
                            fontSize: window.innerWidth < 768 ? '1.8rem' : '2.5rem',
                            marginBottom: '30px',
                            textAlign: 'center',
                            color: '#3e2723',
                            borderBottom: '2px solid #d7ccc8',
                            paddingBottom: '20px'
                        }}>
                            My Dearest Ayesha 🌹
                        </h1>

                        <div style={{
                            fontFamily: 'var(--font-typewriter)',
                            fontSize: window.innerWidth < 768 ? '1rem' : '1.1rem',
                            lineHeight: '1.8',
                            textAlign: 'justify'
                        }}>
                            <p>
                                If you are reading this, it means you survived the login screen (and my terrible jokes). 🤭
                            </p>
                            <p>
                                I just wanted to take a moment to tell you how incredibly special you are. You bring so much joy, laughter, and "bug-free" happiness into my life.
                                Like a well-optimized algorithm, you make everything run smoother. ✨
                            </p>
                            <p>
                                Thank you for being my best friend, my confidant, and my favorite person to annoy.
                                I promise to always be there to debug your bad days and deploy smiles whenever possible.
                            </p>

                            {!showReasons ? (
                                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowReasons(true)}
                                        style={{
                                            background: 'linear-gradient(45deg, #ff6b81, #ff8fa3)',
                                            color: 'white',
                                            padding: '12px 25px',
                                            borderRadius: '25px',
                                            cursor: 'pointer',
                                            border: 'none',
                                            fontFamily: 'var(--font-main)',
                                            fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
                                            boxShadow: '0 8px 25px rgba(255, 107, 129, 0.4)',
                                            fontWeight: 'bold',
                                            animation: 'pulse 2s infinite'
                                        }}
                                    >
                                        🌟 Reveal 5 Reasons Why You're Amazing 🌟
                                    </motion.button>
                                    <p style={{
                                        marginTop: '10px',
                                        fontFamily: 'var(--font-typewriter)',
                                        color: '#795548',
                                        fontSize: '0.8rem',
                                        fontStyle: 'italic'
                                    }}>
                                        Click to discover what makes you special! ✨
                                    </p>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ marginTop: '30px', borderLeft: '3px solid var(--primary)', paddingLeft: '20px' }}
                                >
                                    {reasons.map((reason, i) => (
                                        <motion.p
                                            key={i}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.3 }}
                                            style={{ marginBottom: '10px', fontStyle: 'italic', color: '#5d4037' }}
                                        >
                                            • {reason}
                                        </motion.p>
                                    ))}
                                </motion.div>
                            )}

                            <p style={{ textAlign: 'center', marginTop: showReasons ? '40px' : '30px', fontStyle: 'italic', fontWeight: 'bold' }}>
                                You are truly one of a kind. 💖
                            </p>
                            
                            {showReasons && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.5 }}
                                    style={{
                                        marginTop: '30px',
                                        padding: '20px',
                                        background: 'linear-gradient(135deg, rgba(255,107,129,0.1), rgba(162,155,254,0.1))',
                                        borderRadius: '15px',
                                        border: '1px solid rgba(255,107,129,0.3)'
                                    }}
                                >
                                    <h3 style={{
                                        fontFamily: 'var(--font-antique)',
                                        color: '#5d4037',
                                        textAlign: 'center',
                                        marginBottom: '15px',
                                        fontSize: window.innerWidth < 768 ? '1.2rem' : '1.4rem'
                                    }}>
                                        Special Moments 💝
                                    </h3>
                                    {specialMoments.map((moment, i) => (
                                        <motion.p
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1.6 + i * 0.2 }}
                                            style={{
                                                marginBottom: '10px',
                                                fontStyle: 'italic',
                                                color: '#795548',
                                                fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {moment}
                                        </motion.p>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        <div style={{
                            marginTop: '40px',
                            textAlign: 'right',
                            fontFamily: 'var(--font-hand)',
                            fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem',
                            color: '#d32f2f'
                        }}>
                            With all my heart,<br />
                            Fawad (Hypervisor)
                        </div>

                        {showReasons && !showChat && !showGame && !showTicTacToe && (
                            <div style={{ textAlign: 'center', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => setShowChat(true)}
                                    style={{
                                        background: '#8b4513',
                                        color: '#f4e7d1',
                                        padding: '12px 25px',
                                        borderRadius: '50px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontFamily: 'var(--font-antique)',
                                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                                        width: 'fit-content'
                                    }}
                                >
                                    Open the Eternal Scroll 📜
                                </motion.button>

                                <motion.div
                                    style={{
                                        width: '100%',
                                        maxWidth: '400px',
                                        padding: '20px',
                                        background: 'linear-gradient(135deg, #ff6b81 0%, #ff8fa3 50%, #ffa5c0 100%)',
                                        borderRadius: '20px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        boxShadow: '0 15px 40px rgba(255, 107, 129, 0.3)',
                                        textAlign: 'center',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        right: '0',
                                        bottom: '0',
                                        background: 'rgba(255,255,255,0.2)',
                                        zIndex: 1
                                    }} />
                                    <div style={{
                                        position: 'relative',
                                        zIndex: 2
                                    }}>
                                        <h3 style={{
                                            color: '#ffffff',
                                            fontFamily: 'var(--font-fun)',
                                            fontSize: '1.4rem',
                                            marginBottom: '15px',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                        }}>
                                            💕 Heart Catcher Ultimate 💕
                                        </h3>
                                        <p style={{
                                            color: '#ffffff',
                                            fontSize: '1rem',
                                            marginBottom: '20px'
                                        }}>
                                            Catch magical hearts and advance through love-filled levels!
                                        </p>
                                        <motion.button
                                            whileHover={{ scale: 1.05, rotate: 2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowGame(true)}
                                            style={{
                                                background: 'linear-gradient(45deg, #ff1744, #ff6b81)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '12px 25px',
                                                borderRadius: '50px',
                                                fontSize: '0.9rem',
                                                cursor: 'pointer',
                                                boxShadow: '0 8px 25px rgba(255, 23, 68, 0.4)',
                                                fontFamily: 'var(--font-fun)',
                                                fontWeight: 'bold',
                                                width: '100%',
                                                marginBottom: '10px'
                                            }}
                                        >
                                            💕 START HEART CATCHER
                                        </motion.button>
                                    </div>
                                </motion.div>

                                <motion.div
                                    style={{
                                        width: '100%',
                                        maxWidth: '400px',
                                        padding: '20px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        borderRadius: '20px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        boxShadow: '0 15px 40px rgba(102, 126, 234, 0.3)',
                                        textAlign: 'center',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        right: '0',
                                        bottom: '0',
                                        background: 'rgba(255,255,255,0.2)',
                                        zIndex: 1
                                    }} />
                                    <div style={{
                                        position: 'relative',
                                        zIndex: 2
                                    }}>
                                        <h3 style={{
                                            color: '#ffffff',
                                            fontFamily: 'var(--font-fun)',
                                            fontSize: '1.4rem',
                                            marginBottom: '15px',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                        }}>
                                            ⭕ Tic-Tac-Toe ❌
                                        </h3>
                                        <p style={{
                                            color: '#ffffff',
                                            fontSize: '1rem',
                                            marginBottom: '20px'
                                        }}>
                                            Classic 2-player game! Challenge your friend locally!
                                        </p>
                                        <motion.button
                                            whileHover={{ scale: 1.05, rotate: 2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowTicTacToe(true)}
                                            style={{
                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '12px 25px',
                                                borderRadius: '50px',
                                                fontSize: '0.9rem',
                                                cursor: 'pointer',
                                                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                                                fontFamily: 'var(--font-fun)',
                                                fontWeight: 'bold',
                                                width: '100%'
                                            }}
                                        >
                                            ⭕ START TIC-TAC-TOE
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>

                    <AnimatePresence>
                        {showGame && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: '550px' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ width: '100%', marginBottom: '20px' }}
                            >
                                <ValentineGame onWin={() => { setShowGame(false); setShowChat(true); }} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {showTicTacToe && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: '500px' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ width: '100%', marginBottom: '20px' }}
                            >
                                <TicTacToeGame onWin={() => { setShowTicTacToe(false); setShowChat(true); }} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {showChat && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ width: '100%' }}
                            >
                                <AntiqueChat />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onLogout}
                            style={{
                                background: 'linear-gradient(135deg, #8d6e63, #6d4c41)',
                                color: '#fff',
                                border: 'none',
                                padding: window.innerWidth < 768 ? '15px 25px' : '15px 40px',
                                fontFamily: 'var(--font-antique)',
                                fontSize: window.innerWidth < 768 ? '1rem' : '1.2rem',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <span style={{ fontSize: '1.5rem' }}>🕯️</span>
                            Seal & Logout
                        </motion.button>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
