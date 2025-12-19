-- Create investor_applications table to store investor profile data
CREATE TABLE public.investor_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Admin & Verification
  firm_name TEXT NOT NULL,
  website TEXT,
  hq_location TEXT,
  geographies_covered JSONB DEFAULT '[]'::jsonb,
  contacts JSONB DEFAULT '[]'::jsonb,
  public_profile BOOLEAN DEFAULT true,
  
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

-- Enable Row Level Security
ALTER TABLE public.investor_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own investor application" 
ON public.investor_applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own investor application" 
ON public.investor_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own investor application" 
ON public.investor_applications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_investor_applications_updated_at
BEFORE UPDATE ON public.investor_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();