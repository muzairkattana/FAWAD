import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TicTacToeGame({ onWin }) {
    const [board, setBoard] = useState(Array(9).fill(null))
    const [currentPlayer, setCurrentPlayer] = useState('X')
    const [winner, setWinner] = useState(null)
    const [gameStarted, setGameStarted] = useState(false)
    const [player1Name, setPlayer1Name] = useState('Player 1')
    const [player2Name, setPlayer2Name] = useState('Player 2')
    const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ]

    useEffect(() => {
        checkWinner()
    }, [board])

    const checkWinner = () => {
        for (let combination of winningCombinations) {
            const [a, b, c] = combination
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                setWinner(board[a])
                setScores(prev => ({
                    ...prev,
                    [board[a]]: prev[board[a]] + 1
                }))
                return
            }
        }

        if (board.every(cell => cell !== null)) {
            setWinner('draw')
            setScores(prev => ({
                ...prev,
                draws: prev.draws + 1
            }))
        }
    }

    const handleCellClick = (index) => {
        if (board[index] || winner || !gameStarted) return

        const newBoard = [...board]
        newBoard[index] = currentPlayer
        setBoard(newBoard)
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
    }

    const resetGame = () => {
        setBoard(Array(9).fill(null))
        setCurrentPlayer('X')
        setWinner(null)
    }

    const startGame = () => {
        setGameStarted(true)
        resetGame()
    }

    const getCellContent = (value) => {
        if (value === 'X') return '❌'
        if (value === 'O') return '⭕'
        return ''
    }

    const getWinnerMessage = () => {
        if (winner === 'draw') return "It's a draw! 🤝"
        if (winner === 'X') return `${player1Name} wins! 🎉`
        if (winner === 'O') return `${player2Name} wins! 🎉`
        return ''
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
            fontFamily: 'Georgia, serif'
        }}>
            {!gameStarted ? (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '30px',
                    borderRadius: '15px',
                    textAlign: 'center',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                    border: '2px solid #667eea'
                }}>
                    <h2 style={{
                        color: '#4a5568',
                        fontSize: '1.8rem',
                        marginBottom: '25px',
                        fontFamily: 'Georgia, serif'
                    }}>
                        ⭕ Tic-Tac-Toe ❌
                    </h2>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{
                                display: 'block',
                                color: '#4a5568',
                                fontSize: '1rem',
                                marginBottom: '5px',
                                fontWeight: 'bold'
                            }}>
                                Player 1 (❌) Name:
                            </label>
                            <input
                                type="text"
                                value={player1Name}
                                onChange={(e) => setPlayer1Name(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    border: '2px solid #667eea',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    width: '200px',
                                    fontFamily: 'Georgia, serif'
                                }}
                                placeholder="Enter name"
                            />
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{
                                display: 'block',
                                color: '#4a5568',
                                fontSize: '1rem',
                                marginBottom: '5px',
                                fontWeight: 'bold'
                            }}>
                                Player 2 (⭕) Name:
                            </label>
                            <input
                                type="text"
                                value={player2Name}
                                onChange={(e) => setPlayer2Name(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    border: '2px solid #764ba2',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    width: '200px',
                                    fontFamily: 'Georgia, serif'
                                }}
                                placeholder="Enter name"
                            />
                        </div>
                    </div>

                    <button
                        onClick={startGame}
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
                        Start Game
                    </button>
                </div>
            ) : (
                <>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '15px 25px',
                        borderRadius: '10px',
                        marginBottom: '20px',
                        textAlign: 'center',
                        border: '2px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        <div style={{
                            fontSize: '1.2rem',
                            color: '#4a5568',
                            fontWeight: 'bold',
                            marginBottom: '10px'
                        }}>
                            {winner ? getWinnerMessage() : `${currentPlayer === 'X' ? player1Name : player2Name}'s Turn`}
                        </div>
                        
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            fontSize: '0.9rem',
                            color: '#718096'
                        }}>
                            <div>❌ {player1Name}: {scores.X}</div>
                            <div>Draws: {scores.draws}</div>
                            <div>⭕ {player2Name}: {scores.O}</div>
                        </div>
                    </div>

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
                                whileHover={{ scale: cell ? 1 : 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCellClick(index)}
                                disabled={cell !== null || winner !== null}
                                style={{
                                    background: cell 
                                        ? (cell === 'X' ? 'rgba(255, 99, 71, 0.8)' : 'rgba(70, 130, 180, 0.8)')
                                        : 'rgba(255, 255, 255, 0.9)',
                                    border: '2px solid rgba(255, 255, 255, 0.5)',
                                    borderRadius: '10px',
                                    fontSize: '2rem',
                                    cursor: cell || winner ? 'default' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {getCellContent(cell)}
                            </motion.button>
                        ))}
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                        <button
                            onClick={resetGame}
                            style={{
                                background: 'linear-gradient(45deg, #48bb78, #38a169)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                fontFamily: 'Georgia, serif',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 15px rgba(72, 187, 120, 0.3)'
                            }}
                        >
                            New Game
                        </button>
                        
                        <button
                            onClick={() => {
                                setGameStarted(false)
                                setScores({ X: 0, O: 0, draws: 0 })
                            }}
                            style={{
                                background: 'linear-gradient(45deg, #f56565, #e53e3e)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                fontFamily: 'Georgia, serif',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 15px rgba(245, 101, 101, 0.3)'
                            }}
                        >
                            Change Players
                        </button>
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
                                    onClick={resetGame}
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
                </>
            )}
        </div>
    )
}
