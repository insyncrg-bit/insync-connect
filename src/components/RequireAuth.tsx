import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { sessionManager, SESSION_TIMEOUT_MS } from "@/lib/session";
import { useToast } from "@/hooks/use-toast";

/**
 * Protects routes that require an authenticated session with a valid (non-expired) token.
 * On session timeout or missing token, clears session and redirects to /login.
 * Optionally refreshes the token when it is close to expiring.
 */
export const RequireAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      if (!sessionManager.isSessionValid()) {
        sessionManager.clear();
        await signOut(auth).catch(() => {});
        toast({
          title: "Session expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        navigate("/login", { replace: true });
        setAllowed(false);
        return;
      }
      if (sessionManager.shouldRefreshToken() && auth.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken(true);
          sessionManager.setAuthToken(token, Date.now() + SESSION_TIMEOUT_MS);
        } catch {
          // Refresh failed (e.g. user signed out elsewhere) – treat as expired
          sessionManager.clear();
          await signOut(auth).catch(() => {});
          toast({
            title: "Session expired",
            description: "Please sign in again to continue.",
            variant: "destructive",
          });
          navigate("/login", { replace: true });
          setAllowed(false);
          return;
        }
      }
      setAllowed(true);
    };
    check();
  }, [navigate, toast]);

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
