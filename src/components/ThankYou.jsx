import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import AntiqueChat from './AntiqueChat'

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

    const reasons = [
        "Your smile debugs my worst days ☀️",
        "You're the coolest hypervisor I know 💻",
        "You make every moment feel high-definition ✨",
        "More precious than a bug-free production push 🚀",
        "You have the kindest soul I've ever met 💖"
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
                padding: '100px 20px',
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
                        padding: '40px',
                        borderRadius: '10px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        maxWidth: '400px',
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
                        fontSize: '2rem',
                        marginBottom: '10px'
                    }}>
                        A Secret Checkpoint 🔒
                    </h2>
                    <p style={{ fontFamily: 'var(--font-typewriter)', color: '#795548' }}>
                        Tap to open the letter...
                    </p>
                    <div style={{
                        marginTop: '20px',
                        fontSize: '3rem',
                        filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.2))'
                    }}>
                        💌
                    </div>
                </motion.div>
            ) : (
                <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, rotateX: 90 }}
                        animate={{ opacity: 1, rotateX: 0 }}
                        transition={{ duration: 0.8, type: 'spring' }}
                        style={{
                            background: '#fcf6e8',
                            backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
                            width: '100%',
                            padding: '3rem',
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
                            fontSize: '2.5rem',
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
                            fontSize: '1.1rem',
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
                                            background: 'var(--primary)',
                                            color: 'white',
                                            padding: '10px 20px',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            border: 'none',
                                            fontFamily: 'var(--font-main)',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Reveal 5 Reasons Why You're Amazing ✨
                                    </motion.button>
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

                            <p style={{ textAlign: 'center', marginTop: '40px', fontStyle: 'italic', fontWeight: 'bold' }}>
                                You are truly one of a kind. 💖
                            </p>
                        </div>

                        <div style={{
                            marginTop: '40px',
                            textAlign: 'right',
                            fontFamily: 'var(--font-hand)',
                            fontSize: '2rem',
                            color: '#d32f2f'
                        }}>
                            With all my heart,<br />
                            Fawad (Hypervisor)
                        </div>

                        {showReasons && !showChat && (
                            <div style={{ textAlign: 'center', marginTop: '40px' }}>
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
                                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                                    }}
                                >
                                    Open the Eternal Scroll 📜
                                </motion.button>
                            </div>
                        )}
                    </motion.div>

                    <AnimatePresence>
                        {showChat && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ width: '100%' }}
                            >
                                <AntiqueChat currentUser="Ayesha" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onLogout}
                            style={{
                                background: '#8d6e63',
                                color: '#fff',
                                border: 'none',
                                padding: '12px 30px',
                                fontFamily: 'var(--font-antique)',
                                fontSize: '1.2rem',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            Seal & Logout 🕯️
                        </motion.button>
                    </div>
                </div>
            )}
        </motion.div>
    )
}
