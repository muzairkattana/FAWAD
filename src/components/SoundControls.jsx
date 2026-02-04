import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSound } from '../hooks/useSound'

export default function SoundControls() {
    const { playClick, toggleSound, setVolume, isEnabled, volume } = useSound()
    const [showControls, setShowControls] = useState(false)

    const handleToggle = () => {
        playClick()
        toggleSound()
    }

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume)
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000
        }}>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    playClick()
                    setShowControls(!showControls)
                }}
                style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: isEnabled 
                        ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                        : 'linear-gradient(135deg, #e53e3e, #c53030)',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                title={isEnabled ? 'Sound On' : 'Sound Off'}
            >
                {isEnabled ? '🔊' : '🔇'}
            </motion.button>

            {showControls && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    style={{
                        position: 'absolute',
                        bottom: '60px',
                        right: '0',
                        background: 'rgba(255, 255, 255, 0.95)',
                        padding: '15px',
                        borderRadius: '15px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(10px)',
                        minWidth: '200px'
                    }}
                >
                    <div style={{
                        marginBottom: '15px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        color: '#4a5568',
                        textAlign: 'center'
                    }}>
                        Sound Settings
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleToggle}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            background: isEnabled 
                                ? 'linear-gradient(135deg, #48bb78, #38a169)' 
                                : 'linear-gradient(135deg, #f56565, #e53e3e)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            marginBottom: '15px',
                            fontWeight: 'bold'
                        }}
                    >
                        {isEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
                    </motion.button>

                    <div style={{
                        marginBottom: '10px',
                        fontSize: '0.8rem',
                        color: '#718096'
                    }}>
                        Volume: {Math.round(volume * 100)}%
                    </div>

                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        style={{
                            width: '100%',
                            height: '6px',
                            borderRadius: '3px',
                            background: '#e2e8f0',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    />

                    <div style={{
                        marginTop: '10px',
                        fontSize: '0.7rem',
                        color: '#a0aec0',
                        textAlign: 'center'
                    }}>
                        Click any button to test sound
                    </div>
                </motion.div>
            )}
        </div>
    )
}
