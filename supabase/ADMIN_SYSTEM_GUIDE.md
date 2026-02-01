# Admin System Guide

## Overview

The admin system provides comprehensive role-based access control with three levels of access:

- **Superadmin**: Full access including managing other admins
- **Admin**: Can manage content (founders, investors, analysts, connections, events)
- **Moderator**: View-only access for monitoring and reports

## Installation

### 1. Run the Migration

First, apply the admin system migration:

```bash
# Using Supabase CLI
supabase migration up

# Or via SQL Editor in Supabase Dashboard
# Run the file: supabase/migrations/20260129235500_add_admin_system.sql
```

### 2. Create Your First Admin

Run the admin creation script:

```bash
# Via Supabase SQL Editor
# Run the file: supabase/create_admin.sql
```

This will create a superadmin account for Rishika (rgconstellation@gmail.com).

## Creating Additional Admins

### Method 1: Using Email (Easiest)

```sql
DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'admin@example.com';  -- Change this
  v_full_name TEXT;
BEGIN
  SELECT id, raw_user_meta_data->>'full_name'
  INTO v_user_id, v_full_name
  FROM auth.users
  WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', v_email;
  END IF;

  INSERT INTO public.admins (
    user_id, email, full_name, role, is_active
  ) VALUES (
    v_user_id, v_email, v_full_name, 'admin', true
  );
END $$;
```

### Method 2: Direct Insert

```sql
INSERT INTO public.admins (user_id, email, full_name, role)
VALUES (
  'user-uuid-here',
  'admin@example.com',
  'Admin Name',
  'admin'  -- or 'superadmin' or 'moderator'
);
```

## Admin Functions

### Check Admin Status

```sql
-- Check if user is any type of admin
SELECT public.is_admin('user-id-here');

-- Check if user is specifically a superadmin
SELECT public.is_superadmin('user-id-here');

-- Check if user has specific permission
SELECT public.has_admin_permission('user-id-here', 'manage_founders');
```

### Log Admin Actions

```sql
-- Log an action to the audit trail
SELECT public.log_admin_action(
  'update_application',           -- action
  'founder_applications',         -- resource_type
  'application-uuid-here',        -- resource_id
  '{"status": "approved"}'::jsonb -- details
);
```

## Permissions System

Each admin has granular permissions stored in JSONB:

```json
{
  "manage_users": true,
  "manage_founders": true,
  "manage_investors": true,
  "manage_analysts": true,
  "manage_connections": true,
  "manage_messages": true,
  "manage_events": true,
  "view_analytics": true,
  "manage_admins": true  // Only superadmins should have this
}
```

### Update Permissions

```sql
UPDATE public.admins
SET permissions = jsonb_set(
  permissions,
  '{manage_events}',
  'false'
)
WHERE email = 'admin@example.com';
```

## Admin Capabilities

### Founders Management

Admins with `manage_founders` permission can:
- View all founder applications (regardless of status)
- Update any founder application
- Delete founder applications (superadmin only)

### Investors Management

Admins with `manage_investors` permission can:
- View all investor applications
- Update any investor application
- Delete investor applications (superadmin only)

### Analysts Management

Admins with `manage_analysts` permission can:
- View all analyst profiles
- Update any analyst profile
- Delete analyst profiles (superadmin only)

### Connections Management

Admins with `manage_connections` permission can:
- View all connection requests
- Update connection statuses
- Delete connections (superadmin only)

### Messages Management

Admins with `manage_messages` permission can:
- View all messages (for moderation)
- Delete inappropriate messages (superadmin only)

### Events Management

Admins with `manage_events` permission can:
- Create new events
- Update existing events
- Delete events (superadmin only)

## Audit Log

All admin actions can be logged to `admin_audit_log` table:

```sql
-- View recent admin actions
SELECT
  aal.*,
  a.email as admin_email,
  a.full_name as admin_name
FROM public.admin_audit_log aal
JOIN auth.users u ON u.id = aal.admin_user_id
JOIN public.admins a ON a.user_id = aal.admin_user_id
ORDER BY aal.created_at DESC
LIMIT 50;

-- Filter by action type
SELECT * FROM public.admin_audit_log
WHERE action = 'approve_application'
ORDER BY created_at DESC;

-- Filter by resource
SELECT * FROM public.admin_audit_log
WHERE resource_type = 'founder_applications'
ORDER BY created_at DESC;
```

