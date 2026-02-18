import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuthReady } from "@/hooks/useAuthReady";

interface RequireUserTypeProps {
  allowedTypes: string[];
}

export const RequireUserType = ({ allowedTypes }: RequireUserTypeProps) => {
  const navigate = useNavigate();
  const ready = useAuthReady();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!ready) return;

    const checkClaims = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const tokenResult = await user.getIdTokenResult();
        const userType = tokenResult.claims.user_type as string | undefined;

        if (userType && allowedTypes.includes(userType)) {
          setAuthorized(true);
        } else {
            // If they have no user_type, they probably haven't selected a role yet
            if (!userType) {
                 navigate("/select-role");
            } else {
                // Wrong user type
                navigate("/403");
            }
          setAuthorized(false);
        }
      } catch (error) {
        console.error("Error checking user type:", error);
        navigate("/login");
      }
    };

    checkClaims();
  }, [ready, navigate, allowedTypes]);

  if (!ready || authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-deep">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-glow" />
      </div>
    );
  }

  return authorized ? <Outlet /> : null;
};
