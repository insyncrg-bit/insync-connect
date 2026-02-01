-- ============================================================================
-- Add Admin/Superuser System
-- Migration: 20260129235500_add_admin_system.sql
-- ============================================================================
-- This migration adds a comprehensive admin system with:
-- 1. Admins table for dedicated admin user management
-- 2. Helper functions for RLS policies
-- 3. Updated RLS policies to allow admin access
-- 4. Admin audit log for tracking admin actions
-- ============================================================================

-- ============================================================================
-- 1. CREATE ADMINS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'moderator')),
  permissions JSONB DEFAULT '{
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
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.admins(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON public.admins(user_id);
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON public.admins(role);
CREATE INDEX IF NOT EXISTS idx_admins_is_active ON public.admins(is_active) WHERE is_active = true;

-- ============================================================================
-- 2. CREATE ADMIN AUDIT LOG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for audit log queries
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_user_id ON public.admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON public.admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_resource ON public.admin_audit_log(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);

-- ============================================================================
-- 3. TRIGGERS FOR ADMINS TABLE
-- ============================================================================

DROP TRIGGER IF EXISTS update_admins_updated_at ON public.admins;
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON public.admins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 4. HELPER FUNCTIONS FOR ADMIN CHECKS
-- ============================================================================

-- Check if user is an admin (any role)
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = user_uuid
    AND is_active = true
  );
END;
$$;

-- Check if user is a superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = user_uuid
    AND role = 'superadmin'
    AND is_active = true
  );
END;
$$;

-- Check if user has specific permission
CREATE OR REPLACE FUNCTION public.has_admin_permission(
  user_uuid UUID,
  permission_key TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = user_uuid
    AND is_active = true
    AND (
      role = 'superadmin' OR
      (permissions->permission_key)::boolean = true
    )
  );
