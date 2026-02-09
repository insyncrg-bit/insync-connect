import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuthReady } from "@/hooks/useAuthReady";

type AllowedRole = "startup" | "vc" | "analyst" | "superuser";

interface RequireRoleProps {
  allowedRoles: AllowedRole[];
}

/**
 * Renders children only if the current user's token has one of the allowed roles.
 * Role is read from Firebase ID token custom claims only.
 * Redirects to /login if not authenticated, /select-role if no role, or /403 if role not allowed.
 */
/** Stable dependency for allowedRoles so inline arrays from parent don't retrigger the effect. */
function allowedRolesKey(roles: AllowedRole[]) {
  return roles.slice().sort().join(",");
}

export const RequireRole = ({ allowedRoles }: RequireRoleProps) => {
  const navigate = useNavigate();
  const ready = useAuthReady();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const rolesKey = allowedRolesKey(allowedRoles);

  useEffect(() => {
    // Wait for Firebase auth to hydrate before checking
    if (!ready) return;

    const check = async () => {
      const user = auth.currentUser;
      if (!user) {
        // Not authenticated - redirect to login, not select-role
        navigate("/login", { replace: true });
        setAllowed(false);
        return;
      }
      try {
        const { claims } = await user.getIdTokenResult();
        const role = (claims.role as AllowedRole) || null;

        if (!role) {
          navigate("/select-role", { replace: true });
          setAllowed(false);
          return;
        }
        if (!allowedRoles.includes(role)) {
          navigate("/403", { replace: true });
          setAllowed(false);
          return;
        }
        setAllowed(true);
      } catch {
        navigate("/select-role", { replace: true });
        setAllowed(false);
      }
    };
    check();
  }, [ready, allowedRoles, navigate]);

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
