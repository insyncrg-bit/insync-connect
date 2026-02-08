import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";

type AllowedRole = "startup" | "vc" | "analyst" | "superuser";

interface RequireRoleProps {
  allowedRoles: AllowedRole[];
}

/**
 * Renders children only if the current user's token has one of the allowed roles.
 * Role is read from Firebase ID token custom claims only.
 * Redirects to /select-role if no role, or /403 if role not allowed.
 */
export const RequireRole = ({ allowedRoles }: RequireRoleProps) => {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/select-role", { replace: true });
        setAllowed(false);
        return;
      }
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
    };
    check();
  }, [allowedRoles, navigate]);

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
