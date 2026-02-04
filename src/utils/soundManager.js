// Button Click Sound Manager
class SoundManager {
    constructor() {
        this.audio = null
        this.enabled = true
        this.volume = 0.5 // Increased volume for better clarity
        this.initialized = false
        this.audioContext = null
        this.gainNode = null
    }

    // Initialize the audio system with enhanced audio context
    async init() {
        if (this.initialized) return

        try {
            // Create Web Audio API for better sound control
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = this.volume;

            // Try to load the click sound
            this.audio = new Audio('/audio/click_sound.mp3');
            this.audio.volume = this.volume;
            this.audio.preload = 'auto';
            
            // Handle audio loading
            this.audio.addEventListener('canplaythrough', () => {
                console.log('✅ Click sound loaded successfully');
                this.testAudioOutput();
            });
            
            this.audio.addEventListener('error', (e) => {
                console.warn('⚠️ Click sound file not found. Using fallback beep sound.');
                this.createFallbackSound();
            });
            
            // Try to load the audio
            this.audio.load();
            
            // Resume audio context if suspended (browser autoplay policy)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            this.initialized = true;
            console.log('🔊 Sound Manager initialized with enhanced audio');
        } catch (error) {
            console.warn('⚠️ Failed to initialize sound manager:', error);
            this.createFallbackSound();
        }
    }

    // Create a fallback beep sound using Web Audio API
    createFallbackSound() {
        try {
            if (this.audioContext && this.gainNode) {
                this.fallbackSound = () => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.value = 800; // 800Hz beep
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.1);
                };
                console.log('🔊 Fallback beep sound created');
            }
        } catch (error) {
            console.warn('⚠️ Could not create fallback sound:', error);
        }
    }

    // Test audio output
    testAudioOutput() {
        if (this.audioContext && this.audioContext.state === 'running') {
            console.log('🔊 Audio context is running - sound should work clearly');
        } else {
            console.log('⚠️ Audio context may be suspended - first user interaction needed');
        }
    }

    // Play click sound with enhanced clarity
    playClick() {
        if (!this.enabled) return;

        try {
            // Resume audio context if suspended (browser autoplay policy)
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            // Try to play the loaded sound
            if (this.audio) {
                this.audio.currentTime = 0;
                this.audio.play().catch(error => {
                    console.warn('⚠️ Could not play click sound, trying fallback:', error);
                    this.playFallbackSound();
                });
            } else {
                this.playFallbackSound();
            }
        } catch (error) {
            console.warn('⚠️ Error playing click sound:', error);
            this.playFallbackSound();
        }
    }

    // Play fallback sound
    playFallbackSound() {
        if (this.fallbackSound) {
            this.fallbackSound();
        }
    }

    // Toggle sound on/off
    toggle() {
        this.enabled = !this.enabled;
        console.log(`🔊 Sound ${this.enabled ? 'enabled' : 'disabled'}`);
        return this.enabled;
    }

    // Set volume (0.0 to 1.0)
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.audio) {
            this.audio.volume = this.volume;
        }
        if (this.gainNode) {
            this.gainNode.gain.value = this.volume;
        }
        console.log(`🔊 Volume set to ${Math.round(this.volume * 100)}%`);
    }

    // Enable/disable sound
    setEnabled(enabled) {
        this.enabled = enabled;
        console.log(`🔊 Sound ${enabled ? 'enabled' : 'disabled'}`);
    }

    // Check if audio is working
    checkAudioStatus() {
        return {
            initialized: this.initialized,
            enabled: this.enabled,
            audioContextState: this.audioContext?.state || 'not-created',
            hasAudioFile: !!this.audio,
            hasFallback: !!this.fallbackSound,
            volume: this.volume
        };
    }
}

// Create global sound manager instance
const soundManager = new SoundManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    soundManager.init();
});

// Initialize on first user interaction (for autoplay policy)
document.addEventListener('click', () => {
    if (!soundManager.initialized) {
        soundManager.init();
    }
}, { once: true });

// Auto-attach click sounds to buttons with enhanced detection
document.addEventListener('click', (event) => {
    // Check if clicked element is a button or contains button-like behavior
    const target = event.target;
    
    // Enhanced button detection
    const isButton = target.tagName === 'BUTTON' ||
                    target.tagName === 'A' && target.href && !target.href.startsWith('#') ||
                    target.role === 'button' ||
                    target.classList.contains('btn') ||
                    target.classList.contains('button') ||
                    target.onclick ||
                    target.type === 'submit' ||
                    target.type === 'button' ||
                    target.closest('button') ||
                    target.closest('[role="button"]') ||
                    target.closest('.btn') ||
                    target.closest('.button');

    // Also check for interactive elements that should have sound
    const isInteractive = 
        target.tagName === 'INPUT' && (target.type === 'button' || target.type === 'submit') ||
        target.classList.contains('clickable') ||
        target.classList.contains('interactive') ||
        target.dataset.clickSound === 'true';

    if (isButton || isInteractive) {
        // Add visual feedback
        target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            target.style.transform = '';
        }, 100);

        // Play sound
        soundManager.playClick();
    }
});

// Export for React components
export default soundManager;

// React Hook for sound management
export const useSound = () => {
    return {
        playClick: () => soundManager.playClick(),
        toggleSound: () => soundManager.toggle(),
        setVolume: (volume) => soundManager.setVolume(volume),
        setEnabled: (enabled) => soundManager.setEnabled(enabled),
        isEnabled: soundManager.enabled,
        volume: soundManager.volume,
        checkStatus: () => soundManager.checkAudioStatus()
    };
};
