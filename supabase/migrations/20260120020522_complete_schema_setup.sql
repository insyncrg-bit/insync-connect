-- ============================================================================
-- Complete Database Schema Setup for In-Sync Connect Platform
-- Migration: 20260120020522_complete_schema_setup.sql
-- ============================================================================
-- This migration sets up all tables, RLS policies, indexes, and storage buckets
-- required by the frontend application.

-- ============================================================================
-- 1. CORE TABLES
-- ============================================================================

-- Founder Applications Table
CREATE TABLE IF NOT EXISTS public.founder_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  founder_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  website TEXT,
  vertical TEXT NOT NULL,
  stage TEXT NOT NULL,
  location TEXT NOT NULL,
  funding_goal TEXT NOT NULL,
  business_model TEXT NOT NULL,
  traction TEXT NOT NULL,
  current_ask TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  logo_url TEXT,
  pitchdeck_url TEXT,
  calendly_link TEXT,
  application_sections JSONB DEFAULT '{}'::jsonb,
  team_members JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Investor Applications Table
CREATE TABLE IF NOT EXISTS public.investor_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Admin & Verification
  firm_name TEXT NOT NULL,
  website TEXT,
  hq_location TEXT,
  geographies_covered JSONB DEFAULT '[]'::jsonb,
  contacts JSONB DEFAULT '[]'::jsonb,
  public_profile BOOLEAN DEFAULT true,
  company_password_hash TEXT,
  
  -- Fund Overview
  firm_description TEXT,
  aum TEXT,
  fund_vintage TEXT,
  fund_type TEXT,
  ownership_target TEXT,
  lead_follow TEXT,
  check_sizes JSONB DEFAULT '[]'::jsonb,
  stage_focus JSONB DEFAULT '[]'::jsonb,
  sector_tags JSONB DEFAULT '[]'::jsonb,
  portfolio_count TEXT,
  top_investments TEXT,
  geographic_focus TEXT,
  geographic_focus_detail TEXT,
  
  -- Investment Thesis
  thesis_statement TEXT,
  sub_themes JSONB DEFAULT '[]'::jsonb,
  sub_themes_other TEXT,
  non_negotiables JSONB DEFAULT '{}'::jsonb,
  hard_nos JSONB DEFAULT '[]'::jsonb,
  fast_signals JSONB DEFAULT '[]'::jsonb,
  
  -- What You Look For
  pain_severity TEXT,
  buyer_persona_required BOOLEAN DEFAULT false,
  buyer_persona_who TEXT,
  customer_types JSONB DEFAULT '[]'::jsonb,
  regulated_industries TEXT,
  b2b_b2c TEXT,
  b2b_b2c_why TEXT,
  revenue_models JSONB DEFAULT '[]'::jsonb,
  minimum_traction JSONB DEFAULT '[]'::jsonb,
  ranked_metrics JSONB DEFAULT '[]'::jsonb,
  
  -- Deal Mechanics
  decision_process TEXT,
  time_to_first_response TEXT,
  time_to_decision TEXT,
  gives_no_with_feedback BOOLEAN,
  feedback_when TEXT,
  follow_on_reserves TEXT,
  follow_on_when TEXT,
  board_involvement TEXT,
  calendly_link TEXT,
  
  -- Value-Add
  operating_support JSONB DEFAULT '[]'::jsonb,
  customer_verticals TEXT,
  partner_categories TEXT,
  talent_networks JSONB DEFAULT '[]'::jsonb,
  support_style TEXT,
  
  -- Portfolio & Conflicts
  portfolio_list TEXT,
  conflicts_policy TEXT,
  invests_in_competitors BOOLEAN DEFAULT false,
  signs_ndas BOOLEAN DEFAULT false,
  nda_conditions TEXT,
  
  -- Status
  status TEXT DEFAULT 'active'
);

