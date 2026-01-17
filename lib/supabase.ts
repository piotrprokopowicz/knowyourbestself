import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Database types
export interface FeedbackRequest {
  id: string
  user_id: string
  title: string
  context: string | null
  share_token: string
  created_at: string
  status: 'open' | 'analyzing' | 'completed'
}

export interface FeedbackResponse {
  id: string
  request_id: string
  respondent_name: string | null
  relationship: string | null
  strengths: string
  positive_moments: string | null
  qualities: string | null
  additional_comments: string | null
  created_at: string
}

export interface Report {
  id: string
  request_id: string
  content: string
  created_at: string
}

export interface Invitation {
  id: string
  request_id: string
  email: string
  sent_at: string
  responded: boolean
}
