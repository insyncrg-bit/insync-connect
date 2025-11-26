-- Create founder applications table
CREATE TABLE public.founder_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create investors table
CREATE TABLE public.investors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  firm_name TEXT NOT NULL,
  check_size TEXT NOT NULL,
  investment_stage TEXT NOT NULL,
  sectors JSONB DEFAULT '[]',
  logo_url TEXT,
  bio TEXT,
  portfolio_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL,
  location TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_attendees INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mentors table
CREATE TABLE public.mentors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT,
  expertise JSONB DEFAULT '[]',
  bio TEXT,
  avatar_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create engagement tracking table
CREATE TABLE public.engagement_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.founder_applications(id) ON DELETE CASCADE,
  investor_id UUID REFERENCES public.investors(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.founder_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for founder_applications
CREATE POLICY "Users can view their own applications"
  ON public.founder_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
  ON public.founder_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON public.founder_applications FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for investors (public read)
CREATE POLICY "Anyone can view active investors"
  ON public.investors FOR SELECT
  USING (active = true);

-- RLS Policies for events (public read)
CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT
  USING (true);

-- RLS Policies for mentors (public read)
CREATE POLICY "Anyone can view available mentors"
  ON public.mentors FOR SELECT
  USING (available = true);

-- RLS Policies for engagement_tracking
CREATE POLICY "Users can view their own engagement"
  ON public.engagement_tracking FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.founder_applications
      WHERE id = engagement_tracking.application_id
      AND user_id = auth.uid()
    )
  );

-- Create update trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for founder_applications
CREATE TRIGGER update_founder_applications_updated_at
  BEFORE UPDATE ON public.founder_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample investors
INSERT INTO public.investors (name, firm_name, check_size, investment_stage, sectors, bio, portfolio_count) VALUES
('Sarah Chen', 'Boston Ventures', '$250K - $500K', 'seed', '["AI/ML", "SaaS"]', 'Former founder with 2 exits. Focus on B2B SaaS in Boston.', 12),
('Michael Rodriguez', 'Hub Capital', '$500K - $1M', 'series-a', '["FinTech", "HealthTech"]', 'Deep expertise in regulated industries. 15 years experience.', 8),
('Emily Park', 'Commonwealth Fund', '$100K - $250K', 'pre-seed', '["Climate", "Hardware"]', 'Passionate about climate solutions and deep tech.', 5);

-- Insert sample events
INSERT INTO public.events (title, description, event_type, location, event_date, max_attendees) VALUES
('Founder Pitch Night', 'Monthly pitch event for pre-seed startups', 'pitch', 'Cambridge Innovation Center', NOW() + INTERVAL '14 days', 20),
('VC Roundtable: Fundraising 101', 'Learn from experienced VCs about the fundraising process', 'workshop', 'Virtual', NOW() + INTERVAL '7 days', 50),
('Networking Mixer', 'Connect with founders and investors in the Boston ecosystem', 'networking', 'Seaport District', NOW() + INTERVAL '21 days', 100);

-- Insert sample mentors
INSERT INTO public.mentors (name, title, company, expertise, bio, available) VALUES
('Alex Thompson', 'Head of Product', 'TechCorp', '["Product Strategy", "Go-to-Market", "User Research"]', '10+ years building successful SaaS products', true),
('Jordan Lee', 'VP Engineering', 'StartupXYZ', '["Team Building", "Technical Architecture", "Scaling"]', 'Led engineering at 3 successful startups from seed to Series B', true),
('Sam Williams', 'Former Founder', 'Exit 2022', '["Fundraising", "Pitch Decks", "Investor Relations"]', 'Raised $5M+ across multiple rounds. Available for fundraising mentorship', true);