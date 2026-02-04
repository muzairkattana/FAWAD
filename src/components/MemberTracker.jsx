import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MemberTracker({ currentMember }) {
    const [members, setMembers] = useState([])
    const [onlineCount, setOnlineCount] = useState(0)
    const [showDropdown, setShowDropdown] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMembers()
        const interval = setInterval(fetchMembers, 10000) // Update every 10 seconds
        return () => clearInterval(interval)
    }, [])

    const fetchMembers = async () => {
        try {
            // Try to get from Supabase first
            const response = await fetch('/api/members') // You'll need to create this endpoint
            if (response.ok) {
                const data = await response.json()
                setMembers(data.members || [])
                setOnlineCount(data.onlineCount || 0)
            } else {
                // Fallback to localStorage
                const storedMembers = JSON.parse(localStorage.getItem('chat_members') || '[]')
                setMembers(storedMembers)
                setOnlineCount(storedMembers.filter(m => m.isOnline).length)
            }
        } catch (error) {
            // Fallback to localStorage
            const storedMembers = JSON.parse(localStorage.getItem('chat_members') || '[]')
            setMembers(storedMembers)
            setOnlineCount(storedMembers.filter(m => m.isOnline).length)
        }
        setLoading(false)
    }

    const updateMemberStatus = (isOnline) => {
        if (!currentMember) return

        const updatedMembers = members.map(member => 
            member.name === currentMember 
                ? { ...member, isOnline, lastSeen: new Date() }
                : member
        )

        // If current member not in list, add them
        if (!updatedMembers.find(m => m.name === currentMember)) {
            updatedMembers.push({
                name: currentMember,
                isOnline,
                lastSeen: new Date(),
                joinedAt: new Date(),
                messageCount: 0,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentMember}`
            })
        }

        setMembers(updatedMembers)
        setOnlineCount(updatedMembers.filter(m => m.isOnline).length)
        localStorage.setItem('chat_members', JSON.stringify(updatedMembers))
    }

    useEffect(() => {
        if (currentMember) {
            updateMemberStatus(true)
            
            // Set up cleanup on unmount
            return () => {
                updateMemberStatus(false)
            }
        }
    }, [currentMember])

    const formatLastSeen = (lastSeen) => {
        const date = new Date(lastSeen)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
        return date.toLocaleDateString()
    }

    const getStatusColor = (isOnline, lastSeen) => {
        if (isOnline) return '#10b981'
        const diffMs = new Date() - new Date(lastSeen)
        const diffMins = Math.floor(diffMs / 60000)
        if (diffMins < 60) return '#f59e0b'
        return '#6b7280'
    }

    const getStatusText = (isOnline, lastSeen) => {
        if (isOnline) return 'Online'
        const diffMs = new Date() - new Date(lastSeen)
        const diffMins = Math.floor(diffMs / 60000)
        if (diffMins < 60) return 'Recently'
        return 'Offline'
    }

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Member Count Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    padding: '6px 12px',
                    color: 'white',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: onlineCount > 0 ? '#10b981' : '#6b7280',
                    boxShadow: onlineCount > 0 ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none'
                }} />
                <span>{onlineCount} Members</span>
                <motion.span
                    animate={{ rotate: showDropdown ? 180 : 0 }}
                    style={{ fontSize: '0.7rem' }}
                >
                    ▼
                </motion.span>
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            marginTop: '8px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                            backdropFilter: 'blur(20px)',
                            minWidth: '250px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            zIndex: 1000
                        }}
                    >
                        <div style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            color: '#4a5568'
                        }}>
                            Active Members
                        </div>

                        {loading ? (
                            <div style={{
                                padding: '20px',
                                textAlign: 'center',
                                color: '#718096',
                                fontSize: '0.85rem'
                            }}>
                                Loading members...
                            </div>
                        ) : members.length === 0 ? (
                            <div style={{
                                padding: '20px',
                                textAlign: 'center',
                                color: '#718096',
                                fontSize: '0.85rem'
                            }}>
                                No members yet
                            </div>
                        ) : (
                            members.map((member, index) => (
                                <motion.div
                                    key={member.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    style={{
                                        padding: '10px 16px',
                                        borderBottom: index < members.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}
                                >
                                    <img
                                        src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                                        alt={member.name}
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            border: '2px solid rgba(255, 255, 255, 0.3)'
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontSize: '0.9rem',
                                            fontWeight: '500',
                                            color: '#2d3748',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            {member.name}
                                            {member.name === currentMember && (
                                                <span style={{
                                                    background: '#667eea',
                                                    color: 'white',
                                                    fontSize: '0.6rem',
                                                    padding: '2px 6px',
                                                    borderRadius: '10px'
                                                }}>
                                                You
                                                </span>
                                            )}
                                        </div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: '#718096',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <div style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: getStatusColor(member.isOnline, member.lastSeen)
                                            }} />
                                            {getStatusText(member.isOnline, member.lastSeen)}
                                            <span style={{ marginLeft: '4px', opacity: 0.7 }}>
                                                • {formatLastSeen(member.lastSeen)}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: '0.7rem',
                                        color: '#a0aec0',
                                        textAlign: 'right'
                                    }}>
                                        {member.messageCount || 0} msgs
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
