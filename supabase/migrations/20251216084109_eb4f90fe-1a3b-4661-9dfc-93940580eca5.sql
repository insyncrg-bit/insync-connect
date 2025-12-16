-- Add JSONB column to store the detailed investor-memo application data
ALTER TABLE public.founder_applications 
ADD COLUMN IF NOT EXISTS application_sections JSONB DEFAULT '{}'::jsonb;

-- Add team members column
ALTER TABLE public.founder_applications 
ADD COLUMN IF NOT EXISTS team_members JSONB DEFAULT '[]'::jsonb;