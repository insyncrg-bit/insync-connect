import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuthReady } from "@/hooks/useAuthReady";

/**
 * Redirects users who already have a role away from /select-role.
 * Only users without a role (or with no role claim) can access this page.
 */
export const RequireNoRole = () => {
  const navigate = useNavigate();
  const ready = useAuthReady();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    // Wait for Firebase auth to hydrate before checking
    if (!ready) return;

    const check = async () => {
      const user = auth.currentUser;
      if (!user) {
        // Not authenticated - redirect to login
        navigate("/login", { replace: true });
        setAllowed(false);
        return;
      }

      const { claims } = await user.getIdTokenResult();
      const role = claims.role as string | undefined;

      if (role && ["vc", "startup", "analyst", "superuser"].includes(role)) {
        // User already has a role, redirect to their appropriate home
        switch (role) {
          case "superuser":
            navigate("/admin", { replace: true });
            break;
          case "vc":
            navigate("/vc-onboarding", { replace: true });
            break;
          case "analyst":
            navigate("/analyst", { replace: true });
            break;
          case "startup":
            navigate("/startup-onboarding", { replace: true });
            break;
          default:
            navigate("/", { replace: true });
        }
        setAllowed(false);
        return;
      }

      // No role - allow access to select-role
      setAllowed(true);
    };
    check();
  }, [ready, navigate]);

  if (allowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-deep">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-glow" />
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return <Outlet />;
};
