import { useEffect } from 'react'
import { useSound } from '../utils/soundManager'

// Higher-order component to add sound to any component
export const withSound = (WrappedComponent) => {
    return function WithSoundComponent(props) {
        const { playClick } = useSound()

        useEffect(() => {
            // Add click sound to all interactive elements when component mounts
            const addClickSound = () => {
                const elements = document.querySelectorAll(`
                    button, 
                    [role="button"], 
                    .btn, 
                    .button,
                    input[type="button"],
                    input[type="submit"],
                    a[href]:not([href^="#"]),
                    .clickable,
                    .interactive,
                    [data-click-sound="true"]
                `)

                elements.forEach(element => {
                    element.addEventListener('click', playClick)
                })
            }

            // Add sound immediately
            addClickSound()

            // Also add sound after a short delay to catch dynamically added elements
            const timeoutId = setTimeout(addClickSound, 100)

            // Set up a mutation observer to catch new elements
            const observer = new MutationObserver(() => {
                addClickSound()
            })

            observer.observe(document.body, {
                childList: true,
                subtree: true
            })

            return () => {
                clearTimeout(timeoutId)
                observer.disconnect()
                
                // Clean up event listeners
                const elements = document.querySelectorAll(`
                    button, 
                    [role="button"], 
                    .btn, 
                    .button,
                    input[type="button"],
                    input[type="submit"],
                    a[href]:not([href^="#"]),
                    .clickable,
                    .interactive,
                    [data-click-sound="true"]
                `)

                elements.forEach(element => {
                    element.removeEventListener('click', playClick)
                })
            }
        }, [playClick])

        return <WrappedComponent {...props} />
    }
}

// Custom hook for adding sound to specific elements
export const useClickSound = (elementRef) => {
    const { playClick } = useSound()

    useEffect(() => {
        const element = elementRef?.current
        if (!element) return

        const handleClick = () => {
            playClick()
            // Add visual feedback
            element.style.transform = 'scale(0.95)'
            setTimeout(() => {
                element.style.transform = ''
            }, 100)
        }

        element.addEventListener('click', handleClick)
        
        return () => {
            element.removeEventListener('click', handleClick)
        }
    }, [elementRef, playClick])
}
