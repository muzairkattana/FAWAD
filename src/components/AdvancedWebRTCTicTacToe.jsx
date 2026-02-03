import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WebRTCManager } from '../lib/webrtcManager'

export default function AdvancedWebRTCTicTacToe({ onWin }) {
    const [gameState, setGameState] = useState('menu') // menu, hosting, joining, playing, ended
    const [playerName, setPlayerName] = useState('')
    const [opponentName, setOpponentName] = useState('')
    const [playerSymbol, setPlayerSymbol] = useState('X')
    const [board, setBoard] = useState(Array(9).fill(null))
    const [currentPlayer, setCurrentPlayer] = useState('X')
    const [winner, setWinner] = useState(null)
    const [connectionStatus, setConnectionStatus] = useState('disconnected')
    const [gameCode, setGameCode] = useState('')
    const [joinCode, setJoinCode] = useState('')
    const [peerId, setPeerId] = useState('')
    const [voiceEnabled, setVoiceEnabled] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    
    const webrtcManager = useRef(null)
    const audioRef = useRef(null)

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ]

    useEffect(() => {
        return () => {
            if (webrtcManager.current) {
                webrtcManager.current.cleanup()
            }
        }
    }, [])

    const generateGameCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase()
    }

    const createGame = async () => {
        if (!playerName.trim()) {
            alert('Please enter your name!')
            return
        }

        const newGameCode = generateGameCode()
        setGameCode(newGameCode)
        setPlayerSymbol('X')
        setGameState('hosting')
        setConnectionStatus('connecting')

        try {
            webrtcManager.current = new WebRTCManager()
            
            // Initialize WebRTC with automatic signaling
            const id = await webrtcManager.current.initialize(newGameCode, playerName, true)
            setPeerId(id)

            // Set up event handlers
            webrtcManager.current.onPlayerConnect = (metadata) => {
                setOpponentName(metadata?.name || 'Player 2')
                setConnectionStatus('connected')
                setGameState('playing')
                setVoiceEnabled(true)
            }

            webrtcManager.current.onGameMove = (moveData) => {
                handleOpponentMove(moveData.position, moveData.player)
            }

            webrtcManager.current.onVoiceConnect = (remoteStream) => {
                if (audioRef.current) {
                    audioRef.current.srcObject = remoteStream
                }
            }

        } catch (error) {
            console.error('Error creating game:', error)
            alert('Failed to create game. Please check microphone permissions.')
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
        setConnectionStatus('connecting')

        try {
            webrtcManager.current = new WebRTCManager()
            
            // Initialize WebRTC
            const id = await webrtcManager.current.initialize(joinCode, playerName, false)
            setPeerId(id)

            // Prompt for host's PeerJS ID (this is the only manual step needed)
            const hostPeerId = prompt(`Enter the Host's PeerJS ID (they should see this in their console):\n\nIt looks like: abc123-def456-789...`)
            
            if (!hostPeerId) {
                alert('Connection cancelled.')
                setGameState('menu')
                return
            }

            // Connect to host
            await webrtcManager.current.connectToHost(hostPeerId, playerName)

            // Set up event handlers
            webrtcManager.current.onPlayerConnect = (metadata) => {
                setOpponentName(metadata?.name || 'Player 1')
                setConnectionStatus('connected')
                setGameState('playing')
                setVoiceEnabled(true)
            }

            webrtcManager.current.onGameMove = (moveData) => {
                handleOpponentMove(moveData.position, moveData.player)
            }

            webrtcManager.current.onVoiceConnect = (remoteStream) => {
                if (audioRef.current) {
                    audioRef.current.srcObject = remoteStream
                }
            }

        } catch (error) {
            console.error('Error joining game:', error)
            alert('Failed to join game. Please check microphone permissions and the PeerJS ID.')
            setGameState('menu')
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
        if (webrtcManager.current) {
            webrtcManager.current.sendGameMove({
                type: 'move',
                position: index,
                player: playerSymbol
            })
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
            if (webrtcManager.current) {
                webrtcManager.current.sendGameMove({
                    type: 'gameOver',
                    winner: gameWinner
                })
            }
        }
    }

    const toggleMute = () => {
        if (webrtcManager.current && webrtcManager.current.localStream) {
            const audioTracks = webrtcManager.current.localStream.getAudioTracks()
            audioTracks.forEach(track => {
                track.enabled = !track.enabled
            })
            setIsMuted(!isMuted)
        }
    }

    const leaveGame = () => {
        if (webrtcManager.current) {
            webrtcManager.current.cleanup()
        }
        setGameState('menu')
        setPlayerName('')
        setOpponentName('')
        setGameCode('')
        setJoinCode('')
        setConnectionStatus('disconnected')
        setBoard(Array(9).fill(null))
        setCurrentPlayer('X')
        setWinner(null)
        setVoiceEnabled(false)
        setIsMuted(false)
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
            return `Share your PeerJS ID: ${peerId.substring(0, 20)}...`
        }
        if (gameState === 'joining') {
            return 'Connecting to host...'
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
                    maxWidth: '450px'
                }}>
                    <h2 style={{
                        color: '#4a5568',
                        fontSize: '1.8rem',
                        marginBottom: '25px',
                        fontFamily: 'Georgia, serif'
                    }}>
                        🌐 Advanced WebRTC Game
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
                            🎮 Create New Game
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
                        <strong>🚀 Features:</strong><br/>
                        • Automatic P2P connection<br/>
                        • Voice chat during gameplay<br/>
                        • No server required for moves<br/>
                        • Works globally with PeerJS
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
            <audio ref={audioRef} autoPlay playsInline />

            {/* Voice Chat Controls */}
            {voiceEnabled && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '10px',
                    borderRadius: '10px',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center'
                }}>
                    <span style={{ fontSize: '0.9rem', color: '#4a5568' }}>🎤 Voice:</span>
                    <button
                        onClick={toggleMute}
                        style={{
                            background: isMuted ? '#e53e3e' : '#48bb78',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                        }}
                    >
                        {isMuted ? 'Unmute' : 'Mute'}
                    </button>
                </div>
            )}

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
                
                {gameCode && (
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
                        }}>{gameCode}</span>
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
                        {gameCode}
                    </div>
                    <div style={{
                        fontSize: '0.8rem',
                        color: '#718096',
                        fontStyle: 'italic',
                        marginBottom: '10px'
                    }}>
                        Also share your PeerJS ID from console (F12)
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
                        <button
                            onClick={leaveGame}
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
