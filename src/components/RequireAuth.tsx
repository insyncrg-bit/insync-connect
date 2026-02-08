import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { sessionManager, SESSION_TIMEOUT_MS } from "@/lib/session";
import { useToast } from "@/hooks/use-toast";
import { useAuthReady } from "@/hooks/useAuthReady";

/**
 * Protects routes that require an authenticated session. Waits for auth to be ready
 * (useAuthReady restores session from Firebase on refresh), then requires valid session
 * or redirects to /login.
 */
export const RequireAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const ready = useAuthReady();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!ready) return;
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
  }, [ready, navigate, toast]);

  if (!ready || allowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-deep">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-glow" />
      </div>
    );
  }
  if (!allowed) return null;
  return <Outlet />;
}
