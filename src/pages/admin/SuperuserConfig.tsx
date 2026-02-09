import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Shield, Loader2, Trash2, Users } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { sessionManager } from "@/lib/session";
import { useToast } from "@/hooks/use-toast";

const FIREBASE_API = import.meta.env.VITE_FIREBASE_API || "";

type SuperuserEntry = { uid: string; email: string | null };

function parseErrorBody(res: Response): Promise<{ error?: string; path?: string }> {
  return res.json().catch(() => ({}));
}

export const SuperuserConfig = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const [superusers, setSuperusers] = useState<SuperuserEntry[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [removingUid, setRemovingUid] = useState<string | null>(null);

  // RequireAuth + RequireRole(superuser) already gate this route; just confirm user is signed in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/login", { replace: true });
        return;
      }
      setAllowed(true);
    });
    return () => unsubscribe();
  }, [navigate]);

  const getAuthHeaders = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return null;
    const token = await user.getIdToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const fetchSuperusers = useCallback(async () => {
    if (!FIREBASE_API) return;
    setListLoading(true);
    setListError("");
    try {
      const headers = await getAuthHeaders();
      if (!headers) {
        sessionManager.clear();
        navigate("/login", { replace: true });
        return;
      }
      const response = await fetch(`${FIREBASE_API}/auth/admin/superusers`, { headers });
      if (response.status === 401) {
        sessionManager.clear();
        navigate("/login", { replace: true });
        return;
      }
      if (response.status === 403) {
        setListError("You are not allowed to view superusers.");
        return;
      }
      if (!response.ok) {
        const data = await parseErrorBody(response);
        setListError((data as { error?: string }).error || "Failed to load superusers.");
        return;
      }
      const data = (await response.json()) as { superusers: SuperuserEntry[] };
      setSuperusers(data.superusers || []);
    } catch (err) {
      console.error(err);
      setListError("Network error. Check the console and try again.");
      toast({
        title: "Error",
        description: "Could not load superuser list.",
        variant: "destructive",
      });
    } finally {
      setListLoading(false);
    }
  }, [getAuthHeaders, navigate, toast]);

  useEffect(() => {
    if (allowed && FIREBASE_API) fetchSuperusers();
  }, [allowed, FIREBASE_API, fetchSuperusers]);

  const handleRemove = async (uid: string) => {
    if (!FIREBASE_API) {
      toast({ title: "Error", description: "API URL not configured.", variant: "destructive" });
      return;
    }
    setRemovingUid(uid);
    try {
      const headers = await getAuthHeaders();
      if (!headers) {
        sessionManager.clear();
        navigate("/login", { replace: true });
        return;
      }
      const response = await fetch(`${FIREBASE_API}/auth/admin/superuser`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ uid }),
      });
      if (response.status === 401) {
        sessionManager.clear();
        navigate("/login", { replace: true });
        return;
      }
      if (response.status === 403) {
        toast({ title: "Forbidden", description: "You are not allowed to remove superusers.", variant: "destructive" });
        return;
      }
      if (!response.ok) {
        const data = await parseErrorBody(response);
        toast({
          title: "Remove failed",
          description: (data as { error?: string }).error || "Could not remove superuser.",
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Superuser removed", description: "The user no longer has the superuser role." });
      await fetchSuperusers();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRemovingUid(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignError("");
    const trimmed = email.trim();
    if (!trimmed) {
      setAssignError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setAssignError("Please enter a valid email address");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      sessionManager.clear();
      navigate("/login", { replace: true });
      return;
    }
    if (!FIREBASE_API) {
      toast({ title: "Error", description: "API URL not configured.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const headers = await getAuthHeaders();
      if (!headers) {
        sessionManager.clear();
        navigate("/login", { replace: true });
        return;
      }
      const response = await fetch(`${FIREBASE_API}/auth/admin/assign-superuser`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email: trimmed }),
      });

      if (response.status === 401) {
        sessionManager.clear();
        navigate("/login", { replace: true });
        return;
      }
      if (response.status === 403) {
        setAssignError("You are not allowed to perform this action.");
        return;
      }
      if (response.status === 404) {
        const data = await parseErrorBody(response) as { error?: string; path?: string };
        if (data.path != null) {
          setAssignError("Endpoint not found. Redeploy functions and try again.");
          console.warn("[SuperuserConfig] 404 – backend received path:", data.path);
        } else {
          setAssignError("No user found with this email. They must sign up first.");
        }
        return;
      }
      if (!response.ok) {
        const data = await parseErrorBody(response);
        setAssignError((data as { error?: string }).error || "Failed to assign superuser.");
        return;
      }

      toast({
        title: "Superuser assigned",
        description: `${trimmed} has been assigned the superuser role.`,
      });
      setEmail("");
      await fetchSuperusers();
    } catch (err) {
      console.error(err);
      setAssignError("Request failed. Check your connection and try again.");
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
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
    <div className="p-8 max-w-lg mx-auto w-full">
        <div className="bg-navy-card border border-white/10 rounded-2xl p-8 shadow-xl space-y-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-glow mb-2">
              <Shield className="h-6 w-6" />
              <h1 className="text-2xl font-bold text-white">Superuser management</h1>
            </div>
            <p className="text-white/60 text-sm">
              View current superusers, assign the role to a user by email, or remove the role.
            </p>
          </div>

          {/* Current superusers */}
          <div>
            <h2 className="flex items-center gap-2 text-white font-semibold mb-3">
              <Users className="h-4 w-4 text-cyan-glow" />
              Current superusers
            </h2>
            {listLoading ? (
              <div className="flex items-center gap-2 text-white/60 text-sm py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : listError ? (
              <p className="text-red-400 text-sm py-2">{listError}</p>
            ) : superusers.length === 0 ? (
              <p className="text-white/50 text-sm py-2">No superusers yet. Assign one below.</p>
            ) : (
              <ul className="space-y-2">
                {superusers.map(({ uid, email }) => (
                  <li
                    key={uid}
                    className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <span className="text-white truncate" title={email || uid}>
                      {email || `UID: ${uid.slice(0, 8)}…`}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={removingUid === uid}
                      onClick={() => handleRemove(uid)}
                      className="shrink-0 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                    >
                      {removingUid === uid ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </>
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Assign new superuser */}
          <div>
            <h2 className="text-white font-semibold mb-3">Assign new superuser</h2>
            <p className="text-white/60 text-sm mb-4">
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
                      setAssignError("");
                    }}
                    disabled={isSubmitting}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
                  />
                </div>
                {assignError && <p className="text-red-400 text-sm">{assignError}</p>}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-cyan-glow text-navy-deep hover:bg-cyan-bright font-semibold py-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>
        </div>
    </div>
  );
};

export default SuperuserConfig;
