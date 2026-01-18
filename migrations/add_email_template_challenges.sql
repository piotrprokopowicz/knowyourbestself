-- Migration: Add email_template and challenges columns to feedback_requests
-- Run this in your Supabase SQL editor

ALTER TABLE feedback_requests
ADD COLUMN IF NOT EXISTS email_template TEXT,
ADD COLUMN IF NOT EXISTS challenges TEXT;
