# User Testing Guide - Insync Connect

Complete end-to-end guide for testing all features of the Insync Connect application.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Testing as a Founder](#testing-as-a-founder)
4. [Testing as an Investor](#testing-as-an-investor)
5. [Testing as an Analyst](#testing-as-an-analyst)
6. [Testing Core Features](#testing-core-features)
7. [Testing Edge Cases](#testing-edge-cases)
8. [Reporting Issues](#reporting-issues)

---

## Prerequisites

Before starting, ensure you have:

- ✅ Node.js installed (v18 or higher)
- ✅ npm or yarn package manager
- ✅ Git (if cloning the repository)
- ✅ Modern web browser (Chrome, Firefox, Safari, or Edge)
- ✅ Supabase account (for production) OR Docker Desktop (for local testing)

---

## Initial Setup

### Step 1: Clone and Install

```bash
# Navigate to your project directory
cd "/Users/shouryayadav/Desktop/Projects/Insync/Insync MVP V1/insync-connect"

# Install dependencies
npm install
```

### Step 2: Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: For AI-powered matching
LOVABLE_API_KEY=your_lovable_api_key
```

**Get your Supabase credentials:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** > **API**
4. Copy the **Project URL** and **anon/public key**
5. Copy the **service_role** key (keep this secret!)

### Step 3: Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in terminal).

### Step 4: Populate Test Data (Optional)

To have test users ready for testing:

```bash
node scripts/populate-test-data.mjs
```

This creates:
- **3 Founder accounts** (`founder1@test.com`, `founder2@test.com`, `founder3@test.com`)
- **3 Investor accounts** (`investor1@test.com`, `investor2@test.com`, `investor3@test.com`)
- **Password for all:** `TestPassword123!`

---

## Testing as a Founder

### Test Flow 1: Complete Founder Application

**Goal:** Test the complete founder onboarding and application process.

#### Step 1: Access Founder Application Page

1. Navigate to `http://localhost:5173/founder-application`
2. Verify the page loads correctly
3. Check that all form sections are visible

#### Step 2: Fill Out Application Form

**Company Information:**
- ✅ Company Name: "Test Startup Inc"
- ✅ Website: "https://teststartup.com"
- ✅ Upload logo (optional)

**Team & Company Overview:**
- ✅ Founder Name: "John Doe"
- ✅ Company Pitch: Write a detailed pitch (at least 200 words)
- ✅ Team Members: Add 2-3 team members

**Value Proposition:**
- ✅ Problem Statement: Describe a clear problem
- ✅ Value Delivery Types: Select 2-3 options
- ✅ Solution Description: Detailed solution description

**Business Model:**
- ✅ Customer Type: Select B2B or B2C
- ✅ Business Structure: Describe your model
- ✅ Pricing Strategy: Select relevant options

**Go-to-Market:**
- ✅ Acquisition Strategy: Describe how you'll acquire customers
- ✅ GTM Timeline: Provide timeline

**Market Sizing:**
- ✅ Ideal Customer Profile: Describe your ICP
- ✅ Target Geography: Select regions
- ✅ TAM/SAM/SOM: Enter market size values

**Funding Details:**
- ✅ Vertical: Select your sector (e.g., AI/ML, FinTech)
- ✅ Stage: Select stage (Pre-seed, Seed, Series A)
- ✅ Location: Enter location
- ✅ Funding Goal: Enter amount
- ✅ Traction: Describe current traction
- ✅ Current Ask: What you're looking for

#### Step 3: Submit Application

1. Click "Submit Application"
2. Verify success message appears
3. Check that you're redirected to dashboard

**Expected Result:** Application submitted successfully, status shows "pending" or "approved"

---

### Test Flow 2: Founder Dashboard Features

**Goal:** Test all features available to founders.

#### Step 1: Access Dashboard

1. Sign in with founder account
2. Navigate to `/founder-dashboard`
3. Verify dashboard loads with your application data

#### Step 2: View Matched Investors

1. Check "Matched Investors" section
2. Verify investors are displayed with:
   - ✅ Firm name
   - ✅ Match score
   - ✅ Match label (Strong fit, Good fit, etc.)
   - ✅ Sector tags
   - ✅ Stage focus
   - ✅ Geographic focus

3. Click on an investor card
4. Verify investor modal opens with:
   - ✅ Full firm description
   - ✅ Investment thesis
   - ✅ Why this match (reasons)
   - ✅ Potential concerns
   - ✅ Fit breakdown (sector, stage, geography, etc.)

#### Step 3: Test Matchmaking

1. Click "Refresh Matches" or wait for auto-refresh
2. Verify matchmaking API is called
3. Check loading state appears
4. Verify new matches are displayed

**Expected Result:** Matches load successfully, sorted by match score

#### Step 4: Send Interest/Sync Request

1. Click on an investor card
2. Click "Send Interest" or "Request Sync"
3. Add a sync note (optional)
4. Submit request

**Expected Result:** 
- ✅ Request sent successfully
- ✅ Notification appears
- ✅ Request appears in "Pending" section

#### Step 5: View Interests Received

1. Click "Interests" badge/button
2. Verify modal opens showing incoming interests
3. Test accepting an interest:
   - Click "Accept"
   - Verify status changes to "Sync"
   - Check that investor appears in "Syncs" section

4. Test declining an interest:
   - Click "Decline"
   - Verify interest is removed

#### Step 6: View Active Syncs

1. Click "Syncs" badge/button
2. Verify modal shows all accepted connections
3. Check that each sync shows:
   - ✅ Investor firm name
   - ✅ Sync note
   - ✅ Date connected

#### Step 7: View Pending Requests

1. Click "Pending" badge/button
2. Verify outgoing requests are shown
3. Test canceling a request:
   - Click "Cancel"
   - Verify request is removed
   - Check that count updates

#### Step 8: Test Messaging

1. Click "Messages" badge/button
2. Verify message threads are displayed
3. Click on a thread
4. Send a test message:
   - Type message
   - Click send
   - Verify message appears in thread

5. Test marking messages as read:
   - Verify unread count decreases
   - Check that read status updates

#### Step 9: Edit Profile

1. Click "Profile Settings" or similar
2. Update company information
3. Save changes
4. Verify changes are reflected in dashboard

---

## Testing as an Investor

### Test Flow 1: Complete Investor Application

**Goal:** Test the complete investor onboarding process.

#### Step 1: Access Investor Application Page

1. Navigate to `http://localhost:5173/investor-application`
2. Verify the page loads correctly
3. Check that all form sections are visible

#### Step 2: Fill Out Application Form

**Firm Information:**
- ✅ Firm Name: "Test Capital Partners"
- ✅ Website: "https://testcapital.com"
- ✅ HQ Location: "San Francisco, CA"
- ✅ Firm Description: Detailed description

**Fund Overview:**
- ✅ AUM: Enter amount
- ✅ Fund Vintage: Enter year
- ✅ Fund Type: Select type
- ✅ Ownership Target: Enter percentage range
- ✅ Lead/Follow: Select preference
- ✅ Check Sizes: Enter ranges
- ✅ Portfolio Count: Enter number
- ✅ Top Investments: List companies

**Investment Thesis:**
- ✅ Thesis Statement: Write detailed thesis
- ✅ Sub Themes: Select relevant themes
- ✅ Sector Tags: Select sectors (AI/ML, FinTech, etc.)
- ✅ Stage Focus: Select stages (Pre-seed, Seed, etc.)
- ✅ Geographic Focus: Select regions

**What You Look For:**
- ✅ Customer Types: Select B2B/B2C preference
- ✅ Revenue Models: Select preferred models
- ✅ Minimum Traction: Select requirements
- ✅ Pain Severity: Select preference

**Deal Mechanics:**
- ✅ Time to First Response: Enter timeframe
- ✅ Time to Decision: Enter timeframe
- ✅ Gives Feedback: Yes/No
- ✅ Calendly Link: Enter link (optional)

**Value-Add:**
- ✅ Operating Support: Select types
- ✅ Customer Verticals: Enter details
- ✅ Partner Categories: Enter details
- ✅ Talent Networks: Select options

**Hard Nos (Exclusions):**
- ✅ Sectors: Select excluded sectors
- ✅ Geographies: Select excluded regions
- ✅ Business Models: Select excluded models

#### Step 3: Submit Application

1. Click "Submit Application"
2. Verify success message
3. Check redirect to dashboard

**Expected Result:** Application submitted, status shows "active"

---

### Test Flow 2: Investor Dashboard Features

**Goal:** Test all features available to investors.

#### Step 1: Access Dashboard

1. Sign in with investor account
2. Navigate to `/analyst-dashboard` (investor dashboard)
3. Verify dashboard loads

#### Step 2: View Matched Founders

1. Check "Matched Startups" section
2. Verify founders are displayed with:
   - ✅ Company name
   - ✅ Match score
   - ✅ Stage
   - ✅ Vertical
   - ✅ Location

3. Click on a founder card
4. Verify founder modal opens with:
   - ✅ Company pitch
   - ✅ Problem statement
   - ✅ Traction details
   - ✅ Market sizing
   - ✅ Team information

#### Step 3: Test Matchmaking (Investor → Founders)

1. Click "Refresh Matches"
2. Verify API call succeeds
3. Check matches are sorted by score

**Expected Result:** Matches load successfully

#### Step 4: Send Interest to Founder

1. Click on a founder card
2. Click "Send Interest" or "Request Sync"
3. Add sync note
4. Submit

**Expected Result:** Request sent, appears in pending

#### Step 5: View Interests Received

1. Click "Interests" badge
2. Review incoming interests from founders
3. Test accepting/declining

#### Step 6: View Active Syncs

1. Click "Syncs" badge
2. Verify all accepted connections
3. Check sync details

#### Step 7: Test Messaging

1. Click "Messages"
2. View threads with founders
3. Send test messages
4. Verify real-time updates (if implemented)

#### Step 8: Edit Investment Thesis

1. Click "Edit Thesis" or similar
2. Update thesis statement
3. Save changes
4. Verify updates reflected in matches

---

## Testing as an Analyst

### Test Flow: Analyst Profile Creation

**Goal:** Test analyst profile creation and management.

#### Step 1: Access Analyst Auth

1. Navigate to `/analyst-auth`
2. Enter firm email and company password
3. Verify authentication

#### Step 2: Create Analyst Profile

1. Fill out analyst profile form:
   - ✅ Name
   - ✅ Title
   - ✅ Firm Name
   - ✅ Email
   - ✅ Location
   - ✅ Vertical Focus
   - ✅ One-liner
   - ✅ LinkedIn URL
   - ✅ Upload profile picture

2. Submit profile
3. Verify profile is created

#### Step 3: Access Analyst Dashboard

1. Navigate to `/analyst-dashboard`
2. Verify dashboard loads with:
   - ✅ Matched startups
   - ✅ Connection stats
   - ✅ Messages
   - ✅ Profile completion status

#### Step 4: Test Analyst Features

1. View matched startups (same as investor)
2. Send interests
3. Manage connections
4. Send messages

---

## Testing Core Features

### Feature 1: Matchmaking Algorithm

**Test Cases:**

1. **Sector Matching:**
   - Create founder with AI/ML vertical
   - Verify AI/ML investors appear in top matches
   - Check match scores are higher for sector-aligned investors

2. **Stage Matching:**
   - Create founder at Seed stage
   - Verify Seed-focused investors appear
   - Check that stage-aligned investors have higher scores

3. **Geographic Matching:**
   - Create founder in San Francisco
   - Verify Bay Area investors appear
   - Check geographic fit scores

4. **Score Distribution:**
   - Verify scores range from 0-100
   - Check that matches are sorted by score (descending)
   - Verify score breakdown shows all components

5. **Hard Filters:**
   - Create investor with sector exclusions
   - Verify excluded sectors don't appear in matches
   - Test geography exclusions
   - Test business model exclusions

### Feature 2: Connection Requests

**Test Cases:**

1. **Create Request:**
   - Send interest from founder to investor
   - Verify request created with "pending" status
   - Check that requester sees it in "Pending"

2. **Accept Request:**
   - As investor, accept founder's interest
   - Verify status changes to "accepted"
   - Check that both parties see it in "Syncs"

3. **Decline Request:**
   - Decline an interest
   - Verify request removed from both parties
   - Check that no sync is created

4. **Cancel Request:**
   - Cancel outgoing request
   - Verify request removed
   - Check that target user no longer sees it

5. **Duplicate Prevention:**
   - Try to send duplicate request
   - Verify error or prevention message
   - Check that only one request exists

### Feature 3: Messaging System

**Test Cases:**

1. **Send Message:**
   - Send message to connected user
   - Verify message appears in thread
   - Check timestamp is correct

2. **Read Status:**
   - Send message as User A
   - As User B, verify unread count increases
   - Open thread as User B
   - Verify message marked as read
   - Check unread count decreases

3. **Message Threading:**
   - Verify messages are grouped by conversation
   - Check that threads show last message
   - Verify threads sorted by last message time

4. **Real-time Updates (if implemented):**
   - Open two browsers (different users)
   - Send message from User A
   - Verify User B sees message without refresh

### Feature 4: Profile Management

**Test Cases:**

1. **Update Founder Profile:**
   - Edit company information
   - Update traction details
   - Save changes
   - Verify updates reflected everywhere

2. **Update Investor Profile:**
   - Edit investment thesis
   - Update sector tags
   - Save changes
   - Verify matches update accordingly

3. **Profile Validation:**
   - Try to submit incomplete profile
   - Verify validation errors
   - Check that required fields are marked

---

## Testing Edge Cases

### Edge Case 1: Empty States

**Test:**
- Create account with no matches
- Verify "No matches found" message appears
- Check that empty state is user-friendly

### Edge Case 2: Large Datasets

**Test:**
- Create 50+ founders and investors
- Test matchmaking performance
- Verify pagination works (if implemented)
- Check that UI remains responsive

### Edge Case 3: Network Errors

**Test:**
- Disconnect internet
- Try to send message
- Verify error handling
- Reconnect and verify retry works

### Edge Case 4: Concurrent Actions

**Test:**
- Open same account in two browsers
- Send interest from both
- Verify no duplicate requests
- Check that state syncs correctly

### Edge Case 5: Invalid Data

**Test:**
- Try to submit form with invalid email
- Try to submit with missing required fields
- Verify validation errors appear
- Check that invalid data is rejected

---

## Reporting Issues

When you find issues, document them with:

1. **Issue Title:** Brief description
2. **Steps to Reproduce:** Detailed steps
3. **Expected Behavior:** What should happen
4. **Actual Behavior:** What actually happened
5. **Screenshots:** If applicable
6. **Browser/OS:** Your environment
7. **Console Errors:** Any errors in browser console

### Issue Template

```markdown
## Issue: [Title]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected:**
- Expected behavior

**Actual:**
- Actual behavior

**Environment:**
- Browser: Chrome 120
- OS: macOS 14.0
- URL: http://localhost:5173/founder-dashboard

**Screenshots:**
[Attach if applicable]

**Console Errors:**
[Paste any console errors]
```

---

## Quick Test Checklist

Use this checklist for quick smoke testing:

### Founder Flow
- [ ] Can create founder account
- [ ] Can complete application form
- [ ] Can submit application
- [ ] Can view matched investors
- [ ] Can send interest to investor
- [ ] Can accept incoming interests
- [ ] Can send messages
- [ ] Can view profile

### Investor Flow
- [ ] Can create investor account
- [ ] Can complete application form
- [ ] Can submit application
- [ ] Can view matched founders
- [ ] Can send interest to founder
- [ ] Can accept incoming interests
- [ ] Can send messages
- [ ] Can edit thesis

### Core Features
- [ ] Matchmaking works (founder → investors)
- [ ] Matchmaking works (investor → founders)
- [ ] Match scores are reasonable (0-100)
- [ ] Matches are sorted by score
- [ ] Connection requests work
- [ ] Messaging works
- [ ] Profile updates work

---

## Performance Testing

### Test Matchmaking Performance

1. **First Load:**
   - Note time to first match
   - Should be < 2 seconds

2. **Subsequent Loads:**
   - Refresh matches multiple times
   - Should be < 500ms

3. **Large Dataset:**
   - Test with 100+ founders/investors
   - Verify performance remains acceptable

### Test Database Performance

1. **Query Speed:**
   - Check dashboard load time
   - Should be < 1 second

2. **Update Speed:**
   - Update profile
   - Should save in < 500ms

---

## Security Testing

### Test Authentication

1. **Login:**
   - Test with correct credentials
   - Test with incorrect credentials
   - Verify error messages

2. **Session Management:**
   - Login and close browser
   - Reopen and verify still logged in
   - Test logout functionality

3. **Authorization:**
   - Try to access other user's data
   - Verify RLS policies prevent access
   - Check that unauthorized actions fail

---

## Accessibility Testing

### Basic Checks

1. **Keyboard Navigation:**
   - Tab through all interactive elements
   - Verify focus indicators visible
   - Check that all features accessible via keyboard

2. **Screen Reader:**
   - Test with screen reader (VoiceOver, NVDA)
   - Verify all content is announced
   - Check that form labels are associated

3. **Color Contrast:**
   - Verify text is readable
   - Check that color isn't only way to convey information

---

## Mobile Testing

### Responsive Design

1. **Mobile Viewport:**
   - Test on mobile device or browser dev tools
   - Verify layout adapts correctly
   - Check that all features work on mobile

2. **Touch Interactions:**
   - Test tap/click interactions
   - Verify buttons are appropriately sized
   - Check that modals work on mobile

---

## Conclusion

This guide covers all major features and test scenarios. For additional testing:

- Run automated tests: `node scripts/audit-test.mjs`
- Check browser console for errors
- Monitor network requests in DevTools
- Test with different user roles simultaneously

Happy testing! 🚀
