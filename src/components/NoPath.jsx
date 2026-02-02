import { motion } from 'framer-motion'

export default function NoPath({ onRetry }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
                textAlign: 'center',
                padding: '40px',
                color: 'white',
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '20px',
                backdropFilter: 'blur(5px)'
            }}
        >
            <h1 style={{ fontFamily: 'var(--font-fun)', fontSize: '3rem', marginBottom: '20px' }}>
                Oh no… that hurts 😭💔
            </h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
                It’s okay… best friends forever 🤍
            </p>

            <p style={{ fontSize: '1rem', fontStyle: 'italic', opacity: 0.8 }}>
                (System auto-logging out... and cancelling your best friend subscription... 😈)
            </p>

            {/* Optional retry button if they regret it immediately, hidden or small */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                onClick={onRetry}
                style={{
                    marginTop: '30px',
                    background: 'transparent',
                    border: '1px solid white',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    fontSize: '0.9rem'
                }}
            >
                Wait, I didn't mean it! ↩️
            </motion.button>
        </motion.div>
    )
}
