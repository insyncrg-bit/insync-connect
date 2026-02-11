import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Shield, ArrowLeft, Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { sessionManager } from "@/lib/session";
import { useToast } from "@/hooks/use-toast";
import inSyncLogo from "@/landing/assets/in-sync-logo.png";

const FIREBASE_API = import.meta.env.VITE_FIREBASE_API || "";

// TEMPORARY: Used only to set the first superuser. Once your role is in claims, remove this and allow access when token claim role === "superuser".
const ALLOWED_ADMIN_EMAIL = "shourya0523@gmail.com";

export const SuperuserConfig = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [allowed, setAllowed] = useState<boolean | null>(null);

  // Wait for Firebase auth to be ready before deciding; session may not be updated yet when we mount after login redirect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/", { replace: true });
        return;
      }
      const currentEmail = (firebaseUser.email || sessionManager.get()?.email || "").toLowerCase().trim();
      if (currentEmail !== ALLOWED_ADMIN_EMAIL) {
        navigate("/", { replace: true });
        return;
      }
      setAllowed(true);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email");
      return;
    }

    const user = auth.currentUser;
    const token = sessionManager.getValidToken();
    if (!user || !token) {
      sessionManager.clear();
      navigate("/login", { replace: true });
      return;
    }
    if (!FIREBASE_API) {
      toast({
        title: "Error",
        description: "API URL not configured.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`${FIREBASE_API}/auth/admin/assign-superuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email: trimmed }),
      });

      if (response.status === 403) {
        setError("You are not allowed to perform this action.");
        return;
      }
      if (response.status === 404) {
        const data = await response.json().catch(() => ({})) as { error?: string; path?: string; url?: string; method?: string };
        if (data.path != null) {
          console.warn("[SuperuserConfig] 404 route not found – backend received:", data);
          setError("Endpoint not found. Backend path: " + (data.path ?? data.url ?? "unknown") + ". Redeploy functions and check route.");
        } else {
          setError("No user found with this email. They must sign up first.");
        }
        return;
      }
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError((data as { error?: string }).error || "Failed to assign superuser.");
        return;
      }

      toast({
        title: "Superuser assigned",
        description: `${trimmed} has been assigned the superuser role.`,
      });
      setEmail("");
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setError("Request failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-glow/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-glow/5 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="block mb-6">
          <img
            src={inSyncLogo}
            alt="InSync"
            className="h-20 w-auto max-w-[400px] mx-auto"
            style={{
              filter: "drop-shadow(0 0 30px rgba(6,182,212,0.5)) drop-shadow(0 0 60px rgba(6,182,212,0.3))",
            }}
          />
        </Link>

        <div className="bg-navy-card border border-white/10 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-glow mb-2">
            <Shield className="h-6 w-6" />
            <h1 className="text-2xl font-bold text-white">Assign Superuser</h1>
          </div>
          <p className="text-white/60 text-sm mb-6">
            Grant the superuser role to an existing user by email. They must have signed up first.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">
                User email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  disabled={isSubmitting}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-cyan-glow text-navy-deep hover:bg-cyan-bright font-semibold py-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign superuser"
              )}
            </Button>
          </form>

          <Link
            to="/"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-cyan-glow hover:text-cyan-bright transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuperuserConfig;
