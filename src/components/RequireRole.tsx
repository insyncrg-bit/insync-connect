import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuthReady } from "@/hooks/useAuthReady";
import { useUserClaims } from "@/hooks/useUserClaims";

interface RequireRoleProps {
  allowedRoles: string[];
}

export const RequireRole = ({ allowedRoles }: RequireRoleProps) => {
  const navigate = useNavigate();
  const ready = useAuthReady();
  const { userType, loading } = useUserClaims();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!ready || loading) return;

    if (!auth.currentUser) {
      navigate("/login", { replace: true });
      return;
    }

    if (!userType) {
      navigate("/select-role", { replace: true });
      return;
    }

    // Check if userType is in allowedRoles
    // We assume allowedRoles contains "vc-user", "founder-user", "superuser" now?
    // User might still be passing "vc", "startup" in App.tsx?
    // "Hard refactor" implies App.tsx is updated.
    // But I only updated RequireUserType in App.tsx. 
    // RequireRole is ONLY used for "superuser" in App.tsx. 
    // So allowedRoles will be ["superuser"].
    // If userType is "superuser", it matches.
    
    if (!allowedRoles.includes(userType)) {
      navigate("/403", { replace: true });
      return;
    }

    setAllowed(true);
  }, [ready, loading, userType, allowedRoles, navigate]);

  if (!ready || loading || !allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-deep">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-glow" />
      </div>
    );
  }

  return <Outlet />;
};
