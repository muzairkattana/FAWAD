-- SQL for Chat Member Tracking System

-- Create chat_members table to track active members
CREATE TABLE IF NOT EXISTS chat_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    is_online BOOLEAN DEFAULT false,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_count INTEGER DEFAULT 0,
    avatar_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'active', -- active, away, busy, invisible
    browser_info TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create member_activity table to track member actions
CREATE TABLE IF NOT EXISTS member_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES chat_members(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- login, logout, message_sent, page_view
    activity_details TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_members_name ON chat_members(name);
CREATE INDEX IF NOT EXISTS idx_chat_members_online ON chat_members(is_online);
CREATE INDEX IF NOT EXISTS idx_chat_members_last_seen ON chat_members(last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_member_activity_member_id ON member_activity(member_id);
CREATE INDEX IF NOT EXISTS idx_member_activity_created_at ON member_activity(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_members (public read access for member list)
CREATE POLICY "Anyone can view member list" ON chat_members
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert their profile" ON chat_members
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Members can update their own profile" ON chat_members
    FOR UPDATE USING (
        auth.uid()::text = id::text OR true -- Allow self-update or public for demo
    );

-- RLS Policies for member_activity
CREATE POLICY "Anyone can view activity" ON member_activity
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert activity" ON member_activity
    FOR INSERT WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_chat_members_updated_at 
    BEFORE UPDATE ON chat_members 
    FOR EACH ROW 
    EXECUTE FUNCTION update_chat_members_updated_at();

-- Function to update member online status
CREATE OR REPLACE FUNCTION update_member_online_status(
    p_member_name VARCHAR(255),
    p_is_online BOOLEAN DEFAULT true,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    -- Update or insert member
    INSERT INTO chat_members (name, is_online, last_seen, ip_address, browser_info)
    VALUES (p_member_name, p_is_online, NOW(), p_ip_address, p_user_agent)
    ON CONFLICT (name) 
    DO UPDATE SET
        is_online = p_is_online,
        last_seen = NOW(),
        ip_address = COALESCE(p_ip_address, chat_members.ip_address),
        browser_info = COALESCE(p_user_agent, chat_members.browser_info),
        updated_at = NOW();
    
    -- Log activity
    INSERT INTO member_activity (member_id, activity_type, activity_details, ip_address, user_agent)
    VALUES (
        (SELECT id FROM chat_members WHERE name = p_member_name),
        CASE WHEN p_is_online THEN 'login' ELSE 'logout' END,
        CASE WHEN p_is_online THEN 'Member came online' ELSE 'Member went offline' END,
        p_ip_address,
        p_user_agent
    );
END;
$$ LANGUAGE plpgsql;

-- Function to increment message count
CREATE OR REPLACE FUNCTION increment_message_count(p_member_name VARCHAR(255))
RETURNS void AS $$
BEGIN
    UPDATE chat_members 
    SET 
        message_count = message_count + 1,
        last_seen = NOW(),
        updated_at = NOW()
    WHERE name = p_member_name;
    
    -- Log message activity
    INSERT INTO member_activity (member_id, activity_type, activity_details)
    VALUES (
        (SELECT id FROM chat_members WHERE name = p_member_name),
        'message_sent',
        'Member sent a message'
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get online members count
CREATE OR REPLACE FUNCTION get_online_members_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*) 
        FROM chat_members 
        WHERE is_online = true 
        AND last_seen > NOW() - INTERVAL '5 minutes' -- Consider offline if not seen for 5 minutes
    );
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old offline members
CREATE OR REPLACE FUNCTION cleanup_old_members()
RETURNS void AS $$
BEGIN
    -- Mark as offline if not seen for 10 minutes
    UPDATE chat_members 
    SET is_online = false 
    WHERE is_online = true 
    AND last_seen < NOW() - INTERVAL '10 minutes';
    
    -- Delete members inactive for more than 30 days
    DELETE FROM chat_members 
    WHERE last_seen < NOW() - INTERVAL '30 days'
    AND is_online = false;
END;
$$ LANGUAGE plpgsql;

-- Create some sample members (optional)
INSERT INTO chat_members (name, is_online, avatar_url, status) 
VALUES 
    ('Ayesha', true, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayesha', 'active'),
    ('Uzair', true, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Uzair', 'active'),
    ('Guest', false, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest', 'away')
ON CONFLICT (name) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON chat_members TO authenticated, anon;
GRANT ALL ON member_activity TO authenticated, anon;

-- Enable Realtime for member tracking
-- This needs to be done in Supabase dashboard:
-- 1. Go to Database > Replication
-- 2. Enable replication for chat_members table
-- 3. Add realtime publication
