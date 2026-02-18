import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import inSyncLogo from "@/landing/assets/in-sync-logo.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { sessionManager } from "@/lib/session";
import { useToast } from "@/hooks/use-toast";
import { getSmartRedirectPath } from "@/lib/onboarding";

type LoginStep = "email" | "password";

// Get Firebase API URL from environment variable
const FIREBASE_API = import.meta.env.VITE_FIREBASE_API || "";

// Logging utility
const log = {
  info: (message: string, data?: any) => {
    console.log(`[Login] ${message}`, data || "");
  },
  error: (message: string, error?: any) => {
    console.error(`[Login] ERROR: ${message}`, error || "");
  },
  warn: (message: string, data?: any) => {
    console.warn(`[Login] WARN: ${message}`, data || "");
  },
};

// API function to check if email exists
const checkEmailExists = async (email: string): Promise<boolean> => {
  log.info("Checking if email exists", { email });
  
  if (!FIREBASE_API) {
    log.error("FIREBASE_API environment variable is not set");
    throw new Error("API configuration error. Please contact support.");
  }

  try {
    const response = await fetch(`${FIREBASE_API}/auth/check-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    log.info("Email check response", { status: response.status, ok: response.ok });

    if (!response.ok) {
      const errorText = await response.text();
      log.error("Email check failed", { status: response.status, error: errorText });
      throw new Error(`Failed to check email: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    log.info("Email check result", { exists: data.exists });
    return data.exists;
  } catch (error: any) {
    log.error("Error checking email", error);
    
    // Provide user-friendly error messages
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      throw new Error("Network error. Please check your connection and try again.");
    }
    throw error;
  }
};

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get email from location state (if redirected from signup)
  const initialEmail = (location.state as { email?: string })?.email || "";
  
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailVerifiedInDatabase, setEmailVerifiedInDatabase] = useState(false);

  // When landing on login with email (e.g. welcome back from signup), open password step immediately
  useEffect(() => {
    if (initialEmail.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(initialEmail)) {
      setStep("password");
      setEmailVerifiedInDatabase(true);
    }
  }, [initialEmail]);

  // Cleanup on unmount
  useEffect(() => {
    return () => log.info("Cleaning up login component");
  }, []);

  const validateEmail = (emailValue: string): boolean => {
    if (!emailValue.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validatePassword = (passwordValue: string): boolean => {
    if (!passwordValue) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    setIsCheckingEmail(true);
    setErrors((prev) => ({ ...prev, email: "" }));

    try {
      log.info("Email submission started", { email });
      const emailExists = await checkEmailExists(email);
      
      if (emailExists) {
        log.info("Email exists in database, proceeding to password step");
        // Email exists, mark as verified and proceed to password step
        setEmailVerifiedInDatabase(true);
        setStep("password");
      } else {
        log.info("Email does not exist, redirecting to signup");
        // Email doesn't exist, redirect to signup with email pre-filled
        navigate("/signup", { state: { email } });
      }
    } catch (error: any) {
      log.error("Error in email submission", error);
      
      let errorMessage = "An error occurred. Please try again.";
      const msg = error?.message ?? "";
      
      if (msg.includes("Network error") || msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (msg.includes("API configuration")) {
        errorMessage = "Configuration error. Please contact support.";
      }
      
      setErrors((prev) => ({
        ...prev,
        email: errorMessage,
      }));
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Redirect targets by role (token claims). Users with roles go to onboarding flows.
  const redirectToRoleHome = useCallback(
    async (role: string, navigate: (path: string) => void, user: any) => {
      try {
        const path = await getSmartRedirectPath(user, role);
        log.info("Smart routing determined path", { role, path });
        navigate(path);
      } catch (e) {
        log.error("Smart routing failed, using fallback", e);
        switch (role) {
          case "superuser":
            navigate("/admin");
            break;
          case "vc":
            navigate("/vc-onboarding");
            break;
          case "analyst":
            navigate("/analyst");
            break;
          case "startup":
            navigate("/startup-onboarding");
            break;
          default:
            navigate("/select-role");
        }
      }
    },
    []
  );

  // Handle redirect after email verification.
  const handleVerifiedUser = useCallback(
    async (user: any) => {
      log.info("Handling verified user", { uid: user.uid, email: user.email, emailVerified: user.emailVerified });

      try {
        const result = await user.getIdTokenResult();
        const userRole = (result.claims.role as string) || null;
        log.info("User role from token", { role: userRole });

        sessionManager.save({
          email: user.email || email,
          userId: user.uid,
          role: userRole as "startup" | "vc" | "analyst" | "superuser" | undefined,
        });

        if (!userRole || !["superuser", "vc", "analyst", "startup"].includes(userRole)) {
          log.info("No role in token, redirecting to role selection");
          navigate("/select-role");
          return;
        }

        redirectToRoleHome(userRole, navigate, user);
      } catch (error) {
        log.error("Error handling verified user", error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        });
        navigate("/select-role");
      }
    },
    [email, navigate, toast, redirectToRoleHome]
  );

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(password)) {
      return;
    }

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, password: "" }));

    try {
      log.info("Password submission started", { email });
      
      // Sign in with Firebase Auth
      const normalizedEmail = email.toLowerCase().trim();
      log.info("Attempting Firebase sign in", { email: normalizedEmail });
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );

      const user = userCredential.user;
      log.info("Firebase sign in successful", { uid: user.uid, email: user.email });

      await handleVerifiedUser(user);
    } catch (error: any) {
      log.error("Login error", error);
      
      let errorMessage = "Invalid email or password. Please try again.";
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.code === "auth/invalid-credential" || error.code === "auth/invalid-login-credentials") {
        errorMessage = "Invalid email or password. Please try again.";
      }
      
      setErrors((prev) => ({
        ...prev,
        password: errorMessage,
      }));
      
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleBackToEmail = () => {
    log.info("User going back to email step");
    setStep("email");
    setPassword("");
    setErrors({});
    setEmailVerifiedInDatabase(false);
  };

  return (
    <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-glow/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-glow/5 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link to="/landing" className="block mb-6">
          <div className="relative">
            <div 
              className="absolute inset-0 blur-[60px] animate-pulse"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.4) 0%, rgba(6,182,212,0.2) 40%, transparent 70%)',
              }}
            />
            <img
              src={inSyncLogo}
              alt="InSync"
              className="relative h-40 w-auto max-w-[500px] mx-auto"
              style={{
                filter: "drop-shadow(0 0 30px rgba(6,182,212,0.5)) drop-shadow(0 0 60px rgba(6,182,212,0.3))",
              }}
            />
          </div>
        </Link>

        {/* Card */}
        <div className="bg-navy-card border border-white/10 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-white/60">
              {step === "email" ? "Enter your email to continue" : "Enter your password"}
            </p>
          </div>

          {step === "email" || !emailVerifiedInDatabase ? (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={isCheckingEmail}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
                    autoFocus
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isCheckingEmail}
                className="w-full mt-6 bg-cyan-glow text-navy-deep hover:bg-cyan-bright font-semibold py-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {isCheckingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {/* Email Display (read-only) */}
              <div className="space-y-2">
                <Label className="text-white/80">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    type="email"
                    value={email}
                    disabled
                    className="bg-white/5 border-white/10 text-white/60 pl-10 cursor-not-allowed"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="text-sm text-cyan-glow hover:text-cyan-bright transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Change email
                </button>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white/80">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    state={email ? { email } : undefined}
                    className="text-sm text-cyan-glow hover:text-cyan-bright transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={isLoading}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
                    autoFocus
                  />
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-cyan-glow text-navy-deep hover:bg-cyan-bright font-semibold py-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          )}

          {/* Sign Up Link */}
          <p className="text-center text-white/60 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-cyan-glow hover:text-cyan-bright transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
