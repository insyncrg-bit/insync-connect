import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useRole } from "@/hooks/useRole";

export const RequireNoRole = () => {
  const navigate = useNavigate();
  const { role, loading } = useRole();

  useEffect(() => {
    if (loading) return;

    if (!auth.currentUser) {
      navigate("/login", { replace: true });
      return;
    }

    if (role === "superuser") return;

    if (role) {
      switch (role) {
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
      return;
    }
  }, [loading, role, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-deep">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-glow" />
      </div>
    );
  }

  if (role === "superuser") return <Outlet />;
  if (role) return null;

  return <Outlet />;
};
