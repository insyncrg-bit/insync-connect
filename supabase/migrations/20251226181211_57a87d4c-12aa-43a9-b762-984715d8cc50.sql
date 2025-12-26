-- Drop the existing policy that might be restrictive
DROP POLICY IF EXISTS "Anyone can check firm registration" ON public.investor_applications;

-- Create a PERMISSIVE policy for public firm lookup
CREATE POLICY "Anyone can check firm registration"
ON public.investor_applications
FOR SELECT
TO anon, authenticated
USING (true);