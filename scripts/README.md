# Scripts

Utility scripts for testing and populating the database.

## Setup

### 1. Get Service Role Key

To run these scripts, you need the Supabase Service Role Key:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** > **API**
4. Copy the **service_role** key (not the anon key)
5. Add it to `.env.local`:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

⚠️ **Important**: Never commit the service role key to git. It bypasses RLS and has full database access.

## Scripts

### `populate-test-data.mjs`

Populates the database with test users, founders, and investors.

**Usage:**
```bash
node scripts/populate-test-data.mjs
```

**What it creates:**
- 3 test founder users with applications
- 3 test investor users with applications
- All users have password: `TestPassword123!`

**Test Users Created:**

**Founders:**
- `founder1@test.com` - AI Health Solutions (Seed stage, AI/ML)
- `founder2@test.com` - ClimateTech Innovations (Pre-seed, Climate)
- `founder3@test.com` - FinTech Payments (Series A, FinTech)

**Investors:**
- `investor1@test.com` - AI Ventures Fund (AI/ML focus)
- `investor2@test.com` - Climate Capital Partners (Climate focus)
- `investor3@test.com` - FinTech Growth Fund (FinTech focus)

### `test-api.mjs`

Tests all API endpoints and database queries.

**Usage:**
```bash
node scripts/test-api.mjs
```

**What it tests:**
- Database queries (founders, investors)
- Matchmaking API (founder to investors)
- Matchmaking API (investor to founders)
- Error handling (invalid requests)

**Prerequisites:**
- Run `populate-test-data.mjs` first to create test data
- Matchmaking function must be deployed

## Running Scripts

```bash
# 1. Populate test data
node scripts/populate-test-data.mjs

# 2. Test API endpoints
node scripts/test-api.mjs
```

## Troubleshooting

**Error: Missing SUPABASE_SERVICE_ROLE_KEY**
- Add the service role key to `.env.local`
- Get it from Supabase Dashboard > Settings > API

**Error: Function not found**
- Deploy the matchmaking function: `supabase functions deploy matchmaking`

**Error: Permission denied**
- Make sure you're using the service role key, not the anon key
- Check that RLS policies allow the operations
