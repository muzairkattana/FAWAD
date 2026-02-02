const SUPABASE_URL = "https://uqjmfmitpiodxsmpqesj.supabase.co";
const SUPABASE_KEY = "sb_publishable_2elCAr5bK1DnZW2DLdEtiQ_naZ-f6sE";

const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
};

export const supabaseFetch = {
    getMessages: async () => {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/messages?select=*&order=created_at.asc`, {
            headers
        });
        if (!response.ok) throw new Error("Failed to fetch messages");
        return response.json();
    },

    sendMessage: async (sender, content) => {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
            method: "POST",
            headers,
            body: JSON.stringify({ sender, content, created_at: new Date().toISOString() })
        });
        if (!response.ok) throw new Error("Failed to send message");
        return response.json();
    },

    deleteMessage: async (id) => {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/messages?id=eq.${id}`, {
            method: "DELETE",
            headers
        });
        if (!response.ok) throw new Error("Failed to delete message");
        return true;
    },

    updateMessage: async (id, updates) => {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/messages?id=eq.${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error("Failed to update message");
        return response.json();
    }
};
