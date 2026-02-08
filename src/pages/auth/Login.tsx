import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import inSyncLogo from "@/landing/assets/in-sync-logo.png";

type LoginStep = "email" | "password";

// API function to check if email exists (to be implemented later)
const checkEmailExists = async (email: string): Promise<boolean> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
  // const data = await response.json();
  // return data.exists;
  
  // Mock implementation for now
  await new Promise((resolve) => setTimeout(resolve, 500));
  return false; // Default to false (email doesn't exist) until API is implemented
};

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state (if redirected from signup)
  const initialEmail = (location.state as { email?: string })?.email || "";
  
  const [step, setStep] = useState<LoginStep>(initialEmail ? "password" : "email");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

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
      const emailExists = await checkEmailExists(email);
      
      if (emailExists) {
        // Email exists, proceed to password step
        setStep("password");
      } else {
        // Email doesn't exist, redirect to signup with email pre-filled
        navigate("/signup", { state: { email } });
      }
    } catch (error) {
      console.error("Error checking email:", error);
      setErrors((prev) => ({
        ...prev,
        email: "An error occurred. Please try again.",
      }));
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(password)) {
      return;
    }

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, password: "" }));

    try {
      // TODO: Integrate with backend authentication
      // const response = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();
      
      console.log("Login submitted:", { email, password });
      
      // Check if user has incomplete VC onboarding
      const onboardingData = localStorage.getItem("vc_onboarding_data");
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        if (data.firmName && !data.submitted) {
          navigate("/vc-onboarding");
          return;
        }
      }
      
      // For now, navigate to home
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setErrors((prev) => ({
        ...prev,
        password: "Invalid email or password. Please try again.",
      }));
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
    setStep("email");
    setPassword("");
    setErrors({});
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
        <Link to="/" className="block mb-6">
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
              className="relative h-20 w-auto max-w-[400px] mx-auto"
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

          {step === "email" ? (
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
