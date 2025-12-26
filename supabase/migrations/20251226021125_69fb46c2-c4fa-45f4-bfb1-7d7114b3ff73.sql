-- Add company-wide password column to investor_applications
-- This password will be used by analysts from the same firm to log in
ALTER TABLE public.investor_applications 
ADD COLUMN company_password_hash TEXT NULL;

-- Add a comment explaining the purpose
COMMENT ON COLUMN public.investor_applications.company_password_hash IS 'Hashed company-wide password that analysts use to authenticate their firm affiliation';