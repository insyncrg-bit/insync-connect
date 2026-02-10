import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useRole } from "@/hooks/useRole";
import { Landing } from "@/landing";
import { getSmartRedirectPath } from "@/lib/onboarding";

type AppRole = "startup" | "vc" | "analyst" | "superuser";



export const LandingOrRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, loading } = useRole();
  const [showLanding, setShowLanding] = useState(false);
  const isRoot = location.pathname === "/";
  const isLandingRoute = location.pathname === "/landing";

  useEffect(() => {
    if (loading) return;

    const user = auth.currentUser;

    if (!user) {
      if (isRoot) {
        navigate("/landing", { replace: true });
        return;
      }
      if (isLandingRoute) setShowLanding(true);
      return;
    }

    if (role) {
      getSmartRedirectPath(user, role).then((path) => {
        navigate(path, { replace: true });
      });
    } else {
      navigate("/select-role", { replace: true });
    }
  }, [loading, role, navigate, isRoot, isLandingRoute]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-deep">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-glow" />
      </div>
    );
  }

  if (showLanding && isLandingRoute) return <Landing />;
  return null;
};
