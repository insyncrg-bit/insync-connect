import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuthReady } from "@/hooks/useAuthReady";
import { Landing } from "@/landing";

type AppRole = "startup" | "vc" | "analyst" | "superuser";

const VALID_ROLES: AppRole[] = ["startup", "vc", "analyst", "superuser"];

/**
 * Role → app entry. Users with roles go to onboarding or dashboard.
 * Superuser stays under /admin.
 */
function getAppHomeByRole(role: AppRole): string {
  switch (role) {
    case "superuser":
      return "/admin";
    case "vc":
      return "/vc-onboarding";
    case "analyst":
      return "/analyst";
    case "startup":
      return "/startup-onboarding";
    default:
      return "/select-role";
  }
}

/**
 * Landing vs app separation:
 * - "/" = redirect only. Never renders landing. Unauthenticated → /landing; authenticated → app home or /select-role.
 * - "/landing" = canonical marketing page. Renders <Landing /> only when not logged in; logged-in users are redirected to app.
 * This avoids loading the landing experience when the user is already in or heading to the app.
 */
export const LandingOrRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ready = useAuthReady();
  const [showLanding, setShowLanding] = useState(false);
  const isRoot = location.pathname === "/";
  const isLandingRoute = location.pathname === "/landing";

  useEffect(() => {
    if (!ready) return;
    const user = auth.currentUser;

    if (!user) {
      if (isRoot) {
        navigate("/landing", { replace: true });
        return;
      }
      if (isLandingRoute) setShowLanding(true);
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
  }, [ready, navigate, isRoot, isLandingRoute]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-deep">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-glow" />
      </div>
    );
  }
  if (showLanding && isLandingRoute) return <Landing />;
  return null;
};
