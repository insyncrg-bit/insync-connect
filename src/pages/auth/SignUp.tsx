import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { sessionManager } from "@/lib/session";
import inSyncLogo from "@/landing/assets/in-sync-logo.png";
import { signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

type SignUpStep = "email" | "password" | "verifying";

// Get Firebase API URL from environment variable
const FIREBASE_API = import.meta.env.VITE_FIREBASE_API || "";

// Logging utility
const log = {
  info: (message: string, data?: any) => {
    console.log(`[SignUp] ${message}`, data || "");
  },
  error: (message: string, error?: any) => {
    console.error(`[SignUp] ERROR: ${message}`, error || "");
  },
  warn: (message: string, data?: any) => {
    console.warn(`[SignUp] WARN: ${message}`, data || "");
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

// API function to register user
const registerUser = async (email: string, password: string): Promise<string> => {
  log.info("Registering user", { email });
  
  if (!FIREBASE_API) {
    log.error("FIREBASE_API environment variable is not set");
    throw new Error("API configuration error. Please contact support.");
  }

  try {
    const response = await fetch(`${FIREBASE_API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    log.info("Register response", { status: response.status, ok: response.ok });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      log.error("Registration failed", { status: response.status, error: errorData });
      
      if (response.status === 409) {
        throw new Error("User already exists with this email. Please sign in instead.");
      }
      throw new Error(errorData.error || "Failed to create account. Please try again.");
    }

    const data = await response.json();
    log.info("User registered successfully", { uid: data.uid });
    return data.uid;
  } catch (error: any) {
    log.error("Error registering user", error);
    
    if (error.message.includes("User already exists")) {
      throw error;
    }
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      throw new Error("Network error. Please check your connection and try again.");
    }
    throw error;
  }
};

export const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get email from location state (if redirected from login)
  const initialEmail = (location.state as { email?: string })?.email || "";
  
  const [step, setStep] = useState<SignUpStep>(initialEmail ? "password" : "email");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [waitingForVerification, setWaitingForVerification] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [emailVerifiedInDatabase, setEmailVerifiedInDatabase] = useState(false);
  const verificationCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const authUnsubscribeRef = useRef<(() => void) | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      log.info("Cleaning up signup component");
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

  const validatePassword = (passwordValue: string, confirmPasswordValue: string): boolean => {
    const newErrors: Record<string, string> = {};

    if (!passwordValue) {
      newErrors.password = "Password is required";
    } else if (passwordValue.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPasswordValue) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordValue !== confirmPasswordValue) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
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
        log.info("Email exists in database, redirecting to login");
        // Email exists, redirect to login with email pre-filled
        navigate("/login", { state: { email } });
      } else {
        log.info("Email does not exist, proceeding to password step");
        // Email doesn't exist, proceed to password step
        setEmailVerifiedInDatabase(true);
        setStep("password");
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

  // Handle redirect after email verification
  const handleVerifiedUser = useCallback(async (user: any) => {
    log.info("Handling verified user after signup", { uid: user.uid, email: user.email });
    
    try {
      // Save session data (user has no role yet, will be set in role selection)
      sessionManager.save({
        email: user.email || email,
        userId: user.uid,
        // role will be set after role selection
      });
      log.info("Session data saved");

      // TEMPORARY: Remove once superuser is in claims; then gate by claim or remove this branch.
      const userEmail = (user.email || email || "").toLowerCase().trim();
      if (userEmail === "shourya0523@gmail.com") {
        log.info("Admin email detected, redirecting to superuser page");
        navigate("/admin/set-superuser");
        return;
      }

      // User is verified but has no role - redirect to role selection
      log.info("Redirecting to role selection");
      navigate("/select-role");
    } catch (error) {
      log.error("Error handling verified user", error);
      toast({
        title: "Error",
        description: "Failed to complete signup. Please try again.",
        variant: "destructive",
      });
    }
  }, [email, navigate, toast]);

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
    
    if (!validatePassword(password, confirmPassword)) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      log.info("Signup submission started", { email });

      // Step 1: Register user via backend API
      log.info("Calling backend register endpoint");
      await registerUser(email, password);

      // Step 2: Sign in with Firebase Client SDK using the same email/password
      log.info("Signing in with Firebase Client SDK");
      const normalizedEmail = email.toLowerCase().trim();
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

      // Step 3: Send email verification
      log.info("Sending email verification");
      try {
        await sendEmailVerification(user, {
          url: `${window.location.origin}/verify-email`,
          handleCodeInApp: false,
        });
        setVerificationEmailSent(true);
        log.info("Verification email sent successfully");
        
        // Step 4: Wait for email verification
        setWaitingForVerification(true);
        setStep("verifying");
        setIsSubmitting(false);

        toast({
          title: "Account created!",
          description: "Please check your email and click the verification link. We'll automatically proceed once you've verified.",
        });
      } catch (verificationError: any) {
        log.error("Error sending verification email", verificationError);
        // Still proceed to verification screen, but show error
        setWaitingForVerification(true);
        setStep("verifying");
        setIsSubmitting(false);
        
        toast({
          title: "Account created, but email failed",
          description: verificationError.message || "Failed to send verification email. You can resend it from the verification screen.",
          variant: "destructive",
        });
      }

    } catch (error: any) {
      log.error("Signup error", error);
      
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.message.includes("User already exists")) {
        errorMessage = "User already exists with this email. Please sign in instead.";
        toast({
          title: "Account exists",
          description: errorMessage,
          variant: "destructive",
        });
        navigate("/login", { state: { email } });
        return;
      } else if (error.message.includes("Network error") || error.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message.includes("API configuration")) {
        errorMessage = "Configuration error. Please contact support.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please sign in instead.";
        toast({
          title: "Account exists",
          description: errorMessage,
          variant: "destructive",
        });
        navigate("/login", { state: { email } });
        return;
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please choose a stronger password.";
        setErrors({ password: errorMessage });
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
        setErrors({ email: errorMessage });
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Email sign-up is not enabled. Please contact support.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({ 
        email: errorMessage
      });
      
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      setWaitingForVerification(false);
      setStep("password");
    } finally {
      setIsSubmitting(false);
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

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleBackToEmail = () => {
    log.info("User going back to email step");
    setStep("email");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    setWaitingForVerification(false);
    setVerificationEmailSent(false);
    setEmailVerifiedInDatabase(false);
  };

  const handleResendVerification = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      log.error("No user found for resending verification");
      toast({
        title: "Error",
        description: "No user found. Please try signing up again.",
        variant: "destructive",
      });
      return;
    }

    try {
      log.info("Resending verification email");
      await sendEmailVerification(currentUser, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: false,
      });
      setVerificationEmailSent(true);
      log.info("Verification email resent successfully");
      toast({
        title: "Verification email resent",
        description: "Please check your email (including spam folder) for the verification link.",
      });
    } catch (error: any) {
      log.error("Error resending verification email", error);
      let errorMessage = "Failed to resend verification email. Please try again.";
      
      if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please wait a few minutes before requesting another email.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
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
    // Sign out the user since they haven't verified yet
    auth.signOut().catch((error) => {
      log.error("Error signing out", error);
    });
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
              {step === "verifying" ? "Verify your email" : "Create your account"}
            </h1>
            <p className="text-white/60">
              {step === "verifying"
                ? "Please check your email and click the verification link"
                : step === "email"
                  ? "Join InSync and find your perfect match"
                  : "Create your password"}
            </p>
          </div>

          {step === "email" || !emailVerifiedInDatabase ? (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">
                  Email *
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
              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={handleResendVerification}
                  className="w-full bg-cyan-glow/20 text-cyan-glow hover:bg-cyan-glow/30 border border-cyan-glow/50"
                >
                  Resend Verification Email
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelVerification}
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
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
                <Label htmlFor="password" className="text-white/80">
                  Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={isSubmitting}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-white/50 mt-1">
                  Password must be at least 6 characters
                </p>
                {errors.password && (
                  <p className="text-red-400 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white/80">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    disabled={isSubmitting}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-cyan-glow text-navy-deep hover:bg-cyan-bright font-semibold py-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          )}

          {/* Login Link */}
          <p className="text-center text-white/60 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-glow hover:text-cyan-bright transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
