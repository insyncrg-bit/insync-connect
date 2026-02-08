import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuthReady } from "@/hooks/useAuthReady";
import { Landing } from "@/landing";

type AppRole = "startup" | "vc" | "analyst" | "superuser";

const VALID_ROLES: AppRole[] = ["startup", "vc", "analyst", "superuser"];

/** 
 * Role → onboarding flow. Users with roles go through onboarding/signup flow.
 * Superuser stays separate under /admin.
 */
function getAppHomeByRole(role: AppRole): string {
  switch (role) {
    case "superuser":
      return "/admin";
    case "vc":
      return "/vc-onboarding";
    case "analyst":
      return "/analyst"; // Analysts go through request-sent flow, then onboarding
    case "startup":
      return "/startup-onboarding";
    default:
      return "/select-role";
  }
}

/**
 * Navigation from / and /landing:
 * - Not logged in → show landing.
 * - Logged in, no role (token claims) → /select-role.
 * - Logged in with role → onboarding flow (vc → /vc-onboarding, startup → /startup-onboarding, analyst → /analyst).
 * Role is read from Firebase ID token claims only.
 */
export const LandingOrRedirect = () => {
  const navigate = useNavigate();
  const ready = useAuthReady();
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const user = auth.currentUser;
    if (!user) {
      setShowLanding(true);
      return;
    }
    user
      .getIdTokenResult()
      .then((result) => {
        const claim = (result.claims.role as string) || "";
        const role = VALID_ROLES.includes(claim as AppRole) ? (claim as AppRole) : undefined;
        if (role) {
          navigate(getAppHomeByRole(role), { replace: true });
        } else {
          navigate("/select-role", { replace: true });
        }
      })
      .catch(() => navigate("/select-role", { replace: true }));
  }, [ready, navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-deep">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-glow" />
      </div>
    );
  }
  if (showLanding) return <Landing />;
  return null;
};
