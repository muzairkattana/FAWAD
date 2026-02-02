import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function MusicPlayer() {
    const audioRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [hasInteracted, setHasInteracted] = useState(false)

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

    // Try to auto-play on mount, often blocked but worth a try with muted logic if needed, 
    // but here we prefer explicit interaction or a "click anywhere" handler in App.
    // For now, we'll just show the button.

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }}>
            <audio ref={audioRef} loop src="/music.mp3" />

            {!hasInteracted && !isPlaying && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                        background: 'white',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                        fontSize: '0.8rem',
                        pointerEvents: 'none'
                    }}
                >
                    🎵 Play Music?
                </motion.div>
            )}

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: 'none',
                    background: isPlaying ? 'var(--primary)' : 'white',
                    color: isPlaying ? 'white' : 'var(--primary)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                }}
            >
                {isPlaying ? '⏸️' : '▶️'}
            </motion.button>
        </div>
    )
}
