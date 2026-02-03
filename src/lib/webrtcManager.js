// Simple signaling server using PeerJS (free public service)
import Peer from 'peerjs'

export class WebRTCManager {
    constructor() {
        this.peer = null
        this.connections = new Map()
        this.localStream = null
        this.onGameMove = null
        this.onVoiceConnect = null
        this.onPlayerConnect = null
    }

    async initialize(gameId, playerName, isHost = false) {
        try {
            // Create peer with PeerJS (free public signaling)
            this.peer = new Peer(`${gameId}-${playerName}-${Date.now()}`, {
                host: '0.peerjs.com',
                port: 443,
                path: '/',
                secure: true
            })

            // Get user media for voice
            this.localStream = await navigator.mediaDevices.getUserMedia({ 
                audio: true, 
                video: false 
            })

            this.peer.on('open', (id) => {
                console.log('PeerJS connected with ID:', id)
                if (isHost) {
                    console.log(`Share this PeerJS ID with your friend: ${id}`)
                }
            })

            this.peer.on('connection', (conn) => {
                this.handleConnection(conn)
            })

            this.peer.on('call', (call) => {
                call.answer(this.localStream)
                call.on('stream', (remoteStream) => {
                    console.log('Voice connected!')
                    if (this.onVoiceConnect) {
                        this.onVoiceConnect(remoteStream)
                    }
                })
            })

            return this.peer.id
        } catch (error) {
            console.error('Failed to initialize WebRTC:', error)
            throw error
        }
    }

    async connectToHost(peerId, playerName) {
        try {
            // Create data connection for game moves
            const conn = this.peer.connect(peerId, {
                reliable: true
            })
            
            this.handleConnection(conn)

            // Create voice call
            const call = this.peer.call(peerId, this.localStream)
            call.on('stream', (remoteStream) => {
                console.log('Voice connected!')
                if (this.onVoiceConnect) {
                    this.onVoiceConnect(remoteStream)
                }
            })

            return conn
        } catch (error) {
            console.error('Failed to connect to host:', error)
            throw error
        }
    }

    handleConnection(conn) {
        conn.on('open', () => {
            console.log('Data connection established!')
            this.connections.set(conn.peer, conn)
            
            if (this.onPlayerConnect) {
                this.onPlayerConnect(conn.metadata)
            }
        })

        conn.on('data', (data) => {
            if (this.onGameMove) {
                this.onGameMove(data)
            }
        })

        conn.on('close', () => {
            this.connections.delete(conn.peer)
        })
    }

    sendGameMove(moveData) {
        this.connections.forEach(conn => {
            conn.send(moveData)
        })
    }

    async startVoiceCall(peerId) {
        try {
            const call = this.peer.call(peerId, this.localStream)
            return call
        } catch (error) {
            console.error('Failed to start voice call:', error)
            throw error
        }
    }

    cleanup() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop())
        }
        
        this.connections.forEach(conn => conn.close())
        this.connections.clear()
        
        if (this.peer) {
            this.peer.destroy()
        }
    }
}
