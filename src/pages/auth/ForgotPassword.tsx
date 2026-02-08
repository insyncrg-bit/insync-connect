import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import inSyncLogo from "@/landing/assets/in-sync-logo.png";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

/**
 * Forgot password page. User enters email and receives password reset link.
 */
export function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get email from location state (if redirected from login)
  const initialEmail = (location.state as { email?: string })?.email || "";
  
  const [email, setEmail] = useState(initialEmail);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    
    if (!email.trim()) {
      err.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.email = "Please enter a valid email address";
    }
    
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase(), {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: false,
      });
      setEmailSent(true);
      toast({
        title: "Reset link sent",
        description: "Please check your email for the password reset link.",
      });
    } catch (error: unknown) {
      const message = error && typeof (error as { message?: string }).message === "string"
        ? (error as { message: string }).message
        : "Failed to send reset email. Please try again.";
      
      // Handle specific Firebase errors
      let errorMessage = message;
      if (error && typeof error === "object" && "code" in error) {
        const code = (error as { code: string }).code;
        if (code === "auth/user-not-found") {
          errorMessage = "No account found with this email address.";
        } else if (code === "auth/invalid-email") {
          errorMessage = "Invalid email address.";
        } else if (code === "auth/too-many-requests") {
          errorMessage = "Too many requests. Please try again later.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setErrors({ email: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center p-6">
        <img src={inSyncLogo} alt="InSync" className="h-40 mb-8" />
        <div className="w-full max-w-md space-y-6">
          <div className="bg-cyan-glow/10 border border-cyan-glow/30 rounded-lg p-6 text-center">
            <div className="mb-4">
              <CheckCircle2 className="h-12 w-12 text-cyan-glow mx-auto mb-3" />
            </div>
            <h1 className="text-xl font-semibold text-white mb-2">
              Reset link sent!
            </h1>
            <p className="text-white/70 mb-2">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-white/60 text-sm">
              Please check your email and click the link to reset your password.
            </p>
          </div>
          <Button asChild variant="outline" className="w-full border-cyan-glow/50 text-cyan-glow">
            <Link to="/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center p-6">
      <img src={inSyncLogo} alt="InSync" className="h-40 mb-8" />
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-white mb-2">Forgot password?</h1>
          <p className="text-white/70">Enter your email address and we'll send you a link to reset your password.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/90">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-cyan-glow focus:ring-cyan-glow/20"
                autoComplete="email"
                autoFocus
                disabled={isLoading}
              />
            </div>
            {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
          </div>
          <Button
            type="submit"
            className="w-full bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/50 hover:bg-cyan-glow/30"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
        <Button asChild variant="ghost" size="sm" className="text-white/70 w-full">
          <Link to="/login" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        </Button>
      </div>
    </div>
  );
}
