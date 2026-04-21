# In-Sync Connect (Frontend)

Developer-facing documentation for the In-Sync frontend (Vite + React + TypeScript). This app powers the startup, VC, analyst, and admin experiences for the In-Sync platform.

## Tech stack

- **React 18** + **TypeScript**
- **Vite 7** (bundler & dev server)
- **React Router v6** (routing)
- **Firebase** (auth)
- **TanStack React Query v5** (server state)
- **Tailwind CSS** + **Radix UI** (shadcn-style components)
- **Lucide React** (icons)

## Getting started

- **Prereqs**: Node.js 18+ and npm (or pnpm)

```bash
cd insync-connect
npm install
```

### Environment variables

Create a `.env` file and set:

- `VITE_FIREBASE_AUTH_DOMAIN` – Firebase Auth domain
- `VITE_FIREBASE_PROJECT_ID` – Firebase project ID
- `VITE_FIREBASE_API` – Backend API base URL (Cloud Functions HTTPS endpoint)
- `VITE_FIREBASE_API_KEY` – Firebase Web API key

Optional demo accounts:

- `VITE_DEMO_VC_EMAIL`
- `VITE_DEMO_STARTUP_EMAIL`
- `VITE_DEMO_ANALYST_EMAIL`
- `VITE_DEMO_PASSWORD`

### Dev loop

```bash
# Start dev server
npm run dev

# Type-check & lint
npm run lint

# Production build + preview
npm run build
npm run preview
```

The app usually runs at `http://localhost:5173`.

## Project structure (high level)

- `src/main.tsx` – Vite entry
- `src/App.tsx` – Router + `QueryClientProvider` + top-level layouts
- `src/landing/` – Marketing/landing pages
- `src/components/` – Reusable UI components (Navbars, dashboards, modals, memo editor, etc.)
- `src/pages/` – Route-level screens (startup, vc, analyst, admin, auth)
- `src/lib/` – API helpers (`api.ts`), Firebase config, startup memo helpers, session utils
- `src/hooks/` – Custom hooks (e.g. `use-toast`, onboarding storage)

Role-based routing is enforced via wrappers such as `RequireAuth`, `RequireUserType`, and `AppLayoutWithNavbar`.

## Key flows

- **Auth**: Email/password + Firebase; guarded routes via `RequireAuth` and user-type gates.
- **Startup**:
  - Onboarding wizard → persists to backend and local storage.
  - `StartupMemoPage` uses React Query for loading profile + memo, lazy-loads heavy editors.
- **VC**:
  - Onboarding to collect thesis.
  - `VCDashboard` fetches firm + memo via React Query and code-splits heavy tabs like `EditMemoTab`.

## Conventions

- **TypeScript** everywhere (`.tsx` / `.ts`).
- **React Query** for async server data; avoid ad-hoc `fetch` in components where possible.
- **Tailwind** for layout and styling; keep complex variants in utility components when needed.
- Prefer function components + hooks; no class components.
- Put shared logic in `src/lib` or `src/hooks` rather than inside pages.

## License

Commercial use is permitted only with explicit approval from the licensors. See [COMMERCIAL_LICENSE.md](./COMMERCIAL_LICENSE.md) for terms.
