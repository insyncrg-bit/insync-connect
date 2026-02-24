import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthReady } from "@/hooks/useAuthReady";
import { useUserClaims } from "@/hooks/useUserClaims";
import { Landing } from "@/landing/Landing";
import { getSmartRedirectPath } from "@/lib/onboarding";
import { auth } from "@/lib/firebase";

export const LandingOrRedirect = () => {
  const ready = useAuthReady();
  const { userType, loading } = useUserClaims();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready || loading) return;

    if (userType && auth.currentUser) {
      // Use smart redirect logic
      auth.currentUser.getIdTokenResult().then((token) => {
        getSmartRedirectPath(auth.currentUser!, token.claims).then((path) => {
          navigate(path, { replace: true });
        });
      });
    } else if (auth.currentUser) {
      // Logged in but no userType -> select role
      navigate("/select-role", { replace: true });
    }
  }, [ready, loading, userType, navigate]);

  if (!ready || loading) return null;

  return <Landing />;
};
