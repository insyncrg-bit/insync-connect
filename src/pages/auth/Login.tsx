import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import inSyncLogo from "@/landing/assets/in-sync-logo.png";
import { signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { sessionManager, SESSION_TIMEOUT_MS } from "@/lib/session";
import { useToast } from "@/hooks/use-toast";

type LoginStep = "email" | "password" | "verifying";

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
  const [waitingForVerification, setWaitingForVerification] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [emailVerifiedInDatabase, setEmailVerifiedInDatabase] = useState(false);
  const verificationCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const authUnsubscribeRef = useRef<(() => void) | null>(null);

  // When landing on login with email (e.g. welcome back from signup), open password step immediately
  useEffect(() => {
    if (initialEmail.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(initialEmail)) {
      setStep("password");
      setEmailVerifiedInDatabase(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- only on mount, initialEmail from location

  // TEMPORARY: Redirect this email to superuser page until role is in claims. Then remove and gate by token claim role === "superuser".
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) return;
      const userEmail = (firebaseUser.email || "").toLowerCase().trim();
      if (userEmail === "shourya0523@gmail.com") {
        navigate("/admin/set-superuser", { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      log.info("Cleaning up login component");
      if (verificationCheckIntervalRef.current) {
        clearInterval(verificationCheckIntervalRef.current);
        verificationCheckIntervalRef.current = null;
      }
      if (authUnsubscribeRef.current) {
        authUnsubscribeRef.current();
        authUnsubscribeRef.current = null;
      }
    };
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
  // Superuser stays under /admin.
  const redirectToRoleHome = useCallback(
    (role: string, navigate: (path: string) => void) => {
      switch (role) {
        case "superuser":
          navigate("/admin");
          break;
        case "vc":
          navigate("/vc-onboarding");
          break;
        case "analyst":
          navigate("/analyst"); // Analysts go through request-sent flow, then onboarding
          break;
        case "startup":
          navigate("/startup-onboarding");
          break;
        default:
          navigate("/select-role");
      }
    },
    []
  );

  // Handle redirect after email verification. Role from token claims only.
  const handleVerifiedUser = useCallback(
    async (user: any) => {
      log.info("Handling verified user", { uid: user.uid, email: user.email, emailVerified: user.emailVerified });

      // TEMPORARY: First-time superuser setup – remove once superuser is in claims and gate by claim.
      const userEmail = (user.email || email || "").toLowerCase().trim();
      if (userEmail === "shourya0523@gmail.com") {
        log.info("Admin email detected, redirecting to superuser page");
        try {
          sessionManager.save({ email: user.email || email, userId: user.uid });
          const token = await user.getIdToken();
          sessionManager.setAuthToken(token, Date.now() + SESSION_TIMEOUT_MS);
        } catch (e) {
          log.error("Failed to save session before admin redirect", e);
        }
        navigate("/admin/set-superuser");
        return;
      }

      try {
        const result = await user.getIdTokenResult();
        const userRole = (result.claims.role as string) || null;
        log.info("User role from token", { role: userRole });

        sessionManager.save({
          email: user.email || email,
          userId: user.uid,
          role: userRole as "startup" | "vc" | "analyst" | "superuser" | undefined,
        });
        const token = await user.getIdToken();
        sessionManager.setAuthToken(token, Date.now() + SESSION_TIMEOUT_MS);
        log.info("Session data saved");

        if (!userRole || !["superuser", "vc", "analyst", "startup"].includes(userRole)) {
          log.info("No role in token, redirecting to role selection");
          navigate("/select-role");
          return;
        }

        // VC with incomplete onboarding → onboarding first
        if (userRole === "vc") {
          try {
            const onboardingData = localStorage.getItem("vc_onboarding_data");
            if (onboardingData) {
              const data = JSON.parse(onboardingData);
              if (data?.firmName && !data.submitted) {
                log.info("Incomplete VC onboarding found, redirecting to onboarding");
                navigate("/vc-onboarding");
                return;
              }
            }
          } catch (parseError) {
            log.warn("Could not read onboarding data, skipping", parseError);
          }
        }

        redirectToRoleHome(userRole, navigate);
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

  // Set up polling to check email verification status
  useEffect(() => {
    if (!waitingForVerification) {
      // Cleanup if we're no longer waiting
      if (verificationCheckIntervalRef.current) {
        clearInterval(verificationCheckIntervalRef.current);
        verificationCheckIntervalRef.current = null;
      }
      if (authUnsubscribeRef.current) {
        authUnsubscribeRef.current();
        authUnsubscribeRef.current = null;
      }
      return;
    }

    log.info("Setting up email verification polling");

    // Listen for auth state changes (including email verification)
    authUnsubscribeRef.current = onAuthStateChanged(auth, async (user) => {
      if (user) {
        log.info("Auth state changed, checking verification", { uid: user.uid });
        try {
          // Reload user to get latest emailVerified status
          await user.reload();
          log.info("User reloaded", { emailVerified: user.emailVerified });
          
          if (user.emailVerified) {
            log.info("Email verified via auth state change");
            // Email is now verified - proceed with redirect
            setWaitingForVerification(false);
            if (verificationCheckIntervalRef.current) {
              clearInterval(verificationCheckIntervalRef.current);
              verificationCheckIntervalRef.current = null;
            }
            if (authUnsubscribeRef.current) {
              authUnsubscribeRef.current();
              authUnsubscribeRef.current = null;
            }
            await handleVerifiedUser(user);
          }
        } catch (error) {
          log.error("Error in auth state change handler", error);
          toast({
            title: "Verification check failed",
            description: "We couldn't confirm your email. Please try again or refresh the page.",
            variant: "destructive",
          });
        }
      }
    });

    // Also poll periodically to check verification status
    verificationCheckIntervalRef.current = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          log.info("Polling for email verification", { uid: currentUser.uid });
          await currentUser.reload();
          log.info("User reloaded in poll", { emailVerified: currentUser.emailVerified });
          
          if (currentUser.emailVerified) {
            log.info("Email verified via polling");
            setWaitingForVerification(false);
            if (verificationCheckIntervalRef.current) {
              clearInterval(verificationCheckIntervalRef.current);
              verificationCheckIntervalRef.current = null;
            }
            if (authUnsubscribeRef.current) {
              authUnsubscribeRef.current();
              authUnsubscribeRef.current = null;
            }
            await handleVerifiedUser(currentUser);
          }
        } catch (error) {
          log.error("Error in verification polling", error);
          toast({
            title: "Verification check failed",
            description: "We couldn't confirm your email. Please try again or refresh the page.",
            variant: "destructive",
          });
        }
      } else {
        log.warn("No current user during verification polling");
      }
    }, 2000); // Check every 2 seconds

    // Cleanup on unmount or when waitingForVerification changes
    return () => {
      log.info("Cleaning up verification polling");
      if (verificationCheckIntervalRef.current) {
        clearInterval(verificationCheckIntervalRef.current);
        verificationCheckIntervalRef.current = null;
      }
      if (authUnsubscribeRef.current) {
        authUnsubscribeRef.current();
        authUnsubscribeRef.current = null;
      }
    };
  }, [waitingForVerification, handleVerifiedUser]);

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
      log.info("Firebase sign in successful", { 
        uid: user.uid, 
        email: user.email, 
        emailVerified: user.emailVerified 
      });

      // Check email verification
      if (!user.emailVerified) {
        log.info("Email not verified, sending verification email");
        // Email not verified - send verification email and wait
        setWaitingForVerification(true);
        setStep("verifying");
        setIsLoading(false);

        // Send verification email if not already sent
        if (!verificationEmailSent) {
          try {
            await sendEmailVerification(user, {
              url: `${window.location.origin}/verify-email`,
              handleCodeInApp: false,
            });
            setVerificationEmailSent(true);
            log.info("Verification email sent successfully");
            toast({
              title: "Verification email sent",
              description: "Please check your email and click the verification link. We'll automatically proceed once you've verified.",
            });
          } catch (error: any) {
            log.error("Error sending verification email", error);
            toast({
              title: "Error",
              description: "Failed to send verification email. Please try again.",
              variant: "destructive",
            });
            setWaitingForVerification(false);
            setStep("password");
          }
        }

        return;
      }

      log.info("Email already verified, proceeding with redirect");
      // Email is verified - proceed with redirect
      await handleVerifiedUser(user);
    } catch (error: any) {
      log.error("Login error", error);
      
      // Handle specific Firebase Auth errors
      let errorMessage = "Invalid email or password. Please try again.";
      
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
        log.warn("User not found", { email });
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
        log.warn("Wrong password", { email });
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
        log.warn("Invalid email", { email });
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled.";
        log.warn("User disabled", { email });
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
        log.warn("Too many requests", { email });
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection and try again.";
        log.error("Network error", { email });
      } else if (error.code === "auth/invalid-credential" || error.code === "auth/invalid-login-credentials") {
        errorMessage = "Invalid email or password. Please try again.";
        log.warn("Invalid credentials", { email });
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
      
      setWaitingForVerification(false);
      setStep("password");
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
    setWaitingForVerification(false);
    setVerificationEmailSent(false);
    setEmailVerifiedInDatabase(false);
  };

  const handleCancelVerification = () => {
    log.info("User canceling verification wait");
    setWaitingForVerification(false);
    setVerificationEmailSent(false);
    setStep("password");
    if (verificationCheckIntervalRef.current) {
      clearInterval(verificationCheckIntervalRef.current);
      verificationCheckIntervalRef.current = null;
    }
    if (authUnsubscribeRef.current) {
      authUnsubscribeRef.current();
      authUnsubscribeRef.current = null;
    }
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
            <h1 className="text-2xl font-bold text-white mb-2">
              {step === "verifying" ? "Verify your email" : "Welcome back"}
            </h1>
            <p className="text-white/60">
              {step === "verifying"
                ? "Please check your email and click the verification link"
                : step === "email" 
                  ? "Enter your email to continue" 
                  : "Enter your password"}
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
          ) : step === "verifying" ? (
            <div className="space-y-5">
              <div className="bg-cyan-glow/10 border border-cyan-glow/30 rounded-lg p-6 text-center">
                <div className="mb-4">
                  <Mail className="h-12 w-12 text-cyan-glow mx-auto mb-3" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Verification email sent!
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  We've sent a verification link to <strong>{email}</strong>
                </p>
                <p className="text-white/60 text-sm mb-4">
                  Click the link in the email to verify your account. We'll automatically proceed once you've verified.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Waiting for verification...</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelVerification}
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
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
