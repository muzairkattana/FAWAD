import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Login from './components/Login'
import Decision from './components/Decision'
import Valentine from './components/Valentine'
import ThankYou from './components/ThankYou'
import NoPath from './components/NoPath'
import MusicPlayer from './components/MusicPlayer'
import CursorTrail from './components/CursorTrail'
import AdminApp from './components/AdminApp'
import './styles/global.css'

// Import simple sound manager (won't break if file missing)
try {
    import('./utils/simpleSound')
} catch (error) {
    console.log('Sound manager not loaded - app will work without sounds')
}

function App() {
    const [page, setPage] = useState('login')
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        // Check if we're on the admin route
        if (window.location.pathname === '/admin') {
            setIsAdmin(true)
        }
    }, [])

    const renderPage = () => {
        switch (page) {
            case 'login': return (
                <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                >
                    <Login onLogin={() => setPage('decision')} />
                </motion.div>
            )
            case 'decision': return (
                <motion.div
                    key="decision"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                >
                    <Decision onYes={() => setPage('valentine')} onNo={() => setPage('nopath')} />
                </motion.div>
            )
            case 'valentine': return (
                <motion.div
                    key="valentine"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                >
                    <Valentine onComplete={() => setPage('thankyou')} />
                </motion.div>
            )
            case 'thankyou': return (
                <motion.div
                    key="thankyou"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                >
                    <ThankYou onLogout={() => setPage('login')} />
                </motion.div>
            )
            case 'nopath': return (
                <motion.div
                    key="nopath"
                    initial={{ opacity: 0, rotate: -10 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0 }}
                >
                    <NoPath onRetry={() => setPage('decision')} />
                </motion.div>
            )
            default: return <Login onLogin={() => setPage('decision')} />
        }
    }

    return (
        <div className="app-container">
            <CursorTrail />
            {/* <MusicPlayer /> */}
            <AnimatePresence mode="wait">
                {isAdmin ? (
                    <AdminApp />
                ) : (
                    renderPage()
                )}
            </AnimatePresence>
        </div>
    )
}

export default App
