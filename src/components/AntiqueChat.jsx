import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabaseFetch } from '../lib/supabase'

export default function AntiqueChat({ currentUser }) {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const chatEndRef = useRef(null)

    // Load from local storage initially
    useEffect(() => {
        const saved = localStorage.getItem('antique_chat_cache')
        if (saved) {
            setMessages(JSON.parse(saved))
        }
        fetchMessages()

        // Polling as a fallback for Realtime since we aren't using the full SDK
        const interval = setInterval(fetchMessages, 3000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        localStorage.setItem('antique_chat_cache', JSON.stringify(messages))
    }, [messages])

    const fetchMessages = async () => {
        try {
            const data = await supabaseFetch.getMessages()
            setMessages(data)
            setLoading(false)
        } catch (err) {
            console.error(err)
        }
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const tempMsg = {
            id: Date.now(),
            sender: currentUser,
            content: newMessage,
            created_at: new Date().toISOString(),
            is_temp: true
        }

        setMessages(prev => [...prev, tempMsg])
        setNewMessage('')

        try {
            await supabaseFetch.sendMessage(currentUser, newMessage)
            fetchMessages()
        } catch (err) {
            console.error(err)
            setMessages(prev => prev.filter(m => m.id !== tempMsg.id))
        }
    }

    const handleDeleteForAll = async (id) => {
        try {
            await supabaseFetch.deleteMessage(id)
            setMessages(prev => prev.filter(m => m.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    const handleClearForMe = () => {
        setMessages([])
        localStorage.removeItem('antique_chat_cache')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                width: '100%',
                maxWidth: '600px',
                height: '70vh',
                background: '#f4e7d1',
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/creme-paper.png")',
                borderRadius: '15px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.4), inset 0 0 50px rgba(139, 69, 19, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: '12px solid #8b4513',
                borderImage: 'linear-gradient(to bottom, #8b4513, #5d2e0a) 1',
                overflow: 'hidden',
                fontFamily: 'var(--font-typewriter)'
            }}
        >
            {/* Ornate Header */}
            <div style={{
                padding: '15px',
                background: 'rgba(139, 69, 19, 0.1)',
                borderBottom: '2px solid #8b4513',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span style={{ fontSize: '1.2rem', color: '#5d2e0a', fontWeight: 'bold' }}>📜 The Eternal Scroll</span>
                <button
                    onClick={handleClearForMe}
                    style={{
                        background: 'transparent',
                        color: '#8b4513',
                        fontSize: '0.8rem',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    }}
                >
                    Clear Slate
                </button>
            </div>

            {/* Chat Area */}
            <div
                className="antique-scrollbar"
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}
            >
                {messages.length === 0 && !loading && (
                    <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '20%' }}>
                        No ink has been spilled here yet...
                    </p>
                )}

                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: msg.sender === currentUser ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                alignSelf: msg.sender === currentUser ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                background: msg.sender === currentUser ? 'rgba(139, 69, 19, 0.15)' : 'rgba(0, 0, 0, 0.05)',
                                padding: '12px 18px',
                                borderRadius: '15px',
                                border: '1px solid rgba(139, 69, 19, 0.3)',
                                boxShadow: '2px 2px 5px rgba(0,0,0,0.05)',
                                color: '#3e2723',
                                position: 'relative'
                            }}>
                                <span style={{
                                    fontSize: '0.7rem',
                                    display: 'block',
                                    marginBottom: '5px',
                                    color: '#8b4513',
                                    fontFamily: 'var(--font-antique)'
                                }}>
                                    {msg.sender === currentUser ? 'You' : msg.sender}
                                </span>
                                <span style={{ fontSize: '1.05rem', lineHeight: '1.4' }}>{msg.content}</span>

                                {msg.sender === currentUser && (
                                    <button
                                        onClick={() => handleDeleteForAll(msg.id)}
                                        style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '-8px',
                                            background: '#fff',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            fontSize: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                            color: 'red',
                                            cursor: 'pointer',
                                            opacity: 0.3,
                                            transition: 'opacity 0.3s'
                                        }}
                                        className="delete-btn"
                                        onMouseEnter={(e) => e.target.style.opacity = 1}
                                        onMouseLeave={(e) => e.target.style.opacity = 0.3}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                            <span style={{
                                fontSize: '0.6rem',
                                opacity: 0.4,
                                display: 'block',
                                marginTop: '4px',
                                textAlign: msg.sender === currentUser ? 'right' : 'left'
                            }}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form
                onSubmit={handleSend}
                style={{
                    padding: '20px',
                    borderTop: '2px solid rgba(139, 69, 19, 0.2)',
                    display: 'flex',
                    gap: '10px',
                    background: 'rgba(139, 69, 19, 0.05)'
                }}
            >
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Dip your quill in ink..."
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid #8b4513',
                        padding: '10px',
                        fontSize: '1rem',
                        color: '#3e2723',
                        outline: 'none',
                        fontFamily: 'var(--font-hand)',
                        fontSize: '1.2rem'
                    }}
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    style={{
                        background: '#8b4513',
                        color: '#f4e7d1',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-antique)'
                    }}
                >
                    Seal 🖋️
                </motion.button>
            </form>
        </motion.div>
    )
}
