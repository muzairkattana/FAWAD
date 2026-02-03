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
    const localConnectionRef = useRef(null)
    const remoteConnectionRef = useRef(null)

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
        if (localConnectionRef.current) {
            localConnectionRef.current.close()
        }
        if (remoteConnectionRef.current) {
            remoteConnectionRef.current.close()
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
                }
            }

            // Create offer
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)

            // Store offer for sharing (in real app, you'd send this to a signaling server)
            localConnectionRef.current = offer
            
            setConnectionStatus('waiting for opponent')

        } catch (error) {
            console.error('Error creating game:', error)
            alert('Failed to create game. Please try again.')
            setGameState('menu')
        }
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
                }
            }

            setConnectionStatus('connecting')

        } catch (error) {
            console.error('Error joining game:', error)
            alert('Failed to join game. Please try again.')
            setGameState('menu')
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
            return 'Connecting to game...'
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
                        border: '2px solid #667eea'
                    }}>
                        {gameId}
                    </div>
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
