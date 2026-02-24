import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { sessionManager } from "@/lib/session";
import { useToast } from "@/hooks/use-toast";
import { useAuthReady } from "@/hooks/useAuthReady";

/**
 * Protects routes that require an authenticated session. Waits for auth to be ready
 * (useAuthReady restores session from Firebase on refresh), then requires valid Firebase
 * user or redirects to /login.
 */
export const RequireAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const ready = useAuthReady();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (!ready) return;
    
    // Simply check if Firebase has a valid current user
    // Firebase SDK handles token refresh automatically
    const user = auth.currentUser;
    if (!user) {
      auth.signOut().catch(() => {
        // Ignore sign-out errors in guard
      });
      sessionManager.clear();
      toast({
        title: "Please sign in",
        description: "You need to be signed in to access this page.",
        variant: "destructive",
      });
      navigate("/login", { replace: true });
      setAllowed(false);
      return;
    }

    // Block users whose email is not verified
    if (!user.emailVerified) {
      auth.signOut().catch(() => {
        // Ignore sign-out errors in guard
      });
      sessionManager.clear();
      toast({
        title: "Verify your email",
        description: "Please verify your email address using the link we sent before continuing.",
        variant: "destructive",
      });
      navigate("/login", { replace: true });
      setAllowed(false);
      return;
    }
    
    setAllowed(true);
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
