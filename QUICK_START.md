# Quick Start Guide - Insync Connect

Get up and running quickly with Insync Connect.

---

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

Create `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:5173`

### 4. Populate Test Data (Optional)

```bash
node scripts/populate-test-data.mjs
```

**Test Accounts Created:**
- Founders: `founder1@test.com`, `founder2@test.com`, `founder3@test.com`
- Investors: `investor1@test.com`, `investor2@test.com`, `investor3@test.com`
- Password: `TestPassword123!`

---

## 📚 Documentation

### For Testing the App
👉 **[USER_TESTING_GUIDE.md](./USER_TESTING_GUIDE.md)**
- Complete testing workflows
- Feature testing checklists
- Edge case scenarios
- Issue reporting templates

### For Deployment
👉 **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**
- Backend deployment (Supabase)
- Frontend deployment (Vercel/Netlify)
- Environment setup
- Troubleshooting guide

### For Development
👉 **[LOCAL_SETUP.md](./LOCAL_SETUP.md)**
- Local Supabase setup
- Database migrations
- Development workflow

---

## 🧪 Quick Test Checklist

- [ ] Can sign up as founder
- [ ] Can sign up as investor
- [ ] Can submit founder application
- [ ] Can submit investor application
- [ ] Can view matched investors/founders
- [ ] Can send connection requests
- [ ] Can send messages
- [ ] Matchmaking works

---

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
node scripts/populate-test-data.mjs    # Create test users
node scripts/audit-test.mjs            # Run full audit

# Supabase (if using CLI)
supabase start          # Start local Supabase
supabase db push        # Push migrations
supabase functions deploy matchmaking  # Deploy function
```

---

## 🆘 Need Help?

1. **Testing Issues:** See [USER_TESTING_GUIDE.md](./USER_TESTING_GUIDE.md)
2. **Deployment Issues:** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. **Local Setup:** See [LOCAL_SETUP.md](./LOCAL_SETUP.md)

---

## 📊 Project Structure

```
insync-connect/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom hooks
│   └── integrations/       # Supabase client
├── supabase/
│   ├── functions/          # Edge Functions
│   │   └── matchmaking/    # Matchmaking function
│   └── migrations/         # Database migrations
├── scripts/                # Utility scripts
│   ├── populate-test-data.mjs
│   └── audit-test.mjs
└── .env.local              # Environment variables (create this)
```

---

## ✅ Next Steps

1. **Test Locally:** Follow [USER_TESTING_GUIDE.md](./USER_TESTING_GUIDE.md)
2. **Deploy:** Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. **Develop:** Make changes and test
4. **Deploy Updates:** Push changes and redeploy

Happy coding! 🎉
