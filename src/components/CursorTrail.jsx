import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Heart = ({ x, y, id, onComplete }) => {
    return (
        <motion.div
            key={id}
            initial={{ opacity: 1, scale: 0, x, y }}
            animate={{
                opacity: 0,
                scale: [0, 1.2, 0.5],
                y: y - 100,
                x: x + (Math.random() * 40 - 20)
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
            onAnimationComplete={() => onComplete(id)}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 9999,
                fontSize: '1.2rem',
                color: 'var(--primary)',
                textShadow: '0 0 5px rgba(255,107,129,0.5)'
            }}
        >
            ❤️
        </motion.div>
    )
}

export default function CursorTrail() {
    const [hearts, setHearts] = useState([])

    useEffect(() => {
        const handleMouseMove = (e) => {
            // Only add a heart every few movements to avoid overcrowding
            if (Math.random() > 0.8) {
                const newHeart = {
                    id: Date.now(),
                    x: e.clientX,
                    y: e.clientY
                }
                setHearts(prev => [...prev.slice(-15), newHeart])
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const removeHeart = (id) => {
        setHearts(prev => prev.filter(h => h.id !== id))
    }

    return (
        <div style={{ pointerEvents: 'none' }}>
            <AnimatePresence>
                {hearts.map(heart => (
                    <Heart
                        key={heart.id}
                        {...heart}
                        onComplete={removeHeart}
                    />
                ))}
            </AnimatePresence>
        </div>
    )
}
