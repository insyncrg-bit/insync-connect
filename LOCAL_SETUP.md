# Local Supabase Development Setup

This guide will help you set up a fresh local Supabase development environment and migrate to production cleanly.

## Prerequisites

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   # or
   brew install supabase/tap/supabase
   ```

2. **Install Docker Desktop**
   - Required for local Supabase (Postgres, Auth, Storage, etc.)
   - Download from: https://www.docker.com/products/docker-desktop

## Step 1: Initialize Local Supabase

```bash
# Navigate to project root
cd "/Users/shouryayadav/Desktop/Projects/Insync/Insync MVP V1/insync-connect"

# Initialize Supabase (if not already initialized)
supabase init

# Start local Supabase (starts Docker containers)
supabase start
```

After running `supabase start`, you'll get:
- Local API URL: `http://localhost:54321`
- Local anon key
- Local service role key
- Local DB connection string

**Save these values!** They'll be in the output and also in `.env.local` (create it if needed).

## Step 2: Create Clean Migration

We'll consolidate all migrations into a single, clean migration:

```bash
# Create a new migration
supabase migration new initial_schema
```

This creates a file like: `supabase/migrations/YYYYMMDDHHMMSS_initial_schema.sql`

## Step 3: Consolidate Schema

Copy the schema from your existing migrations into the new migration file, ensuring:

1. **All tables with proper GRANTs**
2. **RLS enabled with proper policies**
3. **Helper functions with proper permissions**
4. **Storage buckets**
5. **Indexes**

## Step 4: Apply Migration Locally

```bash
# Apply migrations to local database
supabase db reset

# Or apply specific migration
supabase migration up
```

## Step 5: Test Locally

Update `.env.local` to use local Supabase:

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_PUBLISHABLE_KEY=<local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<local-service-role-key>
```

Then test:
```bash
# Test connection
node scripts/test-connection.mjs

# Test admin access
node scripts/test-admin-access.mjs

# Populate test data
node scripts/populate-test-data.mjs
```

## Step 6: Develop Locally

- Make schema changes via migrations: `supabase migration new <name>`
- Test everything locally
- Use Supabase Studio: `supabase studio` (opens at http://localhost:54323)

## Step 7: Migrate to Production

When ready to deploy:

1. **Create new Supabase project** (or use existing)
   - Go to https://supabase.com/dashboard
   - Create new project

2. **Link to production**
   ```bash
   supabase link --project-ref <your-project-ref>
   ```

3. **Push migrations**
   ```bash
   supabase db push
   ```

4. **Deploy functions**
   ```bash
   supabase functions deploy matchmaking
   ```

5. **Update production env vars**
   - Get production URL and keys from dashboard
   - Update `.env.local` or production environment

## Benefits of This Approach

✅ **Clean start** - No legacy issues  
✅ **Version control** - All migrations tracked  
✅ **Local testing** - Test before deploying  
✅ **Fast iteration** - No waiting for remote DB  
✅ **Proper workflow** - Industry standard approach  
✅ **Easy rollback** - Migrations can be reverted  

## Troubleshooting

### Docker issues
```bash
# Check Docker is running
docker ps

# Restart Supabase
supabase stop
supabase start
```

### Migration issues
```bash
# Reset local database
supabase db reset

# Check migration status
supabase migration list
```

### Port conflicts
If ports are in use, Supabase will tell you. Stop conflicting services or change ports in `supabase/config.toml`.

## Next Steps

1. Run `supabase init` and `supabase start`
2. Create consolidated migration
3. Test everything locally
4. When ready, link to production and push
