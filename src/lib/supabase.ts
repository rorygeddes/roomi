import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
}

export interface House {
  id: string
  name: string
  created_at: string
  commissioner_id?: string
  beer_value: number
  pizza_value: number
  currency: string
}

export interface HouseMember {
  id: string
  house_id: string
  user_id: string
  role: 'member' | 'commissioner'
  joined_at: string
}

export interface Transaction {
  id: string
  house_id: string
  batch_id: string
  payer_id: string
  amount: number
  description: string
  category: string
  date: string
  receipt_url?: string
  created_at: string
}

export interface TransactionSplit {
  id: string
  transaction_id: string
  user_id: string
  amount: number
  settled: boolean
}

export interface Event {
  id: string
  house_id: string
  title: string
  description?: string
  date: string
  created_by: string
  cost?: number
  created_at: string
}

export interface EventAttendee {
  id: string
  event_id: string
  user_id: string
  status: 'pending' | 'accepted' | 'declined'
}

export interface Chore {
  id: string
  house_id: string
  title: string
  description?: string
  assigned_to: string
  due_date: string
  completed: boolean
  created_by: string
  created_at: string
}

export interface LeaderboardEntry {
  id: string
  house_id: string
  user_id: string
  points: number
  cycle_start: string
  cycle_end: string
  created_at: string
}

export interface HouseRule {
  id: string
  house_id: string
  title: string
  description: string
  created_by: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  house_id: string
  user_id: string
  content: string
  message_type: 'text' | 'expense' | 'event' | 'chore' | 'system'
  created_at: string
}