## Useful Queries

### List All Admins

```sql
SELECT
  a.id,
  a.email,
  a.full_name,
  a.role,
  a.is_active,
  a.last_login_at,
  a.created_at,
  (SELECT email FROM auth.users WHERE id = a.created_by) as created_by_email
FROM public.admins a
ORDER BY a.created_at DESC;
```

### Deactivate Admin (Don't Delete)

```sql
UPDATE public.admins
SET is_active = false
WHERE email = 'admin@example.com';
```

### Reactivate Admin

```sql
UPDATE public.admins
SET is_active = true
WHERE email = 'admin@example.com';
```

### Change Admin Role

```sql
UPDATE public.admins
SET role = 'superadmin'  -- or 'admin' or 'moderator'
WHERE email = 'admin@example.com';
```

### Update Last Login

```sql
UPDATE public.admins
SET last_login_at = now()
WHERE user_id = auth.uid();
```

## Frontend Integration

### Check if Logged-In User is Admin

```typescript
import { supabase } from './supabaseClient';

async function checkIfAdmin() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase
    .rpc('is_admin', { user_uuid: user.id });

  return data === true;
}
```

### Check Specific Permission

```typescript
async function hasPermission(permission: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase
    .rpc('has_admin_permission', {
      user_uuid: user.id,
      permission_key: permission
    });

  return data === true;
}
```

### Log Admin Action

```typescript
async function logAction(
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: object
) {
  await supabase.rpc('log_admin_action', {
    p_action: action,
    p_resource_type: resourceType,
    p_resource_id: resourceId || null,
    p_details: details || {}
  });
}

// Usage
await logAction(
  'approve_application',
  'founder_applications',
  applicationId,
  { previous_status: 'pending', new_status: 'approved' }
);
```

## Security Best Practices

1. **Limit Superadmins**: Only create superadmin accounts for absolutely trusted personnel
2. **Use Least Privilege**: Grant only the permissions needed for each admin's role
3. **Monitor Audit Logs**: Regularly review the audit log for suspicious activity
4. **Deactivate, Don't Delete**: When removing admin access, set `is_active = false` instead of deleting
5. **Rotate Credentials**: Require admins to use strong passwords and 2FA via Supabase Auth
6. **Log Important Actions**: Always log sensitive operations to the audit trail

## Troubleshooting

### Admin Can't Access Resources

1. Check if admin is active:
   ```sql
   SELECT is_active FROM public.admins WHERE email = 'admin@example.com';
   ```

2. Check permissions:
   ```sql
   SELECT permissions FROM public.admins WHERE email = 'admin@example.com';
   ```

3. Verify RLS policies are working:
   ```sql
   SELECT public.is_admin('user-id-here');
   ```

### Functions Not Working

Ensure functions are executable by authenticated users:
```sql
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_superadmin TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_admin_permission TO authenticated;
```

## Migration Rollback

If you need to remove the admin system:

```sql
-- Drop policies
DROP POLICY IF EXISTS "Admins can view all founder applications" ON public.founder_applications;
DROP POLICY IF EXISTS "Admins can update founder applications" ON public.founder_applications;
-- ... (drop all admin-related policies)

-- Drop functions
DROP FUNCTION IF EXISTS public.is_admin;
DROP FUNCTION IF EXISTS public.is_superadmin;
DROP FUNCTION IF EXISTS public.has_admin_permission;
DROP FUNCTION IF EXISTS public.log_admin_action;

-- Drop tables
DROP TABLE IF EXISTS public.admin_audit_log;
DROP TABLE IF EXISTS public.admins;
```

## Support

For questions or issues with the admin system:
1. Check the audit logs for error details
2. Verify the user exists in `auth.users`
3. Ensure migrations ran successfully
4. Review RLS policies in Supabase Dashboard
