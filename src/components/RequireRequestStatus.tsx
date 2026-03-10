import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuthReady } from "@/hooks/useAuthReady";

interface RequireRequestStatusProps {
  allowedStatuses: string[]; // e.g., ["accepted"]
}

export const RequireRequestStatus = ({ allowedStatuses }: RequireRequestStatusProps) => {
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
        const status = tokenResult.claims.request_status as string | undefined | null;

        // Legacy fallback: if status is missing, treat as "accepted"
        const effectiveStatus = status || "accepted";

        // "accepted" allows access
        if (effectiveStatus && allowedStatuses.includes(effectiveStatus)) {
          setAuthorized(true);
        } else {
            // Handle redirects based on status
            if (effectiveStatus === "sent") {
                navigate("/request-sent");
            } else if (effectiveStatus === "rejected") {
                navigate("/request-rejected"); 
            } else {
                navigate("/403");
            }
          setAuthorized(false);
        }
      } catch (error) {
        console.error("Error checking request status:", error);
        navigate("/login");
      }
    };

    checkClaims();
  }, [ready, navigate, allowedStatuses]);

  if (!ready || authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-deep">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-glow" />
      </div>
    );
  }

  return authorized ? <Outlet /> : null;
};
