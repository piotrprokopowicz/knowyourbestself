-- BRF (Best Reflected Self) Database Schema
-- Run this in your Supabase SQL editor

-- Feedback Requests table
CREATE TABLE feedback_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  context TEXT,
  share_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'analyzing', 'completed'))
);

-- Feedback Responses table
CREATE TABLE feedback_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES feedback_requests(id) ON DELETE CASCADE NOT NULL,
  respondent_name TEXT,
  relationship TEXT,
  strengths TEXT NOT NULL,
  positive_moments TEXT,
  qualities TEXT,
  additional_comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES feedback_requests(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Invitations tracking table
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES feedback_requests(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded BOOLEAN DEFAULT FALSE
);

-- Indexes for better query performance
CREATE INDEX idx_feedback_requests_user_id ON feedback_requests(user_id);
CREATE INDEX idx_feedback_requests_share_token ON feedback_requests(share_token);
CREATE INDEX idx_feedback_responses_request_id ON feedback_responses(request_id);
CREATE INDEX idx_reports_request_id ON reports(request_id);
CREATE INDEX idx_invitations_request_id ON invitations(request_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE feedback_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Feedback Requests: Users can only see their own requests
CREATE POLICY "Users can view own feedback requests"
  ON feedback_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback requests"
  ON feedback_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feedback requests"
  ON feedback_requests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own feedback requests"
  ON feedback_requests FOR DELETE
  USING (auth.uid() = user_id);

-- Feedback Responses: Allow public insert (for anonymous feedback), users can view responses to their requests
CREATE POLICY "Anyone can submit feedback responses"
  ON feedback_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view responses to their requests"
  ON feedback_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM feedback_requests
      WHERE feedback_requests.id = feedback_responses.request_id
      AND feedback_requests.user_id = auth.uid()
    )
  );

-- Reports: Users can only see reports for their own requests
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM feedback_requests
      WHERE feedback_requests.id = reports.request_id
      AND feedback_requests.user_id = auth.uid()
    )
  );

-- Invitations: Users can view invitations for their own requests
CREATE POLICY "Users can view own invitations"
  ON invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM feedback_requests
      WHERE feedback_requests.id = invitations.request_id
      AND feedback_requests.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert invitations for own requests"
  ON invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM feedback_requests
      WHERE feedback_requests.id = invitations.request_id
      AND feedback_requests.user_id = auth.uid()
    )
  );
