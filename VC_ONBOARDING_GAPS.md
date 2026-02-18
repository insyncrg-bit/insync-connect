# VC Onboarding – What's Missing

A checklist of gaps and work needed to fully onboard VCs on the InSync platform.

---

## 1. Authentication & Role Flow

| Item | Status | Notes |
|------|--------|-------|
| VC admin: create firm → VC onboarding → VC admin dashboard | ✅ Done | Flow works |
| Analyst: join existing firm → next step | ⚠️ Broken | User goes to `/request-sent` ("wait for approval") but backend adds them immediately. No approval flow exists. |
| Session `firmId` persistence | ✅ Done | Set in SelectRole after create/join |
| Smart redirect (onboarding complete vs not) | ✅ Done | `onboarding.ts` checks firm and redirects |

**To fix:** Either send analysts straight to `/analyst` after join (no approval), or implement an approval flow (pending analysts, admin approve/reject) and keep RequestSent.

---

## 2. VC Onboarding Form

| Item | Status | Notes |
|------|--------|-------|
| Multi-step form (7 steps) | ✅ Done | All steps implemented |
| Local storage persistence | ✅ Done | `useVCOnboardingStorage` |
| Submit to backend (POST `/firms/:firmId/memo`) | ✅ Done | Saves memo, marks firm onboarding complete |
| Error handling on submit | ⚠️ Partial | No user-facing error toast on failure |
| Memo field mapping (VCOnboardingData → backend) | ✅ Done | Backend accepts full object |

**To fix:** Add error toast when memo POST fails. Optionally validate memo schema on backend.

---

## 3. VC Admin Dashboard – Data & APIs

| Item | Status | Notes |
|------|--------|-------|
| Firm memo/thesis fetch | ✅ Done | GET `/firms/:firmId/memo` used |
| Firm name in header | ✅ Done | From memo |
| Curated startups | ❌ Demo only | Hardcoded demo data, no real matching |
| Interests (incoming from founders) | ❌ Demo only | `demoInterests`, no backend |
| Syncs (active connections) | ❌ Demo only | `demoSyncs`, no backend |
| Pending (outgoing requests) | ❌ Demo only | `demoPending`, no backend |
| Messages | ❌ Demo only | `demoMessages`, no backend |
| Events | ❌ Demo only | Hardcoded events |

**To fix:** Implement backend for interests, syncs, pending, messages, events. Implement curated startup matching (thesis vs startup profiles).

---

## 4. Connection System (Interests / Syncs / Pending / Messages)

| Item | Status | Notes |
|------|--------|-------|
| Firestore collections | ❌ Missing | No `connection_requests`, `connections`, `messages` |
| Backend API for interests | ❌ Missing | Accept/decline not wired to backend |
| Backend API for sync requests | ❌ Missing | Request sync, cancel not wired |
| Backend API for messages | ❌ Missing | Send, list, mark read not wired |
| VC → founder sync request | ⚠️ UI only | `handleRequestSync` uses `setTimeout`, no API |

**To fix:** Add Firestore collections and rules for connections and messages. Add backend routes for: list/create/cancel sync requests, accept/decline interests, send/list messages, mark read.

---

## 5. Organisation (Team Management)

| Item | Status | Notes |
|------|--------|-------|
| Pending employees (analyst join requests) | ❌ Demo only | Hardcoded, no backend |
| Active employees (firm members) | ❌ Demo only | Hardcoded, no backend |
| Accept/reject analyst | ❌ Demo only | No API |
| Remove analyst | ❌ Demo only | No API |
| Invite analysts | ❌ Missing | Mentioned in copy, no flow |
| Fetch real firm members | ❌ Missing | No API to list `vc-users` by `firmId` |

**To fix:** Add API to list firm members (from `vc-users` by `firmId`). Add API to remove analyst from firm. If approval flow exists: add API to approve/reject join requests. Add invite flow (email invite → join link or magic link).

---

## 6. Settings

| Item | Status | Notes |
|------|--------|-------|
| VC Admin Settings page | ⚠️ Placeholder | "Settings Coming Soon" |

**To fix:** Add settings: edit firm profile, notification prefs, etc.

---

## 7. Thesis Modal & Profile

| Item | Status | Notes |
|------|--------|-------|
| Thesis modal (view firm thesis) | ✅ Done | Uses memo data |
| Edit thesis from dashboard | ❌ Missing | No edit flow |
| Profile settings tab | ⚠️ Placeholder | "Profile settings will be implemented soon" |

---

## 8. Curated Startups & Matching

| Item | Status | Notes |
|------|--------|-------|
| Startup data source | ❌ Missing | No collection for startup profiles |
| Matching logic | ❌ Missing | No thesis vs startup matching |
| Curated list for VC | ❌ Demo only | Single hardcoded "Demo Startup" |

**To fix:** Add startup profile collection (or reuse existing). Implement matching (stage, sector, check size, etc.). Add API to return curated startups for a firm.

---

## 9. Events (Unnecessary)

| Item | Status | Notes |
|------|--------|-------|
| Events display | ❌ Demo only | Hardcoded |
| Event registration | ⚠️ UI only | Button does nothing |
| Events backend | ❌ Missing | No events collection/API |

---

## 10. Backend & Security

| Item | Status | Notes |
|------|--------|-------|
| Memo GET authorization | ⚠️ Open | Any authenticated user can read any memo |
| Memo POST authorization | ✅ Done | Checks firm membership |
| Firestore rules for `vc-users`, `firms`, `memos` | ✅ Done | Read-only from client, writes via Cloud Functions |

---

## Priority Order

1. **Analyst join flow** – Fix RequestSent vs analyst dashboard routing (or add approval flow).
2. **Organisation** – Real firm members from backend; remove analyst; optional approve/reject.
3. **Connection system** – Interests, syncs, pending, messages with Firestore + APIs.
4. **Curated startups** – Startup profiles + matching + API.
5. **Error handling** – Toasts for onboarding and API failures.
6. **Settings** – Basic firm settings.
7. **Events** – If needed, add events backend and registration.

---

## What's Already Working

- VC onboarding (create firm, complete memo, save to backend).
- VC admin dashboard UI (tabs, modals, layout).
- Memo fetch and thesis display.
- Firm create/join APIs.
- Role-based routing and navbar.
