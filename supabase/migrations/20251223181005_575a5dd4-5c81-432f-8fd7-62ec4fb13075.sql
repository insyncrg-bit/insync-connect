-- Add pitchdeck_url column to founder_applications
ALTER TABLE public.founder_applications
ADD COLUMN pitchdeck_url text;

-- Create pitch-decks storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('pitch-decks', 'pitch-decks', true);

-- Allow authenticated users to upload their own pitch decks
CREATE POLICY "Users can upload their own pitch decks"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pitch-decks' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow anyone to view pitch decks (public bucket)
CREATE POLICY "Anyone can view pitch decks"
ON storage.objects FOR SELECT
USING (bucket_id = 'pitch-decks');

-- Allow users to update their own pitch decks
CREATE POLICY "Users can update their own pitch decks"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'pitch-decks' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own pitch decks
CREATE POLICY "Users can delete their own pitch decks"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'pitch-decks' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);