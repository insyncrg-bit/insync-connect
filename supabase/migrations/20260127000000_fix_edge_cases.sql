-- ============================================================================
-- Fix Edge Cases Identified in Testing
-- Migration: 20260127000000_fix_edge_cases.sql
-- ============================================================================

-- Fix 1: Add unique constraint on user_id in founder_applications
-- Prevents duplicate applications from same user
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'founder_applications_user_id_unique'
  ) THEN
    ALTER TABLE public.founder_applications
    ADD CONSTRAINT founder_applications_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

-- Fix 2: Add unique constraint on user_id in investor_applications
-- Prevents duplicate applications from same user
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'investor_applications_user_id_unique'
  ) THEN
    ALTER TABLE public.investor_applications
    ADD CONSTRAINT investor_applications_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

-- Fix 3: Add length constraints to prevent DoS attacks
-- Limit text field lengths to reasonable values

-- Founder applications
ALTER TABLE public.founder_applications
  ALTER COLUMN founder_name TYPE VARCHAR(200),
  ALTER COLUMN company_name TYPE VARCHAR(200),
  ALTER COLUMN email TYPE VARCHAR(255),
  ALTER COLUMN location TYPE VARCHAR(200),
  ALTER COLUMN vertical TYPE VARCHAR(100),
  ALTER COLUMN stage TYPE VARCHAR(50),
  ALTER COLUMN funding_goal TYPE VARCHAR(50),
  ALTER COLUMN business_model TYPE VARCHAR(100),
  ALTER COLUMN traction TYPE VARCHAR(1000),
  ALTER COLUMN current_ask TYPE VARCHAR(500);

-- Investor applications
ALTER TABLE public.investor_applications
  ALTER COLUMN firm_name TYPE VARCHAR(200),
  ALTER COLUMN website TYPE VARCHAR(500),
  ALTER COLUMN hq_location TYPE VARCHAR(200),
  ALTER COLUMN geographic_focus TYPE VARCHAR(200),
  ALTER COLUMN geographic_focus_detail TYPE VARCHAR(500);

-- Connection requests
ALTER TABLE public.connection_requests
  ALTER COLUMN sync_note TYPE VARCHAR(500);

-- Messages
ALTER TABLE public.messages
  ALTER COLUMN content TYPE VARCHAR(10000);

-- Analyst profiles
ALTER TABLE public.analyst_profiles
  ALTER COLUMN name TYPE VARCHAR(200),
  ALTER COLUMN title TYPE VARCHAR(200),
  ALTER COLUMN firm_name TYPE VARCHAR(200),
  ALTER COLUMN email TYPE VARCHAR(255),
  ALTER COLUMN location TYPE VARCHAR(200),
  ALTER COLUMN vertical TYPE VARCHAR(100),
  ALTER COLUMN one_liner TYPE VARCHAR(500);

-- Fix 4: Ensure UTF-8 encoding for international characters
-- PostgreSQL uses UTF-8 by default, but ensure columns can handle it
-- This is already handled by TEXT/VARCHAR types, but add comment for clarity
COMMENT ON COLUMN public.founder_applications.founder_name IS 'Stored in UTF-8 encoding to support international characters';
COMMENT ON COLUMN public.founder_applications.company_name IS 'Stored in UTF-8 encoding to support international characters';
COMMENT ON COLUMN public.messages.content IS 'Stored in UTF-8 encoding to support international characters and emojis';

-- Fix 5: Add check constraint to ensure sync_note length
ALTER TABLE public.connection_requests
  DROP CONSTRAINT IF EXISTS connection_requests_sync_note_length;

ALTER TABLE public.connection_requests
  ADD CONSTRAINT connection_requests_sync_note_length 
  CHECK (sync_note IS NULL OR char_length(sync_note) <= 500);

-- Fix 6: Add check constraint to ensure message content length
ALTER TABLE public.messages
  DROP CONSTRAINT IF EXISTS messages_content_length;

ALTER TABLE public.messages
  ADD CONSTRAINT messages_content_length 
  CHECK (char_length(content) > 0 AND char_length(content) <= 10000);

-- Fix 7: Add index for better performance on common queries
CREATE INDEX IF NOT EXISTS idx_founder_applications_user_id_unique 
  ON public.founder_applications(user_id);

CREATE INDEX IF NOT EXISTS idx_investor_applications_user_id_unique 
  ON public.investor_applications(user_id);