-- Analyst Profiles Table
CREATE TABLE IF NOT EXISTS public.analyst_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  firm_id UUID REFERENCES public.investor_applications(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  firm_name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT,
  vertical TEXT,
  one_liner TEXT,
  profile_picture_url TEXT,
  linkedin_url TEXT,
  profile_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Connection Requests Table
CREATE TABLE IF NOT EXISTS public.connection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requester_type TEXT NOT NULL CHECK (requester_type IN ('founder', 'investor')),
  target_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('founder', 'investor')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  sync_note TEXT CHECK (char_length(sync_note) <= 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_connection_request UNIQUE (requester_user_id, target_user_id),
  CONSTRAINT no_self_connection CHECK (requester_user_id != target_user_id)
);

-- Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT no_self_message CHECK (sender_user_id != receiver_user_id)
);

-- Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL,
  location TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_attendees INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. TRIGGER FUNCTION FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- 2.5. HELPER FUNCTIONS FOR RLS POLICIES (Prevent Circular Dependencies)
-- ============================================================================

-- Function to check if user is an active investor (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_active_investor(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.investor_applications
    WHERE user_id = user_uuid
    AND status = 'active'
  );
END;
$$;

-- Function to check if user is an approved founder (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_approved_founder(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.founder_applications
    WHERE user_id = user_uuid
    AND status = 'approved'
  );
END;
$$;

-- ============================================================================
-- 3. TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS update_founder_applications_updated_at ON public.founder_applications;
CREATE TRIGGER update_founder_applications_updated_at
  BEFORE UPDATE ON public.founder_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_investor_applications_updated_at ON public.investor_applications;
CREATE TRIGGER update_investor_applications_updated_at
  BEFORE UPDATE ON public.investor_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_analyst_profiles_updated_at ON public.analyst_profiles;
CREATE TRIGGER update_analyst_profiles_updated_at
  BEFORE UPDATE ON public.analyst_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_connection_requests_updated_at ON public.connection_requests;
CREATE TRIGGER update_connection_requests_updated_at
  BEFORE UPDATE ON public.connection_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.founder_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyst_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. RLS POLICIES FOR FOUNDER_APPLICATIONS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own applications" ON public.founder_applications;
CREATE POLICY "Users can view their own applications"
  ON public.founder_applications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own applications" ON public.founder_applications;
CREATE POLICY "Users can insert their own applications"
  ON public.founder_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own applications" ON public.founder_applications;
CREATE POLICY "Users can update their own applications"
  ON public.founder_applications FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Investors can view approved founder applications" ON public.founder_applications;
CREATE POLICY "Investors can view approved founder applications"
  ON public.founder_applications FOR SELECT
  USING (
    status = 'approved' AND
    public.is_active_investor(auth.uid())
  );

-- ============================================================================
-- 6. RLS POLICIES FOR INVESTOR_APPLICATIONS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own investor application" ON public.investor_applications;
CREATE POLICY "Users can view their own investor application"
  ON public.investor_applications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own investor application" ON public.investor_applications;
CREATE POLICY "Users can create their own investor application"
  ON public.investor_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own investor application" ON public.investor_applications;
CREATE POLICY "Users can update their own investor application"
  ON public.investor_applications FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can check firm registration" ON public.investor_applications;
CREATE POLICY "Anyone can check firm registration"
  ON public.investor_applications FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Founders can view public investor profiles" ON public.investor_applications;
CREATE POLICY "Founders can view public investor profiles"
  ON public.investor_applications FOR SELECT
  USING (
    public_profile = true AND
    status = 'active' AND
    public.is_approved_founder(auth.uid())
  );

-- ============================================================================
-- 7. RLS POLICIES FOR ANALYST_PROFILES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own analyst profile" ON public.analyst_profiles;
CREATE POLICY "Users can view their own analyst profile"
  ON public.analyst_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own analyst profile" ON public.analyst_profiles;
CREATE POLICY "Users can create their own analyst profile"
  ON public.analyst_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own analyst profile" ON public.analyst_profiles;
CREATE POLICY "Users can update their own analyst profile"
  ON public.analyst_profiles FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Investors can view analysts from their firm" ON public.analyst_profiles;
CREATE POLICY "Investors can view analysts from their firm"
  ON public.analyst_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.investor_applications ia
      WHERE ia.id = analyst_profiles.firm_id
      AND ia.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Founders can view analyst profiles" ON public.analyst_profiles;
CREATE POLICY "Founders can view analyst profiles"
  ON public.analyst_profiles FOR SELECT
  USING (
    public.is_approved_founder(auth.uid())
  );

-- ============================================================================
-- 8. RLS POLICIES FOR CONNECTION_REQUESTS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own connection requests" ON public.connection_requests;
CREATE POLICY "Users can view their own connection requests"
  ON public.connection_requests FOR SELECT
  USING (auth.uid() = requester_user_id OR auth.uid() = target_user_id);

DROP POLICY IF EXISTS "Users can create connection requests" ON public.connection_requests;
CREATE POLICY "Users can create connection requests"
  ON public.connection_requests FOR INSERT
  WITH CHECK (auth.uid() = requester_user_id);

DROP POLICY IF EXISTS "Target users can update connection requests" ON public.connection_requests;
CREATE POLICY "Target users can update connection requests"
  ON public.connection_requests FOR UPDATE
  USING (auth.uid() = target_user_id);

DROP POLICY IF EXISTS "Requester can cancel pending requests" ON public.connection_requests;
CREATE POLICY "Requester can cancel pending requests"
  ON public.connection_requests FOR DELETE
  USING (auth.uid() = requester_user_id AND status = 'pending');

-- ============================================================================
-- 9. RLS POLICIES FOR MESSAGES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
CREATE POLICY "Users can view their own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_user_id OR auth.uid() = receiver_user_id);

DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_user_id);

DROP POLICY IF EXISTS "Users can update their received messages" ON public.messages;
CREATE POLICY "Users can update their received messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = receiver_user_id);

-- ============================================================================
-- 10. RLS POLICIES FOR EVENTS
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT
  USING (true);

-- ============================================================================
-- 11. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Founder Applications Indexes
CREATE INDEX IF NOT EXISTS idx_founder_applications_user_id 
  ON public.founder_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_founder_applications_status 
  ON public.founder_applications(status);
CREATE INDEX IF NOT EXISTS idx_founder_applications_stage 
  ON public.founder_applications(stage);
CREATE INDEX IF NOT EXISTS idx_founder_applications_vertical 
  ON public.founder_applications(vertical);
CREATE INDEX IF NOT EXISTS idx_founder_applications_location 
  ON public.founder_applications(location);

-- Investor Applications Indexes
CREATE INDEX IF NOT EXISTS idx_investor_applications_user_id 
  ON public.investor_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_investor_applications_status 
  ON public.investor_applications(status);
CREATE INDEX IF NOT EXISTS idx_investor_applications_public_profile 
  ON public.investor_applications(public_profile) 
  WHERE public_profile = true;
CREATE INDEX IF NOT EXISTS idx_investor_applications_stage_focus 
  ON public.investor_applications USING GIN(stage_focus);
CREATE INDEX IF NOT EXISTS idx_investor_applications_sector_tags 
  ON public.investor_applications USING GIN(sector_tags);

-- Analyst Profiles Indexes
CREATE INDEX IF NOT EXISTS idx_analyst_profiles_user_id 
  ON public.analyst_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_analyst_profiles_firm_id 
  ON public.analyst_profiles(firm_id);
CREATE INDEX IF NOT EXISTS idx_analyst_profiles_profile_completed 
  ON public.analyst_profiles(profile_completed);

-- Connection Requests Indexes
CREATE INDEX IF NOT EXISTS idx_connection_requests_requester 
  ON public.connection_requests(requester_user_id, requester_type);
CREATE INDEX IF NOT EXISTS idx_connection_requests_target 
  ON public.connection_requests(target_user_id, target_type);
CREATE INDEX IF NOT EXISTS idx_connection_requests_status 
  ON public.connection_requests(status);
CREATE INDEX IF NOT EXISTS idx_connection_requests_requester_target 
  ON public.connection_requests(requester_user_id, target_user_id);

-- Messages Indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender 
  ON public.messages(sender_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver 
  ON public.messages(receiver_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver 
  ON public.messages(sender_user_id, receiver_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at 
  ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read 
  ON public.messages(read) WHERE read = false;

-- Events Indexes
CREATE INDEX IF NOT EXISTS idx_events_date 
  ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_type 
  ON public.events(event_type);

-- ============================================================================
-- 12. STORAGE BUCKETS
-- ============================================================================

-- Startup Logos Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('startup-logos', 'startup-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Pitch Decks Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('pitch-decks', 'pitch-decks', true)
ON CONFLICT (id) DO NOTHING;

-- Analyst Avatars Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('analyst-avatars', 'analyst-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 13. STORAGE POLICIES
-- ============================================================================

-- Startup Logos Policies
DROP POLICY IF EXISTS "Users can upload their own logo" ON storage.objects;
CREATE POLICY "Users can upload their own logo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'startup-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can update their own logo" ON storage.objects;
CREATE POLICY "Users can update their own logo"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'startup-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can delete their own logo" ON storage.objects;
CREATE POLICY "Users can delete their own logo"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'startup-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Anyone can view startup logos" ON storage.objects;
CREATE POLICY "Anyone can view startup logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'startup-logos');

-- Pitch Decks Policies
DROP POLICY IF EXISTS "Users can upload their own pitch decks" ON storage.objects;
CREATE POLICY "Users can upload their own pitch decks"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pitch-decks' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can update their own pitch decks" ON storage.objects;
CREATE POLICY "Users can update their own pitch decks"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pitch-decks' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can delete their own pitch decks" ON storage.objects;
CREATE POLICY "Users can delete their own pitch decks"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pitch-decks' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Anyone can view pitch decks" ON storage.objects;
CREATE POLICY "Anyone can view pitch decks"
ON storage.objects FOR SELECT
USING (bucket_id = 'pitch-decks');

-- Analyst Avatars Policies
DROP POLICY IF EXISTS "Users can upload their own analyst avatar" ON storage.objects;
CREATE POLICY "Users can upload their own analyst avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'analyst-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can update their own analyst avatar" ON storage.objects;
CREATE POLICY "Users can update their own analyst avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'analyst-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can delete their own analyst avatar" ON storage.objects;
CREATE POLICY "Users can delete their own analyst avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'analyst-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Anyone can view analyst avatars" ON storage.objects;
CREATE POLICY "Anyone can view analyst avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'analyst-avatars');

-- ============================================================================
-- 14. ENABLE REALTIME
-- ============================================================================

-- Enable realtime for messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
END $$;

-- Enable realtime for connection_requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'connection_requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.connection_requests;
  END IF;
END $$;

-- ============================================================================
-- 15. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.founder_applications IS 'Stores founder/startup applications and memos';
COMMENT ON TABLE public.investor_applications IS 'Stores investor/VC firm profiles and investment thesis';
COMMENT ON TABLE public.analyst_profiles IS 'Stores individual analyst profiles within VC firms';
COMMENT ON TABLE public.connection_requests IS 'Tracks connection requests between founders and investors (interests, syncs, pending)';
COMMENT ON TABLE public.messages IS 'In-app messaging between matched founders and investors';
COMMENT ON TABLE public.events IS 'Networking and pitch events';

COMMENT ON COLUMN public.connection_requests.status IS 'pending: awaiting response, accepted: mutual connection (sync), declined: rejected';
COMMENT ON COLUMN public.founder_applications.status IS 'pending: under review, approved: visible to investors, rejected: not approved';
COMMENT ON COLUMN public.investor_applications.status IS 'active: visible to founders, inactive: hidden';
COMMENT ON COLUMN public.investor_applications.company_password_hash IS 'Hashed company-wide password that analysts use to authenticate their firm affiliation';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
