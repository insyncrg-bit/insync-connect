import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuthReady } from "@/hooks/useAuthReady";
import { getSmartRedirectPath } from "@/lib/onboarding";

interface RequireOnboardingProps {
  mode: "complete" | "incomplete";
}

/**
 * Route guard that ensures the user's onboarding state matches the required mode.
 * 
 * mode="complete": Used for dashboards. Redirects to onboarding if not done.
 * mode="incomplete": Used for onboarding pages. Redirects to dashboard if already done.
 */
export const RequireOnboarding = ({ mode }: RequireOnboardingProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const ready = useAuthReady();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!ready) return;

    const checkStatus = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const tokenResult = await user.getIdTokenResult();
        const claims = tokenResult.claims;
        
        // Source of truth for where the user SHOULD be
        const targetPath = await getSmartRedirectPath(user, claims);
        const currentPath = location.pathname;

        // If trying to access onboarding but already done
        if (mode === "incomplete") {
            if (!targetPath.includes("onboarding") && targetPath !== "/select-role") {
                navigate(targetPath, { replace: true });
                return;
            }
        }

        // If trying to access dashboard but NOT done
        if (mode === "complete") {
            if (targetPath.includes("onboarding") || targetPath === "/select-role") {
                navigate(targetPath, { replace: true });
                return;
            }
        }
        
        setChecking(false);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setChecking(false);
      }
    };

    checkStatus();
  }, [ready, navigate, mode, location.pathname]);

  if (!ready || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-deep">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-glow" />
      </div>
    );
  }

  return <Outlet />;
};
