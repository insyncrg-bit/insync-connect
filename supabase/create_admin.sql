-- ============================================================================
-- Create Admin User
-- ============================================================================
-- This script creates an admin user in the admins table.
-- Prerequisites:
-- 1. The user must already exist in auth.users (signed up via Supabase Auth)
-- 2. Run the admin system migration first (20260129235500_add_admin_system.sql)
-- ============================================================================

-- ============================================================================
-- OPTION 1: Create admin for Rishika (the user provided)
-- ============================================================================

INSERT INTO public.admins (
  user_id,
  email,
  full_name,
  role,
  permissions,
  is_active,
  created_at,
  updated_at
) VALUES (
  '55896fa3-1028-481d-ba14-552b6cafe359',  -- user_id from auth.users
  'rgconstellation@gmail.com',
  'Rishika',
  'superadmin',  -- Options: 'superadmin', 'admin', 'moderator'
  '{
    "manage_users": true,
    "manage_founders": true,
    "manage_investors": true,
    "manage_analysts": true,
    "manage_connections": true,
    "manage_messages": true,
    "manage_events": true,
    "view_analytics": true,
    "manage_admins": true
  }'::jsonb,
  true,
  now(),
  now()
)
ON CONFLICT (user_id) DO UPDATE SET
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Verify the admin was created
SELECT
  id,
  user_id,
  email,
  full_name,
  role,
  is_active,
  created_at
FROM public.admins
WHERE email = 'rgconstellation@gmail.com';

-- ============================================================================
-- OPTION 2: Create admin for any existing auth user
-- ============================================================================
-- Use this template to create admin access for any user who has already
-- signed up via Supabase Auth. Replace the email with the target user's email.
-- ============================================================================

/*
-- First, find the user_id from auth.users
SELECT id, email, raw_user_meta_data->>'full_name' as full_name
FROM auth.users
WHERE email = 'user@example.com';  -- Replace with actual email

-- Then create the admin record
INSERT INTO public.admins (
  user_id,
  email,
  full_name,
  role,
  permissions,
  is_active
) VALUES (
  'USER_ID_FROM_ABOVE_QUERY',  -- Replace with actual user_id
  'user@example.com',          -- Replace with actual email
  'User Full Name',            -- Replace with actual name
  'admin',                     -- Options: 'superadmin', 'admin', 'moderator'
  '{
    "manage_users": true,
    "manage_founders": true,
    "manage_investors": true,
    "manage_analysts": true,
    "manage_connections": true,
    "manage_messages": true,
    "manage_events": true,
    "view_analytics": true,
    "manage_admins": false
  }'::jsonb,
  true
)
ON CONFLICT (user_id) DO UPDATE SET
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  is_active = EXCLUDED.is_active,
  updated_at = now();
*/

-- ============================================================================
-- OPTION 3: Promote existing user to admin by email
-- ============================================================================
-- This is the easiest method - just provide the email and it will
-- automatically look up the user_id and create the admin record.
-- ============================================================================

/*
-- Create admin by email (automatic user_id lookup)
DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'user@example.com';  -- Replace with actual email
  v_full_name TEXT;
BEGIN
  -- Get user_id and name from auth.users
  SELECT id, raw_user_meta_data->>'full_name'
  INTO v_user_id, v_full_name
  FROM auth.users
  WHERE email = v_email;

  -- Check if user exists
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found in auth.users', v_email;
  END IF;

  -- Create admin record
  INSERT INTO public.admins (
    user_id,
    email,
    full_name,
    role,
    permissions,
    is_active
  ) VALUES (
    v_user_id,
    v_email,
    v_full_name,
    'superadmin',  -- Change as needed
    '{
      "manage_users": true,
      "manage_founders": true,
      "manage_investors": true,
      "manage_analysts": true,
      "manage_connections": true,
      "manage_messages": true,
      "manage_events": true,
      "view_analytics": true,
      "manage_admins": true
    }'::jsonb,
    true
  )
  ON CONFLICT (user_id) DO UPDATE SET
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions,
    is_active = EXCLUDED.is_active,
    updated_at = now();

  RAISE NOTICE 'Admin created successfully for %', v_email;
END $$;
*/

-- ============================================================================
-- ADMIN ROLE TYPES
-- ============================================================================
-- superadmin: Full access to everything including managing other admins
-- admin: Can manage content (founders, investors, analysts, connections, events)
-- moderator: View-only access for monitoring and reports
-- ============================================================================

-- ============================================================================
-- USEFUL QUERIES
-- ============================================================================

-- List all admins
-- SELECT * FROM public.admins ORDER BY created_at DESC;

-- Check if a user is an admin
-- SELECT public.is_admin('USER_ID_HERE');

-- Check if a user is a superadmin
-- SELECT public.is_superadmin('USER_ID_HERE');

-- Check specific permission
-- SELECT public.has_admin_permission('USER_ID_HERE', 'manage_founders');

-- View recent admin actions
-- SELECT * FROM public.admin_audit_log ORDER BY created_at DESC LIMIT 50;

-- Deactivate an admin (don't delete, just disable)
-- UPDATE public.admins SET is_active = false WHERE email = 'admin@example.com';

-- Reactivate an admin
-- UPDATE public.admins SET is_active = true WHERE email = 'admin@example.com';

-- ============================================================================
