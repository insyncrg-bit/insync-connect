# In-Sync Connect (Frontend)

Web application for **In-Sync**, a high-fidelity startup–investor matching platform. Connects Boston founders with the right investors through data-driven matching and outcome tracking.

## Tech stack

- **React 18** + **TypeScript**
- **Vite 7** (build & dev server)
- **React Router** (routing)
- **Firebase** (auth)
- **TanStack React Query** (server state)
- **Tailwind CSS** + **Radix UI** (shadcn/ui-style components)
- **Lucide React** (icons)

## Prerequisites

- Node.js 18+
- npm or pnpm

## Setup

1. Clone the repository and enter the frontend directory:
   ```bash
   cd insync-connect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Copy `.env.example` to `.env` (or create `.env`) and set:
   - `VITE_FIREBASE_AUTH_DOMAIN` – Firebase Auth domain
   - `VITE_FIREBASE_PROJECT_ID` – Firebase project ID
   - `VITE_FIREBASE_API` – Backend API base URL (e.g. Cloud Functions URL)
   - `VITE_FIREBASE_API_KEY` – Firebase Web API key  
   Optional demo accounts: `VITE_DEMO_VC_EMAIL`, `VITE_DEMO_STARTUP_EMAIL`, `VITE_DEMO_ANALYST_EMAIL`, `VITE_DEMO_PASSWORD`.

4. Run the dev server:
   ```bash
   npm run dev
   ```

   The app is typically available at `http://localhost:5173`.

## Scripts

| Command           | Description                |
|-------------------|----------------------------|
| `npm run dev`     | Start Vite dev server      |
| `npm run build`   | Production build           |
| `npm run build:dev` | Development build        |
| `npm run preview` | Preview production build   |
| `npm run lint`    | Run ESLint                 |

## Main areas

- **Landing** – Public landing and marketing
- **Auth** – Sign up, login, verify email, forgot/reset password, role selection
- **Startup** – Onboarding, dashboard, memo editor, profile, settings
- **VC** – Onboarding, dashboard (thesis, curated startups, edit memo, connections)
- **Analyst** – Analyst dashboard and flows
- **Admin** – Superuser configuration and test pages

The app uses role-based routes and layouts (e.g. `RequireUserType`, `AppLayoutWithNavbar`).

## License

Commercial use is permitted only with explicit approval from the licensors. See [COMMERCIAL_LICENSE.md](./COMMERCIAL_LICENSE.md) in this repository for terms.
