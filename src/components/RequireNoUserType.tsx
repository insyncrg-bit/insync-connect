import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuthReady } from "@/hooks/useAuthReady";
import { getSmartRedirectPath } from "@/lib/onboarding";

export const RequireNoUserType = () => {
  const navigate = useNavigate();
  const ready = useAuthReady();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!ready) return;

    const checkClaims = async () => {
      const user = auth.currentUser;
      if (!user) {
        // Not logged in -> Redirect to login
        navigate("/login", { replace: true });
        return;
      }

      try {
        const tokenResult = await user.getIdTokenResult();
        const claims = tokenResult.claims;
        const role = claims.role;

        // If superuser, allow them to view select-role (for testing/admin usage)
        if (role === "superuser") {
             setChecking(false);
             return;
        }

        // Use smart redirect path logic
        const redirectPath = await getSmartRedirectPath(user, claims);
        
        if (redirectPath !== "/select-role") {
            navigate(redirectPath, { replace: true });
        } else {
            // If smart routing says "/select-role", then we allow them to stay
            setChecking(false);
        }
      } catch (error) {
        console.error("Error checking claims:", error);
        setChecking(false);
      }
    };

    checkClaims();
  }, [ready, navigate]);

  if (!ready || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-deep">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-glow" />
      </div>
    );
  }

  return <Outlet />;
};
