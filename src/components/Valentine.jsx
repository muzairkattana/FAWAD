import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function Valentine({ onComplete }) {
    const [showSkip, setShowSkip] = useState(false)

    useEffect(() => {
        const skipTimer = setTimeout(() => {
            setShowSkip(true)
        }, 8000) // Show after 8 seconds

        // Fire confetti
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        // Auto redirect after 1 minute (60000ms)
        // Changing to 30s for better user experience testing, but requirement said 1 min.
        // I'll stick to requirement: 1 minute
        const timer = setTimeout(() => {
            onComplete()
        }, 60000)

        return () => {
            clearInterval(interval)
            clearTimeout(timer)
            clearTimeout(skipTimer)
        }
    }, [onComplete])

    const handlePageClick = (e) => {
        const x = e.clientX / window.innerWidth
        const y = e.clientY / window.innerHeight

        confetti({
            particleCount: 50,
            spread: 60,
            origin: { x, y },
            colors: ['#ff6b81', '#ffccd5', '#a29bfe', '#ffffff']
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handlePageClick}
            style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '20px',
                cursor: 'pointer',
                position: 'relative'
            }}
        >
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

            <motion.h1
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                style={{
                    color: '#fff',
                    fontFamily: 'var(--font-fun)',
                    fontSize: '2.5rem',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    zIndex: 10
                }}
            >
                Hypervisor, will you be my Valentine? 🥹❤️
            </motion.h1>

            <motion.div
                initial={{ scale: 0 }}
                animate={{
                    scale: [0, 1.2, 1],
                    rotate: [0, -5, 5, -3, 3, 0],
                }}
                transition={{ delay: 0.5, duration: 1, type: 'spring' }}
                style={{
                    marginTop: '20px',
                    maxWidth: '600px',
                    width: '100%',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-hover)',
                    border: '5px solid white',
                    zIndex: 10
                }}
            >
                <img
                    src="/funny-valentine.gif"
                    alt="Funny Valentine Video"
                    style={{ width: '100%', display: 'block' }}
                />
            </motion.div>

            <motion.p
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                style={{ color: 'white', marginTop: '30px', fontSize: '1.2rem', fontWeight: 'bold', zIndex: 10 }}
            >
                WOOOOOO! PARTYYYY! 🎉💃🕺
            </motion.p>

            <AnimatePresence>
                {showSkip && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); onComplete(); }}
                        style={{
                            marginTop: '20px',
                            padding: '12px 25px',
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: '1px solid white',
                            borderRadius: '50px',
                            zIndex: 20,
                            cursor: 'pointer',
                            fontSize: '1rem',
                            backdropFilter: 'blur(5px)'
                        }}
                    >
                        Read the Letter... 💌
                    </motion.button>
                )}
            </AnimatePresence>

            <p style={{ color: 'white', marginTop: '20px', opacity: 0.6, fontSize: '0.8rem', zIndex: 10 }}>
                Click anywhere for more confetti!
            </p>
        </motion.div>
    )
}
