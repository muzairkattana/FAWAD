import { motion } from 'framer-motion'

export default function NoPath({ onRetry }) {
    return (
        <motion.div
            initial={{ opacity: 0, filter: 'grayscale(0%)' }}
            animate={{ opacity: 1, filter: 'grayscale(100%)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            style={{
                textAlign: 'center',
                padding: '60px',
                color: '#fff',
                background: 'rgba(50, 50, 50, 0.8)',
                borderRadius: '30px',
                backdropFilter: 'blur(15px)',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{ fontSize: '5rem', marginBottom: '20px' }}>
                🌧️
            </div>

            <h1 style={{ fontFamily: 'var(--font-fun)', fontSize: '2.5rem', marginBottom: '20px' }}>
                Wait... Seriously? 🥺
            </h1>

            <div style={{ spaceY: '15px' }}>
                <p style={{ fontSize: '1.2rem', color: '#ccc' }}>
                    The hearts are fading... the music is stopping...
                </p>
                <p style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
                    My heart is shattered into a million bits 💔.exe
                </p>
            </div>

            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginTop: '40px', color: '#aaa' }}>
                (Deleting best_friend_status.zip...)
                <br />(Initiating infinite sadness loop...)
            </p>

            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2, type: 'spring' }}
                whileHover={{ scale: 1.1, background: 'var(--primary)', color: 'white', border: 'none' }}
                onClick={onRetry}
                style={{
                    marginTop: '40px',
                    background: 'transparent',
                    border: '2px solid white',
                    color: 'white',
                    padding: '12px 30px',
                    borderRadius: '50px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                Wait! I was just kidding! ↩️❤️
            </motion.button>
        </motion.div>
    )
}
