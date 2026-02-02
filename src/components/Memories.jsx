import { motion } from 'framer-motion'

export default function Memories() {
    const memoryMoments = [
        { id: 1, text: "Our First Chat 💬", emoji: "✨" },
        { id: 2, text: "Late Night Debugging 🐞", emoji: "🌙" },
        { id: 3, text: "Shared Laughter 😂", emoji: "❤️" },
        { id: 4, text: "Future Adventures 🚀", emoji: "🌟" }
    ]

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            width: '100%',
            maxWidth: '800px',
            marginTop: '40px'
        }}>
            {memoryMoments.map((memory, i) => (
                <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.2 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    style={{
                        background: '#fcf6e8',
                        padding: '30px',
                        borderRadius: '15px',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                        border: '1px solid #d7ccc8',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")'
                    }}
                >
                    <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{memory.emoji}</div>
                    <h3 style={{ fontFamily: 'var(--font-antique)', color: '#5d4037' }}>{memory.text}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#8d6e63', fontStyle: 'italic', marginTop: '10px' }}>
                        Tap to add a photo...
                    </p>
                </motion.div>
            ))}
        </div>
    )
}
