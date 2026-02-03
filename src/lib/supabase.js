// Legacy functions for antique chat (now using localStorage for offline mode)
const syncOfflineMessages = async () => {
    // Since we removed Supabase, messages will remain in localStorage
    console.log('Offline mode: Messages stored locally')
};

export const supabaseFetch = {
    getMessages: async () => {
        const messages = JSON.parse(localStorage.getItem("antique_chat_messages") || "[]");
        return messages;
    },

    sendMessage: async (sender, content) => {
        const messages = JSON.parse(localStorage.getItem("antique_chat_messages") || "[]");
        const newMessage = {
            id: Date.now(),
            sender,
            content,
            created_at: new Date().toISOString(),
            is_offline: true
        };
        messages.push(newMessage);
        localStorage.setItem("antique_chat_messages", JSON.stringify(messages));
        return newMessage;
    },

    deleteMessage: async (id) => {
        const messages = JSON.parse(localStorage.getItem("antique_chat_messages") || "[]");
        const filteredMessages = messages.filter(msg => msg.id !== id);
        localStorage.setItem("antique_chat_messages", JSON.stringify(filteredMessages));
        return true;
    }
};
