# Deployment Guide - Insync Connect

Complete end-to-end guide for deploying the backend (Supabase) and connecting the frontend.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Backend Deployment (Supabase)](#backend-deployment-supabase)
4. [Frontend Deployment](#frontend-deployment)
5. [Connecting Frontend to Backend](#connecting-frontend-to-backend)
6. [Environment Variables Setup](#environment-variables-setup)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This application consists of:

- **Frontend:** React + Vite application (deployed to Vercel/Netlify/etc.)
- **Backend:** Supabase (Database + Edge Functions)
  - PostgreSQL database
  - Authentication
  - Storage buckets
  - Edge Functions (matchmaking)

**Deployment Flow:**
1. Deploy Supabase backend (database + functions)
2. Configure environment variables
3. Deploy frontend
4. Connect frontend to backend
5. Verify everything works

---

## Prerequisites

Before starting, ensure you have:

- ✅ Supabase account ([sign up here](https://supabase.com))
- ✅ Node.js installed (v18+)
- ✅ Git installed
- ✅ Supabase CLI installed: `npm install -g supabase`
- ✅ Docker Desktop (for local testing, optional)
- ✅ Frontend hosting account (Vercel, Netlify, etc.)

---

## Backend Deployment (Supabase)

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in project details:
   - **Name:** Insync Connect (or your preferred name)
   - **Database Password:** Choose a strong password (save it!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is fine for MVP

4. Click **"Create new project"**
5. Wait 2-3 minutes for project to initialize

### Step 2: Get Project Credentials

Once project is ready:

1. Go to **Settings** > **API**
2. Copy these values (you'll need them later):
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbGc...` (long string)
   - **service_role key:** `eyJhbGc...` (keep secret!)

3. Go to **Settings** > **Database**
4. Copy **Connection string** (if needed)

### Step 3: Link Local Project to Supabase

```bash
# Navigate to project directory
cd "/Users/shouryayadav/Desktop/Projects/Insync/Insync MVP V1/insync-connect"

# Login to Supabase CLI
supabase login

# Link to your project (you'll need project ref from dashboard URL)
supabase link --project-ref your-project-ref
```

**Find your project ref:**
- Dashboard URL: `https://supabase.com/dashboard/project/xxxxx`
- The `xxxxx` part is your project ref

### Step 4: Deploy Database Schema

```bash
# Push all migrations to production
supabase db push

# Verify migrations applied
supabase migration list
```

**Expected Output:**
```
Applied migrations:
  - 20260120020522_complete_schema_setup.sql
```

### Step 5: Verify Database Tables

1. Go to Supabase Dashboard > **Table Editor**
2. Verify these tables exist:
   - ✅ `founder_applications`
   - ✅ `investor_applications`
   - ✅ `analyst_profiles`
   - ✅ `connection_requests`
   - ✅ `messages`
   - ✅ `events`

3. Check that RLS (Row Level Security) is enabled:
   - Go to **Authentication** > **Policies**
   - Verify policies exist for each table

### Step 6: Set Up Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Create these buckets (if not auto-created):

**Bucket 1: startup-logos**
- Name: `startup-logos`
- Public: ✅ Yes

**Bucket 2: pitch-decks**
- Name: `pitch-decks`
- Public: ✅ Yes

**Bucket 3: analyst-avatars**
- Name: `analyst-avatars`
- Public: ✅ Yes

3. Verify storage policies are set (should be auto-created from migration)

### Step 7: Deploy Edge Functions

#### Deploy Matchmaking Function

```bash
# Deploy matchmaking function
supabase functions deploy matchmaking

# Verify deployment
supabase functions list
```

**Expected Output:**
```
Functions:
  - matchmaking (deployed)
```

#### Set Function Environment Variables

1. Go to **Edge Functions** in Supabase Dashboard
2. Click on **matchmaking** function
3. Go to **Settings** > **Environment Variables**
4. Add these variables:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
LOVABLE_API_KEY=your-lovable-api-key (optional)
```

**Get these values:**
- `SUPABASE_URL`: From Settings > API > Project URL
- `SUPABASE_SERVICE_ROLE_KEY`: From Settings > API > service_role key
- `LOVABLE_API_KEY`: Optional, for AI-powered matching

### Step 8: Test Edge Function Locally (Optional)

```bash
# Serve function locally
supabase functions serve matchmaking --env-file .env.local

# Test with curl
curl -X POST http://localhost:54321/functions/v1/matchmaking \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-id",
    "match_type": "founder_to_investors"
  }'
```

---

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Deploy

```bash
# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No (first time)
# - Project name? insync-connect
# - Directory? ./
# - Override settings? No
```

#### Step 3: Set Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add these variables:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

5. Click **Save**
6. Redeploy: Go to **Deployments** > **Redeploy**

#### Step 4: Get Deployment URL

After deployment, Vercel provides:
- **Production URL:** `https://insync-connect.vercel.app`
- **Preview URLs:** For each commit

---

### Option 2: Deploy to Netlify

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Deploy

```bash
# Login to Netlify
netlify login

# Initialize Netlify
netlify init

# Follow prompts:
# - Create & configure a new site? Yes
# - Team: Your team
# - Site name: insync-connect
# - Build command: npm run build
# - Directory to deploy: dist
```

#### Step 3: Set Environment Variables

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Site settings** > **Environment variables**
4. Add:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

5. Click **Save**
6. Redeploy: **Deploys** > **Trigger deploy** > **Deploy site**

---

### Option 3: Deploy to Other Platforms

#### Build for Production

```bash
# Build the app
npm run build

# Output will be in `dist/` directory
```

Then upload `dist/` folder to your hosting provider.

**Common Platforms:**
- **GitHub Pages:** Upload `dist/` to `gh-pages` branch
- **AWS S3 + CloudFront:** Upload `dist/` to S3 bucket
- **Firebase Hosting:** Use Firebase CLI
- **Cloudflare Pages:** Connect GitHub repo

---

## Connecting Frontend to Backend

### Step 1: Update Frontend Environment Variables

**For Local Development:**

Create/update `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**For Production (Vercel/Netlify):**

Set in hosting platform's environment variables (see above).

### Step 2: Verify Supabase Client Configuration

Check `src/integrations/supabase/client.ts`:

```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
```

These should match your environment variables.

### Step 3: Update CORS Settings (if needed)

If you encounter CORS errors:

1. Go to Supabase Dashboard > **Settings** > **API**
2. Under **CORS**, add your frontend URL:
   - `http://localhost:5173` (for local dev)
   - `https://your-domain.com` (for production)

### Step 4: Configure Authentication Redirect URLs

1. Go to Supabase Dashboard > **Authentication** > **URL Configuration**
2. Add **Site URL:** `https://your-domain.com`
3. Add **Redirect URLs:**
   - `https://your-domain.com/**`
   - `http://localhost:5173/**` (for local dev)

---

## Environment Variables Setup

### Complete Environment Variables Checklist

#### Frontend (`.env.local` or hosting platform):

```env
# Required
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...

# Optional (for scripts)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

#### Backend (Supabase Edge Functions):

Set in Supabase Dashboard > Edge Functions > Settings:

```env
# Required
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Optional (for AI matching)
LOVABLE_API_KEY=your-key-here
```

### Security Best Practices

1. **Never commit `.env.local`** to Git
2. **Use different keys** for development and production
3. **Rotate keys** if exposed
4. **Limit service_role key** usage (only for admin operations)
5. **Use anon key** for frontend (it's safe to expose)

---

## Post-Deployment Verification

### Step 1: Test Authentication

1. Visit your deployed frontend URL
2. Try to sign up:
   - Go to `/auth`
   - Create a test account
   - Verify email confirmation (check Supabase Dashboard > Authentication > Users)

3. Try to sign in:
   - Use test account credentials
   - Verify successful login
   - Check redirect to dashboard

### Step 2: Test Database Operations

1. **Create Founder Application:**
   - Sign in as founder
   - Go to `/founder-application`
   - Fill out and submit form
   - Verify data appears in Supabase Dashboard > Table Editor > `founder_applications`

2. **Create Investor Application:**
   - Sign in as investor
   - Go to `/investor-application`
   - Fill out and submit form
   - Verify data appears in `investor_applications` table

### Step 3: Test Matchmaking Function

1. **Via Frontend:**
   - Sign in as founder
   - Go to `/founder-dashboard`
   - Verify matches load
   - Check match scores and details

2. **Via API (Direct Test):**
   ```bash
   curl -X POST https://your-project-ref.supabase.co/functions/v1/matchmaking \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "founder-user-id",
       "match_type": "founder_to_investors"
     }'
   ```

3. **Check Function Logs:**
   - Go to Supabase Dashboard > Edge Functions > matchmaking
   - Click **Logs** tab
   - Verify no errors

### Step 4: Test Core Features

Run through these checks:

- [ ] Authentication works (sign up, sign in, sign out)
- [ ] Founder application submission works
- [ ] Investor application submission works
- [ ] Matchmaking returns results
- [ ] Connection requests work
- [ ] Messaging works
- [ ] Profile updates work
- [ ] File uploads work (logos, pitch decks)

### Step 5: Run Automated Tests

```bash
# Populate test data
node scripts/populate-test-data.mjs

# Run audit tests
node scripts/audit-test.mjs
```

Verify all tests pass.

---

## Troubleshooting

### Issue: CORS Errors

**Symptoms:**
```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy
```

**Solution:**
1. Add frontend URL to Supabase CORS settings
2. Check that `VITE_SUPABASE_URL` is correct
3. Verify no trailing slashes in URLs

### Issue: Authentication Not Working

**Symptoms:**
- Can't sign up or sign in
- Redirect URLs not working

**Solution:**
1. Check redirect URLs in Supabase Dashboard > Authentication > URL Configuration
2. Verify email confirmation settings
3. Check browser console for errors
4. Verify environment variables are set correctly

### Issue: Matchmaking Function Fails

**Symptoms:**
- No matches returned
- Function timeout
- 500 errors

**Solution:**
1. Check Edge Function logs in Supabase Dashboard
2. Verify environment variables are set in function settings
3. Check that `SUPABASE_SERVICE_ROLE_KEY` is correct
4. Verify database tables exist and have data
5. Test function locally first

### Issue: Database Queries Fail

**Symptoms:**
- "Row Level Security" errors
- "Permission denied" errors

**Solution:**
1. Check RLS policies in Supabase Dashboard
2. Verify user is authenticated
3. Check that policies allow the operation
4. Verify `SUPABASE_SERVICE_ROLE_KEY` is used only for admin operations

### Issue: Environment Variables Not Loading

**Symptoms:**
- "Missing VITE_SUPABASE_URL" error
- Variables undefined

**Solution:**
1. **Local:** Check `.env.local` exists and has correct format
2. **Production:** Verify variables set in hosting platform
3. **Vite:** Remember `VITE_` prefix is required
4. **Restart:** Restart dev server after changing `.env.local`
5. **Redeploy:** Redeploy after changing production env vars

### Issue: Build Fails

**Symptoms:**
- Build errors during deployment
- TypeScript errors

**Solution:**
1. Test build locally: `npm run build`
2. Fix TypeScript errors
3. Check for missing dependencies
4. Verify Node.js version matches hosting platform

### Issue: Slow Performance

**Symptoms:**
- Matchmaking takes > 2 seconds
- Dashboard loads slowly

**Solution:**
1. Check Edge Function logs for bottlenecks
2. Verify database indexes exist
3. Consider caching matchmaking results
4. Optimize database queries
5. Check Supabase project region matches user location

---

## Production Checklist

Before going live, verify:

- [ ] All environment variables set correctly
- [ ] Database migrations applied
- [ ] Edge Functions deployed
- [ ] Storage buckets created
- [ ] RLS policies configured
- [ ] CORS settings configured
- [ ] Redirect URLs configured
- [ ] Frontend deployed and accessible
- [ ] Authentication works
- [ ] Matchmaking works
- [ ] All core features tested
- [ ] Error handling works
- [ ] Monitoring/logging set up (optional)

---

## Monitoring & Maintenance

### Set Up Monitoring (Optional)

1. **Supabase Dashboard:**
   - Monitor database usage
   - Check Edge Function invocations
   - Review error logs

2. **Frontend Monitoring:**
   - Use Sentry for error tracking
   - Monitor performance with Vercel Analytics
   - Track user behavior (optional)

### Regular Maintenance

1. **Weekly:**
   - Check error logs
   - Monitor database size
   - Review Edge Function performance

2. **Monthly:**
   - Review and optimize database queries
   - Check for unused data
   - Update dependencies

3. **As Needed:**
   - Deploy schema changes via migrations
   - Update Edge Functions
   - Scale resources if needed

---

## Quick Reference

### Common Commands

```bash
# Supabase CLI
supabase login
supabase link --project-ref xxxxx
supabase db push
supabase functions deploy matchmaking
supabase functions list
supabase migration list

# Frontend
npm run dev          # Local development
npm run build        # Production build
npm run preview      # Preview production build

# Testing
node scripts/populate-test-data.mjs
node scripts/audit-test.mjs
```

### Important URLs

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Netlify Dashboard:** https://app.netlify.com

### Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com

---

## Next Steps

After successful deployment:

1. ✅ Share your app URL with test users
2. ✅ Monitor for errors and performance
3. ✅ Gather user feedback
4. ✅ Iterate and improve
5. ✅ Scale as needed

**Congratulations! Your app is now live! 🚀**
