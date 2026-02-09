import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuthReady } from "@/hooks/useAuthReady";

/**
 * Redirects authenticated users away from auth pages (login, signup).
 * Users who are already logged in should not see these pages.
 */
export const RequireNoAuth = () => {
  const navigate = useNavigate();
  const ready = useAuthReady();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    // Wait for Firebase auth to hydrate before checking
    if (!ready) return;

    const user = auth.currentUser;
    if (user) {
      // User is already authenticated, redirect to home
      // LandingOrRedirect will handle role-based routing
      navigate("/", { replace: true });
      setAllowed(false);
    } else {
      // Not authenticated, allow access to auth pages
      setAllowed(true);
    }
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
