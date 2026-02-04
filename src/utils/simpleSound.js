// Simple Click Sound Manager - No dependencies, no breaking changes
class SimpleSoundManager {
    constructor() {
        this.audio = null
        this.enabled = true
        this.volume = 0.5
        this.initialized = false
    }

    init() {
        if (this.initialized) return

        try {
            // Try to load the click sound
            this.audio = new Audio('/audio/click_sound.mp3')
            this.audio.volume = this.volume
            this.audio.preload = 'auto'
            
            this.audio.addEventListener('canplaythrough', () => {
                console.log('✅ Click sound loaded successfully')
            })
            
            this.audio.addEventListener('error', () => {
                console.log('🔇 No click sound file found - sounds will be silent')
                this.audio = null
            })
            
            this.audio.load()
            this.initialized = true
            console.log('🔊 Simple Sound Manager initialized')
        } catch (error) {
            console.log('🔇 Sound manager disabled - no audio support')
            this.audio = null
        }
    }

    playClick() {
        if (!this.enabled || !this.audio) return

        try {
            this.audio.currentTime = 0
            this.audio.play().catch(() => {
                // Silently fail - don't break the app
            })
        } catch (error) {
            // Silently fail - don't break the app
        }
    }
}

// Create global instance
const soundManager = new SimpleSoundManager()

// Initialize on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        soundManager.init()
    })

    // Add click sounds to all buttons
    window.addEventListener('click', (event) => {
        const target = event.target
        
        const isButton = target.tagName === 'BUTTON' ||
                        target.tagName === 'A' && target.href ||
                        target.role === 'button' ||
                        target.classList.contains('btn') ||
                        target.classList.contains('button') ||
                        target.type === 'submit' ||
                        target.type === 'button' ||
                        target.closest('button') ||
                        target.closest('[role="button"]') ||
                        target.closest('.btn') ||
                        target.closest('.button')

        if (isButton) {
            soundManager.playClick()
        }
    })
}

export default soundManager
