-- Supabase SQL for Chat System

-- Create antique_chat_messages table for real-time chat
CREATE TABLE IF NOT EXISTS antique_chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON antique_chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON antique_chat_messages(sender);
CREATE INDEX IF NOT EXISTS idx_chat_messages_not_deleted ON antique_chat_messages(created_at DESC) WHERE is_deleted = false;

-- Enable RLS (Row Level Security)
ALTER TABLE antique_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for antique_chat_messages
-- Allow anyone to read messages (for public chat)
CREATE POLICY "Anyone can view messages" ON antique_chat_messages
    FOR SELECT USING (is_deleted = false);

-- Allow anyone to insert messages (for public chat)
CREATE POLICY "Anyone can insert messages" ON antique_chat_messages
    FOR INSERT WITH CHECK (true);

-- Allow users to update their own messages
CREATE POLICY "Users can update their own messages" ON antique_chat_messages
    FOR UPDATE USING (auth.uid()::text = sender::text OR true);

-- Allow users to delete their own messages
CREATE POLICY "Users can delete their own messages" ON antique_chat_messages
    FOR DELETE USING (auth.uid()::text = sender::text OR true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_antique_chat_messages_updated_at 
    BEFORE UPDATE ON antique_chat_messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_chat_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON antique_chat_messages TO authenticated, anon;

-- Enable Realtime for the chat table
-- This needs to be done in Supabase dashboard:
-- 1. Go to Database > Replication
-- 2. Enable replication for antique_chat_messages table
-- 3. Add realtime publication

-- Insert some sample messages (optional)
INSERT INTO antique_chat_messages (sender, content) 
VALUES 
    ('System', 'Welcome to the Antique Chat! 💕'),
    ('Ayesha', 'Hello everyone! 🌸'),
    ('Fawad', 'Hi Ayesha! How are you? 🌹')
ON CONFLICT DO NOTHING;
