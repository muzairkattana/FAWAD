import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ThankYou({ onLogout }) {
    const [isOpen, setIsOpen] = useState(false)

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
                padding: '20px',
                background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://www.transparenttextures.com/patterns/aged-paper.png")',
                backgroundColor: '#3e2723' // Fallback dark wood color
            }}
        >
            {!isOpen ? (
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setIsOpen(true)}
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
                <motion.div
                    initial={{ opacity: 0, rotateX: 90 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    transition={{ duration: 0.8, type: 'spring' }}
                    style={{
                        background: '#fcf6e8',
                        backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
                        width: '100%',
                        maxWidth: '600px',
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
                        <p style={{ textAlign: 'center', marginTop: '30px', fontStyle: 'italic', fontWeight: 'bold' }}>
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
                </motion.div>
            )}
        </motion.div>
    )
}
