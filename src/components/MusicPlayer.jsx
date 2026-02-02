import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function MusicPlayer() {
    const audioRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [hasInteracted, setHasInteracted] = useState(false)

    // Using a royalty-free romantic track
    const musicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Placeholder that works, though maybe too upbeat. 
    // Let's use something more fitting if possible, but this is reliable.
    const romanticTrack = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030e.mp3" // Romantic/Emotional track

    const togglePlay = () => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play().catch(e => console.log("Playback failed:", e))
        }
        setIsPlaying(!isPlaying)
        setHasInteracted(true)
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            left: '30px', // Moved to left to avoid blocking other things
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        }}>
            <audio ref={audioRef} loop src={romanticTrack} />

            <AnimatePresence>
                {!isPlaying && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            padding: '10px 15px',
                            borderRadius: '15px',
                            boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
                            fontSize: '0.9rem',
                            pointerEvents: 'none',
                            border: '1px solid var(--secondary)',
                            color: 'var(--primary)',
                            fontWeight: '600'
                        }}
                    >
                        🎶 Tap for Magic?
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                animate={!isPlaying ? {
                    scale: [1, 1.1, 1],
                    boxShadow: [
                        '0 4px 10px rgba(255, 107, 129, 0.2)',
                        '0 4px 20px rgba(255, 107, 129, 0.5)',
                        '0 4px 10px rgba(255, 107, 129, 0.2)'
                    ]
                } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                onClick={togglePlay}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: 'none',
                    background: isPlaying ? 'var(--primary)' : 'white',
                    color: isPlaying ? 'white' : 'var(--primary)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease'
                }}
            >
                {isPlaying ? '⏸️' : '🎵'}
            </motion.button>
        </div>
    )
}
