-- Add logo_url column to founder_applications
ALTER TABLE public.founder_applications 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Create storage bucket for startup logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('startup-logos', 'startup-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own logos
CREATE POLICY "Users can upload their own logo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'startup-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own logos
CREATE POLICY "Users can update their own logo"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'startup-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own logos
CREATE POLICY "Users can delete their own logo"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'startup-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow anyone to view logos (public bucket)
CREATE POLICY "Anyone can view startup logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'startup-logos');