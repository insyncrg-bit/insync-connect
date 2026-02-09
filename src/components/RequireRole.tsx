import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useRole } from "@/hooks/useRole";

type AllowedRole = "startup" | "vc" | "analyst" | "superuser";

interface RequireRoleProps {
  allowedRoles: AllowedRole[];
}

export const RequireRole = ({ allowedRoles }: RequireRoleProps) => {
  const navigate = useNavigate();
  const { role, loading } = useRole();

  useEffect(() => {
    if (loading) return;
    if (role === "superuser") return;

    if (!auth.currentUser) {
      navigate("/login", { replace: true });
      return;
    }

    if (!role) {
      navigate("/select-role", { replace: true });
      return;
    }

    if (!allowedRoles.includes(role)) {
      navigate("/403", { replace: true });
      return;
    }
  }, [loading, role, allowedRoles, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-deep">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-glow" />
      </div>
    );
  }

  if (role === "superuser") return <Outlet />;
  if (!auth.currentUser || !role || !allowedRoles.includes(role)) return null;

  return <Outlet />;
};
