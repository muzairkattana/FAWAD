import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key"

// Check if we have real Supabase credentials
const hasRealSupabaseCredentials = supabaseUrl !== "https://your-project.supabase.co" && 
                                   supabaseAnonKey !== "your-anon-key"

export const supabase = hasRealSupabaseCredentials ? createClient(supabaseUrl, supabaseAnonKey) : null

// Enhanced chat functions with real-time support
export const supabaseFetch = {
    // Get all messages
    getMessages: async () => {
        if (hasRealSupabaseCredentials && supabase) {
            try {
                const { data, error } = await supabase
                    .from('antique_chat_messages')
                    .select('*')
                    .eq('is_deleted', false)
                    .order('created_at', { ascending: true })

                if (!error) {
                    console.log('Fetched messages from Supabase:', data.length)
                    return data
                }
                console.error('Supabase fetch error:', error)
            } catch (err) {
                console.error('Supabase exception:', err)
            }
        }

        // Fallback to localStorage
        const localMessages = JSON.parse(localStorage.getItem("antique_chat_messages") || "[]")
        console.log('Using localStorage messages:', localMessages.length)
        return localMessages
    },

    // Send a new message
    sendMessage: async (sender, content) => {
        const newMessage = {
            sender: sender.trim(),
            content: content.trim(),
            created_at: new Date().toISOString(),
            is_offline: !hasRealSupabaseCredentials
        }

        if (hasRealSupabaseCredentials && supabase) {
            try {
                const { data, error } = await supabase
                    .from('antique_chat_messages')
                    .insert([{
                        sender: newMessage.sender,
                        content: newMessage.content,
                        created_at: newMessage.created_at
                    }])
                    .select()
                    .single()

                if (!error) {
                    console.log('Message sent to Supabase:', data)
                    return data
                }
                console.error('Supabase send error:', error)
            } catch (err) {
                console.error('Supabase exception:', err)
            }
        }

        // Fallback to localStorage
        const messages = JSON.parse(localStorage.getItem("antique_chat_messages") || "[]")
        const localMessage = {
            ...newMessage,
            id: Date.now().toString()
        }
        messages.push(localMessage)
        localStorage.setItem("antique_chat_messages", JSON.stringify(messages))
        console.log('Message saved to localStorage:', localMessage)
        return localMessage
    },

    // Delete a message
    deleteMessage: async (id) => {
        if (hasRealSupabaseCredentials && supabase) {
            try {
                const { error } = await supabase
                    .from('antique_chat_messages')
                    .update({ is_deleted: true })
                    .eq('id', id)

                if (!error) {
                    console.log('Message deleted from Supabase:', id)
                    return true
                }
                console.error('Supabase delete error:', error)
            } catch (err) {
                console.error('Supabase delete exception:', err)
            }
        }

        // Fallback to localStorage
        const messages = JSON.parse(localStorage.getItem("antique_chat_messages") || "[]")
        const filteredMessages = messages.filter(msg => msg.id !== id)
        localStorage.setItem("antique_chat_messages", JSON.stringify(filteredMessages))
        console.log('Message deleted from localStorage:', id)
        return true
    },

    // Subscribe to real-time messages
    subscribeToMessages: (callback) => {
        if (hasRealSupabaseCredentials && supabase) {
            try {
                const subscription = supabase
                    .channel('antique_chat_messages')
                    .on('postgres_changes', 
                        { 
                            event: 'INSERT', 
                            schema: 'public', 
                            table: 'antique_chat_messages',
                            filter: 'is_deleted=eq.false'
                        }, 
                        (payload) => {
                            console.log('Real-time message received:', payload.new)
                            callback(payload.new)
                        }
                    )
                    .subscribe()

                console.log('Subscribed to real-time messages')
                return subscription
            } catch (err) {
                console.error('Real-time subscription error:', err)
            }
        }

        // Fallback: poll for new messages
        console.log('Using polling fallback for real-time updates')
        const pollInterval = setInterval(async () => {
            const messages = await supabaseFetch.getMessages()
            callback(messages[messages.length - 1]) // Send latest message
        }, 5000) // Poll every 5 seconds

        return {
            unsubscribe: () => clearInterval(pollInterval)
        }
    },

    // Check connection status
    checkConnection: () => {
        return hasRealSupabaseCredentials && supabase !== null
    }
}

// Environment check helper
export const checkSupabaseConfig = () => {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    console.log('Supabase Configuration Check:')
    console.log('URL:', url ? 'Set' : 'Not set')
    console.log('Key:', key ? 'Set' : 'Not set')
    console.log('Has Real Credentials:', hasRealSupabaseCredentials)
    
    return {
        hasUrl: !!url,
        hasKey: !!key,
        hasRealCredentials: hasRealSupabaseCredentials,
        url: url,
        key: key ? key.substring(0, 10) + '...' : null
    }
}
