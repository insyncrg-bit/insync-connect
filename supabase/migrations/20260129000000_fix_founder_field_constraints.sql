-- ============================================================================
-- Fix Founder Application Field Constraints
-- Migration: 20260129000000_fix_founder_field_constraints.sql
-- Purpose: Align database constraints with application form requirements
-- ============================================================================

-- Fix 1: Increase business_model length to accommodate 30-100 word descriptions
-- The form requires 30-100 words which is approximately 150-600 characters
-- Setting to 2000 characters to provide comfortable buffer
ALTER TABLE public.founder_applications
  ALTER COLUMN business_model TYPE VARCHAR(2000);

-- Fix 2: Increase current_ask length to accommodate full GTM acquisition strategy
-- The form uses a textarea for customer acquisition strategy description
-- Setting to 2000 characters to match business_model
ALTER TABLE public.founder_applications
  ALTER COLUMN current_ask TYPE VARCHAR(2000);

-- Fix 3: Increase funding_goal to allow more detailed funding information
-- Currently hardcoded to "TBD" but should allow detailed funding goals
ALTER TABLE public.founder_applications
  ALTER COLUMN funding_goal TYPE VARCHAR(200);

-- Fix 4: Add check constraints to ensure data quality
-- Ensure business_model is not just whitespace
ALTER TABLE public.founder_applications
  DROP CONSTRAINT IF EXISTS business_model_not_empty;

ALTER TABLE public.founder_applications
  ADD CONSTRAINT business_model_not_empty
  CHECK (char_length(trim(business_model)) >= 10);

-- Ensure founder_name is not just whitespace
ALTER TABLE public.founder_applications
  DROP CONSTRAINT IF EXISTS founder_name_not_empty;

ALTER TABLE public.founder_applications
  ADD CONSTRAINT founder_name_not_empty
  CHECK (char_length(trim(founder_name)) >= 2);

-- Ensure company_name is not just whitespace
ALTER TABLE public.founder_applications
  DROP CONSTRAINT IF EXISTS company_name_not_empty;

ALTER TABLE public.founder_applications
  ADD CONSTRAINT company_name_not_empty
  CHECK (char_length(trim(company_name)) >= 2);

-- Ensure location is not just whitespace
ALTER TABLE public.founder_applications
  DROP CONSTRAINT IF EXISTS location_not_empty;

ALTER TABLE public.founder_applications
  ADD CONSTRAINT location_not_empty
  CHECK (char_length(trim(location)) >= 2);

-- Add comments for documentation
COMMENT ON COLUMN public.founder_applications.business_model IS 'Company overview and problem statement (30-100 words, max 2000 chars)';
COMMENT ON COLUMN public.founder_applications.traction IS 'Revenue metrics and traction data (max 1000 chars)';
COMMENT ON COLUMN public.founder_applications.current_ask IS 'Customer acquisition strategy and current needs (max 2000 chars)';
COMMENT ON COLUMN public.founder_applications.funding_goal IS 'Funding goals and targets (max 200 chars)';
