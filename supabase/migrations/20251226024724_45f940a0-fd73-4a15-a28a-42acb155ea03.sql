-- Create analyst_profiles table to store analyst-specific data
CREATE TABLE public.analyst_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  firm_id UUID REFERENCES public.investor_applications(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  firm_name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT,
  vertical TEXT,
  one_liner TEXT,
  profile_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.analyst_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own analyst profile" 
ON public.analyst_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analyst profile" 
ON public.analyst_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyst profile" 
ON public.analyst_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow investors to view analysts from their firm
CREATE POLICY "Investors can view analysts from their firm"
ON public.analyst_profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.investor_applications ia
    WHERE ia.id = analyst_profiles.firm_id
    AND ia.user_id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_analyst_profiles_updated_at
BEFORE UPDATE ON public.analyst_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();