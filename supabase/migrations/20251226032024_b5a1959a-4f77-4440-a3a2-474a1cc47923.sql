-- Add profile_picture_url column to analyst_profiles
ALTER TABLE public.analyst_profiles 
ADD COLUMN profile_picture_url TEXT;

-- Create storage bucket for analyst profile pictures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('analyst-avatars', 'analyst-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own analyst avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'analyst-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own avatar
CREATE POLICY "Users can update their own analyst avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'analyst-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own avatar
CREATE POLICY "Users can delete their own analyst avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'analyst-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to analyst avatars
CREATE POLICY "Anyone can view analyst avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'analyst-avatars');

-- Allow investors to view analyst profiles (for when founders see who requested sync)
CREATE POLICY "Founders can view analyst profiles for connection requests"
ON public.analyst_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM connection_requests cr
    WHERE cr.requester_user_id = analyst_profiles.user_id
    AND cr.target_user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM connection_requests cr
    WHERE cr.target_user_id = analyst_profiles.user_id
    AND cr.requester_user_id = auth.uid()
  )
);