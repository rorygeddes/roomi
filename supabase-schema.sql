-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Houses table
CREATE TABLE houses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  commissioner_id UUID REFERENCES users(id),
  beer_value DECIMAL(10,2) DEFAULT 6.00,
  pizza_value DECIMAL(10,2) DEFAULT 15.00,
  currency TEXT DEFAULT 'CAD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- House members table
CREATE TABLE house_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  house_id UUID REFERENCES houses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'commissioner')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(house_id, user_id)
);

-- Transactions table
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  house_id UUID REFERENCES houses(id) ON DELETE CASCADE,
  batch_id TEXT NOT NULL,
  payer_id UUID REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transaction splits table
CREATE TABLE transaction_splits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  settled BOOLEAN DEFAULT FALSE,
  UNIQUE(transaction_id, user_id)
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  house_id UUID REFERENCES houses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID REFERENCES users(id),
  cost DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event attendees table
CREATE TABLE event_attendees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  UNIQUE(event_id, user_id)
);

-- Chores table
CREATE TABLE chores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  house_id UUID REFERENCES houses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES users(id),
  due_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard entries table
CREATE TABLE leaderboard_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  house_id UUID REFERENCES houses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  cycle_start DATE NOT NULL,
  cycle_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- House rules table
CREATE TABLE house_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  house_id UUID REFERENCES houses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  house_id UUID REFERENCES houses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'expense', 'event', 'chore', 'system')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_transactions_house_id ON transactions(house_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transaction_splits_user_id ON transaction_splits(user_id);
CREATE INDEX idx_events_house_id ON events(house_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_chores_house_id ON chores(house_id);
CREATE INDEX idx_chores_assigned_to ON chores(assigned_to);
CREATE INDEX idx_leaderboard_house_id ON leaderboard_entries(house_id);
CREATE INDEX idx_chat_messages_house_id ON chat_messages(house_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE house_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE chores ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE house_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can only see data from their houses)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "House members can view house data" ON houses FOR SELECT USING (
  id IN (SELECT house_id FROM house_members WHERE user_id = auth.uid())
);

CREATE POLICY "House members can view house members" ON house_members FOR SELECT USING (
  house_id IN (SELECT house_id FROM house_members WHERE user_id = auth.uid())
);

CREATE POLICY "House members can view transactions" ON transactions FOR SELECT USING (
  house_id IN (SELECT house_id FROM house_members WHERE user_id = auth.uid())
);

CREATE POLICY "House members can view transaction splits" ON transaction_splits FOR SELECT USING (
  transaction_id IN (
    SELECT id FROM transactions 
    WHERE house_id IN (SELECT house_id FROM house_members WHERE user_id = auth.uid())
  )
);

CREATE POLICY "House members can view events" ON events FOR SELECT USING (
  house_id IN (SELECT house_id FROM house_members WHERE user_id = auth.uid())
);

CREATE POLICY "House members can view event attendees" ON event_attendees FOR SELECT USING (
  event_id IN (
    SELECT id FROM events 
    WHERE house_id IN (SELECT house_id FROM house_members WHERE user_id = auth.uid())
  )
);

CREATE POLICY "House members can view chores" ON chores FOR SELECT USING (
  house_id IN (SELECT house_id FROM house_members WHERE user_id = auth.uid())
);

CREATE POLICY "House members can view leaderboard" ON leaderboard_entries FOR SELECT USING (
  house_id IN (SELECT house_id FROM house_members WHERE user_id = auth.uid())
);

CREATE POLICY "House members can view house rules" ON house_rules FOR SELECT USING (
  house_id IN (SELECT house_id FROM house_members WHERE user_id = auth.uid())
);

CREATE POLICY "House members can view chat messages" ON chat_messages FOR SELECT USING (
  house_id IN (SELECT house_id FROM house_members WHERE user_id = auth.uid())
);
