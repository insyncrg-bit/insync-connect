import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, UserCog, Rocket, LayoutDashboard } from "lucide-react";
import infinityLogo from "@/landing/assets/infinity-logo.png";
import { auth } from "@/lib/firebase";
import { sessionManager } from "@/lib/session";

const FIREBASE_API = import.meta.env.VITE_FIREBASE_API || "";

const DASHBOARDS = [
  {
    id: "vc-admin",
    title: "VC Admin Dashboard",
    description: "Full access: dashboard, organisation, settings, profile",
    path: "/vc-admin",
    icon: Building2,
    role: "vc",
  },
  {
    id: "analyst",
    title: "Analyst Dashboard",
    description: "Limited: dashboard and profile only",
    path: "/analyst",
    icon: UserCog,
    role: "analyst",
  },
  {
    id: "startup",
    title: "Startup Dashboard",
    description: "Founder view: curated investors, interests, syncs",
    path: "/startup",
    icon: Rocket,
    role: "startup",
  },
];

/**
 * Superuser-only page to test all dashboards.
 * Provides links to impersonate/view each role's experience.
 */
export const SuperuserTestPage = () => {
  const navigate = useNavigate();

  // Re-validate superuser on mount (e.g. if demoted elsewhere, redirect)
  useEffect(() => {
    if (!FIREBASE_API) return;
    const user = auth.currentUser;
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
    let cancelled = false;
    user.getIdToken().then((token) => {
      if (cancelled) return;
      return fetch(`${FIREBASE_API}/auth/admin/superusers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }).then((res) => {
      if (cancelled || !res) return;
      if (res.status === 401) {
        sessionManager.clear();
        navigate("/login", { replace: true });
        return;
      }
      if (res.status === 403) {
        user.getIdTokenResult(true).then((result) => {
          if (cancelled) return;
          const role = (result.claims.role as string) || "";
          if (role !== "superuser") {
            sessionManager.clear();
            navigate("/", { replace: true });
          }
        }).catch(() => {
          if (!cancelled) {
            sessionManager.clear();
            navigate("/", { replace: true });
          }
        });
      }
    }).catch(() => { /* ignore network errors for this soft check */ });
    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#151a24] flex flex-col">
      <header className="h-14 border-b border-white/10 bg-[hsl(var(--navy-header))] backdrop-blur-sm flex items-center px-6 gap-4">
        <button onClick={() => navigate("/")} className="hover:opacity-80 transition-opacity">
          <img src={infinityLogo} alt="Home" className="h-14 w-auto" />
        </button>
        <div className="flex-1" />
        <span className="text-sm text-cyan-glow font-medium">Superuser Test Mode</span>
      </header>

      <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-cyan-glow" />
            Test Dashboards
          </h1>
          <p className="text-white/60">
            Switch between dashboards to test each role's experience. You'll need to sign in with a user who has the
            corresponding role, or use session override for testing.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DASHBOARDS.map((dash) => {
            const Icon = dash.icon;
            return (
              <Card
                key={dash.id}
                className="bg-navy-card border-white/10 p-6 hover:border-cyan-glow/40 transition-all cursor-pointer group"
                onClick={() => navigate(dash.path)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-glow/10 flex items-center justify-center group-hover:bg-cyan-glow/20 transition-colors">
                    <Icon className="h-6 w-6 text-cyan-glow" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white group-hover:text-cyan-glow transition-colors">
                      {dash.title}
                    </h2>
                    <p className="text-xs text-white/50">{dash.role}</p>
                  </div>
                </div>
                <p className="text-sm text-white/60 mb-4">{dash.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-cyan-glow/30 text-cyan-glow hover:bg-cyan-glow/10"
                >
                  Open Dashboard
                </Button>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-sm text-white/60">
            <strong className="text-white">Note:</strong> Role-based routing will redirect you if your current session
            doesn't have the required role. To test a different dashboard, sign in with a user who has that role, or
            complete onboarding for that role.
          </p>
        </div>
      </main>
    </div>
  );
};