END;
$$;

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.admin_audit_log (
    admin_user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_details
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;

-- ============================================================================
-- 5. RLS POLICIES FOR ADMINS TABLE
-- ============================================================================

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Admins can view all admin records
DROP POLICY IF EXISTS "Admins can view all admin records" ON public.admins;
CREATE POLICY "Admins can view all admin records"
  ON public.admins FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Superadmins can insert new admins
DROP POLICY IF EXISTS "Superadmins can create admins" ON public.admins;
CREATE POLICY "Superadmins can create admins"
  ON public.admins FOR INSERT
  WITH CHECK (public.is_superadmin(auth.uid()));

-- Superadmins can update any admin, regular admins can update themselves
DROP POLICY IF EXISTS "Admins can update admin records" ON public.admins;
CREATE POLICY "Admins can update admin records"
  ON public.admins FOR UPDATE
  USING (
    public.is_superadmin(auth.uid()) OR
    (public.is_admin(auth.uid()) AND auth.uid() = user_id)
  );

-- Only superadmins can delete admins
DROP POLICY IF EXISTS "Superadmins can delete admins" ON public.admins;
CREATE POLICY "Superadmins can delete admins"
  ON public.admins FOR DELETE
  USING (public.is_superadmin(auth.uid()));

-- ============================================================================
-- 6. RLS POLICIES FOR ADMIN AUDIT LOG
-- ============================================================================

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Admins can view all audit logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_log;
CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_log FOR SELECT
  USING (public.is_admin(auth.uid()));

-- System can insert audit logs (via function)
DROP POLICY IF EXISTS "System can insert audit logs" ON public.admin_audit_log;
CREATE POLICY "System can insert audit logs"
  ON public.admin_audit_log FOR INSERT
  WITH CHECK (auth.uid() = admin_user_id);

-- ============================================================================
-- 7. UPDATE EXISTING RLS POLICIES TO INCLUDE ADMIN ACCESS
-- ============================================================================

-- FOUNDER APPLICATIONS: Admins can view and manage all applications
DROP POLICY IF EXISTS "Admins can view all founder applications" ON public.founder_applications;
CREATE POLICY "Admins can view all founder applications"
  ON public.founder_applications FOR SELECT
  USING (public.has_admin_permission(auth.uid(), 'manage_founders'));

DROP POLICY IF EXISTS "Admins can update founder applications" ON public.founder_applications;
CREATE POLICY "Admins can update founder applications"
  ON public.founder_applications FOR UPDATE
  USING (public.has_admin_permission(auth.uid(), 'manage_founders'));

DROP POLICY IF EXISTS "Admins can delete founder applications" ON public.founder_applications;
CREATE POLICY "Admins can delete founder applications"
  ON public.founder_applications FOR DELETE
  USING (public.is_superadmin(auth.uid()));

-- INVESTOR APPLICATIONS: Admins can view and manage all applications
DROP POLICY IF EXISTS "Admins can view all investor applications" ON public.investor_applications;
CREATE POLICY "Admins can view all investor applications"
  ON public.investor_applications FOR SELECT
  USING (public.has_admin_permission(auth.uid(), 'manage_investors'));

DROP POLICY IF EXISTS "Admins can update investor applications" ON public.investor_applications;
CREATE POLICY "Admins can update investor applications"
  ON public.investor_applications FOR UPDATE
  USING (public.has_admin_permission(auth.uid(), 'manage_investors'));

DROP POLICY IF EXISTS "Admins can delete investor applications" ON public.investor_applications;
CREATE POLICY "Admins can delete investor applications"
  ON public.investor_applications FOR DELETE
  USING (public.is_superadmin(auth.uid()));

-- ANALYST PROFILES: Admins can view and manage all profiles
DROP POLICY IF EXISTS "Admins can view all analyst profiles" ON public.analyst_profiles;
CREATE POLICY "Admins can view all analyst profiles"
  ON public.analyst_profiles FOR SELECT
  USING (public.has_admin_permission(auth.uid(), 'manage_analysts'));

DROP POLICY IF EXISTS "Admins can update analyst profiles" ON public.analyst_profiles;
CREATE POLICY "Admins can update analyst profiles"
  ON public.analyst_profiles FOR UPDATE
  USING (public.has_admin_permission(auth.uid(), 'manage_analysts'));

DROP POLICY IF EXISTS "Admins can delete analyst profiles" ON public.analyst_profiles;
CREATE POLICY "Admins can delete analyst profiles"
  ON public.analyst_profiles FOR DELETE
  USING (public.is_superadmin(auth.uid()));

-- CONNECTION REQUESTS: Admins can view and manage all connections
DROP POLICY IF EXISTS "Admins can view all connection requests" ON public.connection_requests;
CREATE POLICY "Admins can view all connection requests"
  ON public.connection_requests FOR SELECT
  USING (public.has_admin_permission(auth.uid(), 'manage_connections'));

DROP POLICY IF EXISTS "Admins can update connection requests" ON public.connection_requests;
CREATE POLICY "Admins can update connection requests"
  ON public.connection_requests FOR UPDATE
  USING (public.has_admin_permission(auth.uid(), 'manage_connections'));

DROP POLICY IF EXISTS "Admins can delete connection requests" ON public.connection_requests;
CREATE POLICY "Admins can delete connection requests"
  ON public.connection_requests FOR DELETE
  USING (public.is_superadmin(auth.uid()));

-- MESSAGES: Admins can view all messages (moderation)
DROP POLICY IF EXISTS "Admins can view all messages" ON public.messages;
CREATE POLICY "Admins can view all messages"
  ON public.messages FOR SELECT
  USING (public.has_admin_permission(auth.uid(), 'manage_messages'));

DROP POLICY IF EXISTS "Admins can delete messages" ON public.messages;
CREATE POLICY "Admins can delete messages"
  ON public.messages FOR DELETE
  USING (public.is_superadmin(auth.uid()));

-- EVENTS: Admins can manage all events
DROP POLICY IF EXISTS "Admins can create events" ON public.events;
CREATE POLICY "Admins can create events"
  ON public.events FOR INSERT
  WITH CHECK (public.has_admin_permission(auth.uid(), 'manage_events'));

DROP POLICY IF EXISTS "Admins can update events" ON public.events;
CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE
  USING (public.has_admin_permission(auth.uid(), 'manage_events'));

DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  USING (public.has_admin_permission(auth.uid(), 'manage_events'));

-- ============================================================================
-- 8. GRANT PERMISSIONS TO AUTHENTICATED USERS
-- ============================================================================

GRANT SELECT ON public.admins TO authenticated;
GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_superadmin TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_admin_permission TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_admin_action TO authenticated;

-- ============================================================================
-- 9. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.admins IS 'Admin and superuser accounts with role-based permissions';
COMMENT ON TABLE public.admin_audit_log IS 'Audit trail of all admin actions for security and compliance';
COMMENT ON COLUMN public.admins.role IS 'Admin role: superadmin (full access), admin (manage content), moderator (view only)';
COMMENT ON COLUMN public.admins.permissions IS 'Granular permissions for admin actions';
COMMENT ON FUNCTION public.is_admin IS 'Check if user is an active admin (any role)';
COMMENT ON FUNCTION public.is_superadmin IS 'Check if user is an active superadmin';
COMMENT ON FUNCTION public.has_admin_permission IS 'Check if admin has specific permission';
COMMENT ON FUNCTION public.log_admin_action IS 'Log admin action to audit trail';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
