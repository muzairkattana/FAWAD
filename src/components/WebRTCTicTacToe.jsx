import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WebRTCTicTacToe({ onWin }) {
    const [gameState, setGameState] = useState('menu') // menu, hosting, joining, playing, ended
    const [playerName, setPlayerName] = useState('')
    const [opponentName, setOpponentName] = useState('')
    const [playerSymbol, setPlayerSymbol] = useState('X')
    const [board, setBoard] = useState(Array(9).fill(null))
    const [currentPlayer, setCurrentPlayer] = useState('X')
    const [winner, setWinner] = useState(null)
    const [connectionStatus, setConnectionStatus] = useState('disconnected')
    const [gameId, setGameId] = useState('')
    const [joinCode, setJoinCode] = useState('')
    
    const peerConnection = useRef(null)
    const dataChannel = useRef(null)

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ]

    useEffect(() => {
        return () => {
            cleanup()
        }
    }, [])

    const cleanup = () => {
        if (dataChannel.current) {
            dataChannel.current.close()
        }
        if (peerConnection.current) {
            peerConnection.current.close()
        }
        
        // Clean up localStorage data
        if (gameId) {
            localStorage.removeItem(`webrtc_game_${gameId}`)
            localStorage.removeItem(`answer_${gameId}`)
            localStorage.removeItem(`host_ice_${gameId}`)
            localStorage.removeItem(`guest_ice_${gameId}`)
        }
    }

    const generateGameId = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase()
    }

    const createGame = async () => {
        if (!playerName.trim()) {
            alert('Please enter your name!')
            return
        }

        const newGameId = generateGameId()
        setGameId(newGameId)
        setPlayerSymbol('X')
        setGameState('hosting')
        
        try {
            // Create peer connection
            const pc = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            })

            peerConnection.current = pc

            // Create data channel for game communication
            const dc = pc.createDataChannel('game', {
                ordered: true
            })
            
            setupDataChannel(dc)
            dataChannel.current = dc

            // Handle ICE candidates
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('Host ICE candidate:', event.candidate)
                    // Store ICE candidate for manual exchange
                    const hostIce = JSON.parse(localStorage.getItem(`host_ice_${newGameId}`) || '[]')
                    hostIce.push(event.candidate)
                    localStorage.setItem(`host_ice_${newGameId}`, JSON.stringify(hostIce))
                }
            }

            // Create offer
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)

            // Store offer for guest to retrieve (using a public paste service for demo)
            const offerData = {
                offer: offer,
                timestamp: Date.now()
            }
            
            // For demo purposes, we'll use localStorage with a different approach
            // In production, you'd use a proper signaling server
            localStorage.setItem(`webrtc_game_${newGameId}`, JSON.stringify(offerData))
            
            setConnectionStatus('waiting for opponent')

            // Start checking for guest's answer
            checkForGuestAnswer(newGameId)

            // Show manual exchange instructions
            setTimeout(() => {
                if (gameState === 'hosting') {
                    showManualExchangeInstructions(newGameId, offer)
                }
            }, 2000)

        } catch (error) {
            console.error('Error creating game:', error)
            alert('Failed to create game. Please try again.')
            setGameState('menu')
        }
    }

    const showManualExchangeInstructions = (gameId, offer) => {
        const offerText = JSON.stringify(offer)
        console.log('=== HOST OFFER (Copy this and send to guest) ===')
        console.log(offerText)
        console.log('=== END OFFER ===')
        
        // Also show in a more user-friendly way
        const instructions = `
GAME CREATED! 

To connect with your friend:

1. Copy this OFFER data and send it to your friend:
${offerText.substring(0, 100)}...

2. Wait for your friend to send you their ANSWER data
3. Paste the ANSWER in the console when prompted

Game Code: ${gameId}
        `
        console.log(instructions)
    }

    const checkForGuestAnswer = async (gameId) => {
        const checkInterval = setInterval(async () => {
            const answerData = localStorage.getItem(`answer_${gameId}`)
            if (answerData) {
                try {
                    const answer = JSON.parse(answerData)
                    await peerConnection.current.setRemoteDescription(answer)
                    
                    // Add any pending ICE candidates
                    const guestIceData = localStorage.getItem(`guest_ice_${gameId}`)
                    if (guestIceData) {
                        const guestIce = JSON.parse(guestIceData)
                        if (Array.isArray(guestIce)) {
                            for (const candidate of guestIce) {
                                await peerConnection.current.addIceCandidate(candidate)
                            }
                        }
                    }
                    
                    clearInterval(checkInterval)
                } catch (error) {
                    console.error('Error processing answer:', error)
                }
            }
        }, 2000) // Check every 2 seconds

        // Stop checking after 5 minutes
        setTimeout(() => clearInterval(checkInterval), 300000)
    }

    const joinGame = async () => {
        if (!playerName.trim()) {
            alert('Please enter your name!')
            return
        }

        if (!joinCode.trim()) {
            alert('Please enter a game code!')
            return
        }

        setGameState('joining')
        setPlayerSymbol('O')

        try {
            // For demo, we'll use a manual exchange approach
            // In production, you'd fetch from a signaling server
            
            // Try to get offer from localStorage first (for same browser testing)
            let offerData = localStorage.getItem(`webrtc_game_${joinCode}`)
            
            if (!offerData) {
                // Prompt user to manually paste the offer
                const offerText = prompt('Please paste the OFFER data from your friend:')
                if (!offerText) {
                    alert('Game connection cancelled.')
                    setGameState('menu')
                    return
                }
                
                try {
                    const offer = JSON.parse(offerText)
                    offerData = JSON.stringify({ offer: offer, timestamp: Date.now() })
                } catch (error) {
                    alert('Invalid OFFER data. Please copy the complete offer from your friend.')
                    setGameState('menu')
                    return
                }
            }

            // Create peer connection
            const pc = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            })

            peerConnection.current = pc

            // Handle data channel
            pc.ondatachannel = (event) => {
                const dc = event.channel
                setupDataChannel(dc)
                dataChannel.current = dc
            }

            // Handle ICE candidates
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('Guest ICE candidate:', event.candidate)
                    const guestIce = JSON.parse(localStorage.getItem(`guest_ice_${joinCode}`) || '[]')
                    guestIce.push(event.candidate)
                    localStorage.setItem(`guest_ice_${joinCode}`, JSON.stringify(guestIce))
                }
            }

            setConnectionStatus('connecting')

            // Parse and set the offer
            const parsedData = JSON.parse(offerData)
            const offer = parsedData.offer
            await pc.setRemoteDescription(offer)

            // Create answer
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)

            // Show the answer to the user to send back to host
            console.log('=== GUEST ANSWER (Copy this and send to host) ===')
            console.log(JSON.stringify(answer))
            console.log('=== END ANSWER ===')
            
            alert(`ANSWER created! Copy this data from the console and send it to your friend:\n\n${JSON.stringify(answer).substring(0, 100)}...`)

            // Store answer for host to retrieve (for same browser testing)
            localStorage.setItem(`answer_${joinCode}`, JSON.stringify(answer))

            // Check for host's ICE candidates
            checkForHostIce(joinCode)

        } catch (error) {
            console.error('Error joining game:', error)
            alert('Failed to join game. Please try again.')
            setGameState('menu')
        }
    }

    const checkForHostIce = async (gameId) => {
        const checkInterval = setInterval(async () => {
            const hostIceData = localStorage.getItem(`host_ice_${gameId}`)
            if (hostIceData) {
                try {
                    const hostIce = JSON.parse(hostIceData)
                    if (Array.isArray(hostIce)) {
                        for (const candidate of hostIce) {
                            await peerConnection.current.addIceCandidate(candidate)
                        }
                    }
                    clearInterval(checkInterval)
                } catch (error) {
                    console.error('Error adding host ICE candidate:', error)
                }
            }
        }, 2000) // Check every 2 seconds

        // Stop checking after 5 minutes
        setTimeout(() => clearInterval(checkInterval), 300000)
    }

    // Add function to handle manual answer input for host
    const handleManualAnswerInput = () => {
        if (gameState === 'hosting') {
            const answerText = prompt('Please paste the ANSWER data from your friend:')
            if (answerText) {
                try {
                    const answer = JSON.parse(answerText)
                    localStorage.setItem(`answer_${gameId}`, JSON.stringify(answer))
                } catch (error) {
                    alert('Invalid ANSWER data. Please copy the complete answer from your friend.')
                }
            }
        }
    }

    const setupDataChannel = (dc) => {
        dc.onopen = () => {
            console.log('Data channel opened')
            setConnectionStatus('connected')
            setGameState('playing')
            
            // Send player info
            dc.send(JSON.stringify({
                type: 'playerInfo',
                name: playerName,
                symbol: playerSymbol
            }))
        }

        dc.onmessage = (event) => {
            const message = JSON.parse(event.data)
            handleGameMessage(message)
        }

        dc.onclose = () => {
            console.log('Data channel closed')
            setConnectionStatus('disconnected')
        }

        dc.onerror = (error) => {
            console.error('Data channel error:', error)
        }
    }

    const handleGameMessage = (message) => {
        switch (message.type) {
            case 'playerInfo':
                setOpponentName(message.name)
                break
            case 'move':
                handleOpponentMove(message.position, message.player)
                break
            case 'gameOver':
                setWinner(message.winner)
                setGameState('ended')
                break
            case 'restart':
                restartGame()
                break
        }
    }

    const handleOpponentMove = (position, player) => {
        const newBoard = [...board]
        newBoard[position] = player
        setBoard(newBoard)
        setCurrentPlayer(player === 'X' ? 'O' : 'X')

        // Check for winner
        let gameWinner = null
        for (let combination of winningCombinations) {
            const [a, b, c] = combination
            if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
                gameWinner = newBoard[a]
                break
            }
        }

        if (newBoard.every(cell => cell !== null) && !gameWinner) {
            gameWinner = 'draw'
        }

        if (gameWinner) {
            setWinner(gameWinner)
            setGameState('ended')
            
            // Notify other player
            if (dataChannel.current) {
                dataChannel.current.send(JSON.stringify({
                    type: 'gameOver',
                    winner: gameWinner
                }))
            }
        }
    }

    const makeMove = (index) => {
        if (board[index] || winner || currentPlayer !== playerSymbol || gameState !== 'playing') {
            return
        }

        const newBoard = [...board]
        newBoard[index] = playerSymbol
        setBoard(newBoard)
        setCurrentPlayer(playerSymbol === 'X' ? 'O' : 'X')

        // Send move to opponent
        if (dataChannel.current) {
            dataChannel.current.send(JSON.stringify({
                type: 'move',
                position: index,
                player: playerSymbol
            }))
        }

        // Check for winner
        let gameWinner = null
        for (let combination of winningCombinations) {
            const [a, b, c] = combination
            if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
                gameWinner = newBoard[a]
                break
            }
        }

        if (newBoard.every(cell => cell !== null) && !gameWinner) {
            gameWinner = 'draw'
        }

        if (gameWinner) {
            setWinner(gameWinner)
            setGameState('ended')
            
            // Notify opponent
            if (dataChannel.current) {
                dataChannel.current.send(JSON.stringify({
                    type: 'gameOver',
                    winner: gameWinner
                }))
            }
        }
    }

    const restartGame = () => {
        setBoard(Array(9).fill(null))
        setCurrentPlayer('X')
        setWinner(null)
        setGameState('playing')
    }

    const leaveGame = () => {
        cleanup()
        setGameState('menu')
        setPlayerName('')
        setOpponentName('')
        setGameId('')
        setJoinCode('')
        setConnectionStatus('disconnected')
        setBoard(Array(9).fill(null))
        setCurrentPlayer('X')
        setWinner(null)
    }

    const getCellContent = (value) => {
        if (value === 'X') return '❌'
        if (value === 'O') return '⭕'
        return ''
    }

    const getWinnerMessage = () => {
        if (winner === 'draw') return "It's a draw! 🤝"
        if (winner === 'X') return `${playerSymbol === 'X' ? playerName : opponentName} wins! 🎉`
        if (winner === 'O') return `${playerSymbol === 'O' ? playerName : opponentName} wins! 🎉`
        return ''
    }

    const getTurnMessage = () => {
        if (gameState === 'hosting') {
            return 'Share this code with your friend and wait for them to join...'
        }
        if (gameState === 'joining') {
            return 'Establishing secure connection...'
        }
        if (gameState === 'playing') {
            return currentPlayer === playerSymbol ? 'Your turn!' : `${opponentName}'s turn`
        }
        return ''
    }

    const getConnectionStatusColor = () => {
        switch (connectionStatus) {
            case 'connected': return '#48bb78'
            case 'connecting': return '#ed8936'
            case 'waiting for opponent': return '#4299e1'
            default: return '#e53e3e'
        }
    }

    if (gameState === 'menu') {
        return (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '20px',
                fontFamily: 'Georgia, serif'
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '30px',
                    borderRadius: '15px',
                    textAlign: 'center',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                    border: '2px solid #667eea',
                    maxWidth: '400px'
                }}>
                    <h2 style={{
                        color: '#4a5568',
                        fontSize: '1.8rem',
                        marginBottom: '25px',
                        fontFamily: 'Georgia, serif'
                    }}>
                        🌐 WebRTC Tic-Tac-Toe
                    </h2>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            color: '#4a5568',
                            fontSize: '1rem',
                            marginBottom: '5px',
                            fontWeight: 'bold'
                        }}>
                            Your Name:
                        </label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                border: '2px solid #667eea',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                width: '200px',
                                fontFamily: 'Georgia, serif'
                            }}
                            placeholder="Enter your name"
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <button
                            onClick={createGame}
                            style={{
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                color: 'white',
                                border: 'none',
                                padding: '12px 30px',
                                borderRadius: '25px',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                fontFamily: 'Georgia, serif',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                            }}
                        >
                            Create New Game
                        </button>
                        
                        <div style={{ color: '#718096', fontSize: '0.9rem' }}>
                            OR
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                placeholder="Enter Game Code"
                                style={{
                                    padding: '8px 12px',
                                    border: '2px solid #764ba2',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    flex: 1,
                                    fontFamily: 'Georgia, serif',
                                    textTransform: 'uppercase'
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        joinGame()
                                    }
                                }}
                            />
                            <button
                                onClick={joinGame}
                                style={{
                                    background: 'linear-gradient(45deg, #48bb78, #38a169)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    fontFamily: 'Georgia, serif',
                                    fontWeight: 'bold'
                                }}
                            >
                                Join
                            </button>
                        </div>
                    </div>

                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        background: 'rgba(102, 126, 234, 0.1)',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#4a5568'
                    }}>
                        <strong>🚀 WebRTC Benefits:</strong><br/>
                        • Direct peer-to-peer connection<br/>
                        • Ultra-low latency gameplay<br/>
                        • No server required for moves<br/>
                        • Works even with slow internet
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            padding: '20px',
            fontFamily: 'Georgia, serif',
            position: 'relative'
        }}>
            <button
                onClick={leaveGame}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(245, 101, 101, 0.9)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    fontFamily: 'Georgia, serif',
                    fontWeight: 'bold'
                }}
            >
                Leave Game
            </button>

            <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '15px 25px',
                borderRadius: '10px',
                marginBottom: '20px',
                textAlign: 'center',
                border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '10px'
                }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: getConnectionStatusColor()
                    }} />
                    <div style={{
                        fontSize: '0.9rem',
                        color: '#4a5568',
                        fontWeight: 'bold'
                    }}>
                        {connectionStatus.toUpperCase()}
                    </div>
                </div>
                
                {gameId && (
                    <div style={{
                        fontSize: '1rem',
                        color: '#4a5568',
                        fontWeight: 'bold',
                        marginBottom: '10px'
                    }}>
                        Game Code: <span style={{ 
                            fontFamily: 'monospace', 
                            background: '#f0f0f0', 
                            padding: '2px 6px', 
                            borderRadius: '4px' 
                        }}>{gameId}</span>
                    </div>
                )}
                
                <div style={{
                    fontSize: '1.2rem',
                    color: '#4a5568',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                }}>
                    {winner ? getWinnerMessage() : getTurnMessage()}
                </div>
                
                {opponentName && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        fontSize: '0.9rem',
                        color: '#718096'
                    }}>
                        <div>❌ {playerSymbol === 'X' ? playerName : opponentName}</div>
                        <div>⭕ {playerSymbol === 'O' ? playerName : opponentName}</div>
                    </div>
                )}
            </div>

            {gameState === 'hosting' && (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>
                    <div style={{ fontSize: '1.1rem', color: '#4a5568', marginBottom: '10px' }}>
                        Share this Game Code with your friend:
                    </div>
                    <div style={{
                        fontFamily: 'monospace',
                        fontSize: '1.2rem',
                        background: '#f0f0f0',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '2px solid #667eea',
                        marginBottom: '10px'
                    }}>
                        {gameId}
                    </div>
                    <div style={{
                        fontSize: '0.9rem',
                        color: '#718096',
                        fontStyle: 'italic',
                        marginBottom: '15px'
                    }}>
                        Check console (F12) for OFFER data to send to your friend
                    </div>
                    <button
                        onClick={handleManualAnswerInput}
                        style={{
                            background: 'linear-gradient(45deg, #48bb78, #38a169)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            fontFamily: 'Georgia, serif',
                            fontWeight: 'bold'
                        }}
                    >
                        Paste Friend's Answer
                    </button>
                </div>
            )}

            {gameState === 'joining' && (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>
                    <div style={{ 
                        fontSize: '1.1rem', 
                        color: '#4a5568', 
                        marginBottom: '15px' 
                    }}>
                        Connecting to game...
                    </div>
                    <div style={{
                        display: 'inline-block',
                        width: '20px',
                        height: '20px',
                        border: '3px solid #f3f3f3',
                        borderTop: '3px solid #667eea',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 80px)',
                gridTemplateRows: 'repeat(3, 80px)',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '15px',
                borderRadius: '15px',
                border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
                {board.map((cell, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: cell || currentPlayer !== playerSymbol ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => makeMove(index)}
                        disabled={cell !== null || winner !== null || currentPlayer !== playerSymbol || gameState !== 'playing'}
                        style={{
                            background: cell 
                                ? (cell === 'X' ? 'rgba(255, 99, 71, 0.8)' : 'rgba(70, 130, 180, 0.8)')
                                : currentPlayer === playerSymbol && gameState === 'playing'
                                    ? 'rgba(255, 255, 255, 0.95)'
                                    : 'rgba(255, 255, 255, 0.7)',
                            border: '2px solid rgba(255, 255, 255, 0.5)',
                            borderRadius: '10px',
                            fontSize: '2rem',
                            cursor: cell || winner || currentPlayer !== playerSymbol || gameState !== 'playing' ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            opacity: currentPlayer !== playerSymbol && gameState === 'playing' ? 0.7 : 1
                        }}
                    >
                        {getCellContent(cell)}
                    </motion.button>
                ))}
            </div>

            <AnimatePresence>
                {winner && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'rgba(255, 255, 255, 0.95)',
                            padding: '30px',
                            borderRadius: '15px',
                            textAlign: 'center',
                            border: '3px solid #667eea',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                            zIndex: 10
                        }}
                    >
                        <h3 style={{
                            color: '#4a5568',
                            fontSize: '1.5rem',
                            marginBottom: '15px',
                            fontFamily: 'Georgia, serif'
                        }}>
                            {getWinnerMessage()}
                        </h3>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                onClick={restartGame}
                                style={{
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '20px',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    fontFamily: 'Georgia, serif',
                                    fontWeight: 'bold'
                                }}
                            >
                                Play Again
                            </button>
                            <button
                                onClick={leaveGame}
                                style={{
                                    background: 'linear-gradient(45deg, #f56565, #e53e3e)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '20px',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    fontFamily: 'Georgia, serif',
                                    fontWeight: 'bold'
                                }}
                            >
                                Leave Game
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
