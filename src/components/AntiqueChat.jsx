import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabaseFetch, checkSupabaseConfig } from '../lib/supabase'

export default function AntiqueChat() {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [chatName, setChatName] = useState('')
    const [showRegistry, setShowRegistry] = useState(true)
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [hiddenMessages, setHiddenMessages] = useState([])
    const [connectionStatus, setConnectionStatus] = useState('checking')
    const chatEndRef = useRef(null)
    const subscriptionRef = useRef(null)

    // Check Supabase configuration on mount
    useEffect(() => {
        const config = checkSupabaseConfig()
        console.log('Chat initialization with config:', config)
        
        if (config.hasRealCredentials) {
            setConnectionStatus('connected')
        } else {
            setConnectionStatus('offline')
        }
    }, [])

    // Detect connectivity
    useEffect(() => {
        const handleStatusChange = () => {
            setIsOnline(navigator.onLine)
            if (navigator.onLine) {
                fetchMessages()
            }
        }
        window.addEventListener('online', handleStatusChange)
        window.addEventListener('offline', handleStatusChange)
        return () => {
            window.removeEventListener('online', handleStatusChange)
            window.removeEventListener('offline', handleStatusChange)
        }
    }, [])

    // Load name and cache from local storage initially
    useEffect(() => {
        const savedName = localStorage.getItem('antique_chat_name')
        if (savedName) {
            setChatName(savedName)
            setShowRegistry(false)
        }

        const savedCache = localStorage.getItem('antique_chat_cache')
        if (savedCache) {
            setMessages(JSON.parse(savedCache))
        }

        const savedHidden = localStorage.getItem('antique_chat_hidden')
        if (savedHidden) {
            setHiddenMessages(JSON.parse(savedHidden))
        }

        fetchMessages()
        setupRealtimeSubscription()

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe()
            }
        }
    }, [])

    // Setup real-time subscription
    const setupRealtimeSubscription = () => {
        if (supabaseFetch.checkConnection()) {
            console.log('Setting up real-time subscription...')
            subscriptionRef.current = supabaseFetch.subscribeToMessages((newMessage) => {
                setMessages(prev => {
                    // Avoid duplicate messages
                    if (prev.some(msg => msg.id === newMessage.id)) {
                        return prev
                    }
                    return [...prev, newMessage]
                })
            })
        } else {
            console.log('Using polling fallback for real-time updates')
            // Fallback polling
            const interval = setInterval(() => {
                if (navigator.onLine) fetchMessages()
            }, 5000)
            
            return () => clearInterval(interval)
        }
    }

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        localStorage.setItem('antique_chat_cache', JSON.stringify(messages))
    }, [messages])

    const fetchMessages = async () => {
        try {
            const data = await supabaseFetch.getMessages()
            // Merge with local offline queue for display
            const queue = JSON.parse(localStorage.getItem('antique_chat_queue') || '[]')
            setMessages([...data, ...queue])
            setLoading(false)
        } catch (err) {
            console.error(err)
            // If offline, still show what we have in cache + queue
            const savedCache = JSON.parse(localStorage.getItem('antique_chat_cache') || '[]')
            const queue = JSON.parse(localStorage.getItem('antique_chat_queue') || '[]')
            setMessages([...savedCache, ...queue])
        }
    }

    const handleRegistrySubmit = (e) => {
        e.preventDefault()
        if (chatName.trim()) {
            localStorage.setItem('antique_chat_name', chatName)
            setShowRegistry(false)
        }
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const tempMsg = {
            id: Date.now(),
            sender: chatName,
            content: newMessage,
            created_at: new Date().toISOString(),
            is_temp: true
        }

        setMessages(prev => [...prev, tempMsg])
        setNewMessage('')

        try {
            await supabaseFetch.sendMessage(chatName, newMessage)
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

    const handleClearForMe = async () => {
        const option = confirm("Clear all messages? \n\n'OK' for Me Only \n'Cancel' to Clear for EVERYONE (Your messages)")

        if (option) {
            // Clear for Me
            setMessages([])
            localStorage.removeItem('antique_chat_cache')
            localStorage.removeItem('antique_chat_queue')
            setHiddenMessages([])
            localStorage.removeItem('antique_chat_hidden')
        } else {
            // Clear for Everyone (Your own messages)
            if (confirm("Are you sure you want to delete all YOUR messages for everyone?")) {
                const ownMessages = messages.filter(m => m.sender === chatName)
                for (const msg of ownMessages) {
                    await handleDeleteForAll(msg.id)
                }
                alert("Your messages have been cleared for everyone. 🖋️✨")
            }
        }
    }

    const handleDeleteForMe = (id) => {
        const updatedHidden = [...hiddenMessages, id]
        setHiddenMessages(updatedHidden)
        localStorage.setItem('antique_chat_hidden', JSON.stringify(updatedHidden))
    }

    const handleDeleteSpecificText = async (text) => {
        if (!text.trim()) return
        const messagesToDelete = messages.filter(m => m.content.toLowerCase().includes(text.toLowerCase()))
        if (messagesToDelete.length === 0) {
            alert(`No messages found containing "${text}"`)
            return
        }

        if (confirm(`Delete ${messagesToDelete.length} messages containing "${text}" for everyone?`)) {
            for (const msg of messagesToDelete) {
                if (msg.sender === chatName) {
                    await handleDeleteForAll(msg.id)
                } else {
                    handleDeleteForMe(msg.id)
                }
            }
        }
    }

    const handleSealForTravel = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messages));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `antique_scroll_${chatName}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    const handleUnsealScroll = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                // Merge and remove duplicates by ID
                const merged = [...messages, ...imported];
                const unique = merged.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
                setMessages(unique.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
                alert("The scroll has been successfully unsealed! 📜✒️");
            } catch (err) {
                alert("This scroll seems corrupted or invalid. 🥀");
            }
        };
        reader.readAsText(file);
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="burnt-edges"
            style={{
                width: '100%',
                maxWidth: '800px',
                height: '80vh',
                background: '#f4e7d1',
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/creme-paper.png")',
                borderRadius: '5px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 0 100px rgba(139, 69, 19, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: 'var(--font-typewriter)'
            }}
        >
            <style>
                {`
                    .ink-text:hover .msg-actions {
                        opacity: 1 !important;
                    }
                    .ink-text {
                        transition: all 0.2s ease;
                    }
                `}
            </style>
            <AnimatePresence>
                {showRegistry && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: '#f4e7d1',
                            backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
                            zIndex: 100,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '40px',
                            textAlign: 'center'
                        }}
                    >
                        <h2 style={{ fontFamily: 'var(--font-antique)', color: '#5d2e0a', marginBottom: '20px', fontSize: '2rem' }}>
                            Sign the Registry ✍️
                        </h2>
                        <p style={{ marginBottom: '30px', color: '#795548', fontStyle: 'italic' }}>
                            To partake in this eternal dialogue, please leave your mark...
                        </p>
                        <form onSubmit={handleRegistrySubmit} style={{ width: '100%', maxWidth: '300px' }}>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Your Name..."
                                value={chatName}
                                onChange={(e) => setChatName(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '2px solid #8b4513',
                                    padding: '10px',
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    fontFamily: 'var(--font-hand)',
                                    color: '#3e2723',
                                    outline: 'none'
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                style={{
                                    marginTop: '40px',
                                    background: '#8b4513',
                                    color: '#f4e7d1',
                                    border: 'none',
                                    padding: '12px 40px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    fontFamily: 'var(--font-antique)'
                                }}
                            >
                                Enter the Scroll
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ornate Header */}
            <div style={{
                padding: '15px 25px',
                background: isOnline ? 'rgba(139, 69, 19, 0.08)' : 'rgba(121, 85, 72, 0.2)',
                borderBottom: '2px solid rgba(139, 69, 19, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '1.4rem', color: '#5d2e0a', fontFamily: 'var(--font-antique)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📜 {chatName || 'The Scroll'}
                        {isOnline && <span style={{ width: '10px', height: '10px', background: '#4caf50', borderRadius: '50%', boxShadow: '0 0 10px #4caf50' }} title="Online"></span>}
                    </span>
                    {!isOnline && (
                        <span style={{ fontSize: '0.7rem', color: '#d32f2f', fontWeight: 'bold' }}>📡 Offline - Saved to Quill</span>
                    )}
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <label
                        title="Unseal (Import) shared scroll"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        📂
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleUnsealScroll}
                            style={{ display: 'none' }}
                        />
                    </label>
                    <button
                        onClick={handleSealForTravel}
                        title="Seal (Export) for Bluetooth/Sharing"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.2rem',
                            cursor: 'pointer'
                        }}
                    >
                        📦
                    </button>
                    <button
                        onClick={() => {
                            const text = prompt("Enter specific text to delete from your view (or your messages for everyone):")
                            if (text) handleDeleteSpecificText(text)
                        }}
                        title="Delete messages with specific text"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.2rem',
                            cursor: 'pointer'
                        }}
                    >
                        🔍🗑️
                    </button>
                    <button
                        onClick={handleClearForMe}
                        style={{
                            background: 'transparent',
                            color: '#a1887f',
                            fontSize: '0.8rem',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            fontStyle: 'italic'
                        }}
                    >
                        Clear All
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div
                className="antique-scrollbar"
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '30px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}
            >
                {messages.length === 0 && !loading && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        style={{ textAlign: 'center', marginTop: '30%', fontStyle: 'italic' }}
                    >
                        Waiting for the first spill of ink...
                    </motion.p>
                )}

                <AnimatePresence>
                    {messages.filter(msg => !hiddenMessages.includes(msg.id)).map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                alignSelf: msg.sender === chatName ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                position: 'relative'
                            }}
                        >
                            <div className="ink-text" style={{
                                background: 'transparent',
                                padding: '5px 10px',
                                color: '#3e2723',
                                position: 'relative'
                            }}>
                                <span style={{
                                    fontSize: '0.8rem',
                                    display: 'block',
                                    marginBottom: '2px',
                                    color: msg.sender === chatName ? '#d32f2f' : '#8b4513',
                                    fontFamily: 'var(--font-antique)',
                                    opacity: 0.7
                                }}>
                                    {msg.sender === chatName ? 'You' : msg.sender}
                                </span>
                                <span className="ink-handwriting" style={{
                                    fontSize: '1.3rem',
                                    lineHeight: '1.2',
                                    display: 'block',
                                    opacity: msg.is_offline ? 0.6 : 1,
                                    fontStyle: msg.is_offline ? 'italic' : 'normal',
                                    borderBottom: msg.sender === chatName ? '1px solid rgba(211, 47, 47, 0.2)' : '1px solid rgba(139, 69, 19, 0.2)'
                                }}>
                                    {msg.content}
                                    {msg.is_offline && <span style={{ fontSize: '0.6rem', marginLeft: '5px' }}>⏳</span>}
                                </span>

                                {msg.sender === chatName && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-20px',
                                        right: '0',
                                        display: 'flex',
                                        gap: '8px',
                                        opacity: 0,
                                        transition: 'opacity 0.2s ease',
                                        padding: '5px'
                                    }} className="msg-actions">
                                        <button
                                            onClick={() => handleDeleteForAll(msg.id)}
                                            title="Delete for everyone"
                                            style={{
                                                background: 'rgba(211, 47, 47, 0.1)',
                                                border: '1px solid rgba(211, 47, 47, 0.2)',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                color: '#d32f2f',
                                                cursor: 'pointer',
                                                padding: '2px 5px'
                                            }}
                                        >
                                            🗑️ All
                                        </button>
                                        <button
                                            onClick={() => handleDeleteForMe(msg.id)}
                                            title="Delete for me"
                                            style={{
                                                background: 'rgba(121, 85, 72, 0.1)',
                                                border: '1px solid rgba(121, 85, 72, 0.2)',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                color: '#795548',
                                                cursor: 'pointer',
                                                padding: '2px 5px'
                                            }}
                                        >
                                            ❌ Me
                                        </button>
                                    </div>
                                )}
                                {msg.sender !== chatName && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-20px',
                                        left: '0',
                                        display: 'flex',
                                        opacity: 0,
                                        transition: 'opacity 0.2s ease',
                                        padding: '5px'
                                    }} className="msg-actions">
                                        <button
                                            onClick={() => handleDeleteForMe(msg.id)}
                                            title="Delete for me"
                                            style={{
                                                background: 'rgba(121, 85, 72, 0.1)',
                                                border: '1px solid rgba(121, 85, 72, 0.2)',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                color: '#795548',
                                                cursor: 'pointer',
                                                padding: '2px 5px'
                                            }}
                                        >
                                            ❌ Clear
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form
                onSubmit={handleSend}
                style={{
                    padding: '25px',
                    borderTop: '1px dashed rgba(139, 69, 19, 0.3)',
                    display: 'flex',
                    gap: '15px',
                    alignItems: 'center'
                }}
            >
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ink your thoughts..."
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgba(139, 69, 19, 0.3)',
                        padding: '10px 0',
                        color: '#3e2723',
                        outline: 'none',
                        fontFamily: 'var(--font-hand)',
                        fontSize: '1.4rem'
                    }}
                />
                <motion.button
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    style={{
                        background: '#8b4513',
                        color: '#f4e7d1',
                        border: 'none',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                    }}
                >
                    🖋️
                </motion.button>
            </form>
        </motion.div>
    )
}
