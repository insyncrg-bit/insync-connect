import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, ArrowLeft } from "lucide-react";
import inSyncLogo from "@/landing/assets/in-sync-logo.png";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

/**
 * Reset password page. User lands here from the email link with oobCode in the URL.
 * Submits new password via Firebase confirmPasswordReset, then redirects to reset-password-success.
 */
export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const oobCode = searchParams.get("oobCode");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  useEffect(() => {
    if (!oobCode) setInvalidLink(true);
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;
    const err: Record<string, string> = {};
    if (!password.trim()) err.password = "Password is required";
    else if (password.length < 6) err.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) err.confirmPassword = "Passwords do not match";
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setIsLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      navigate("/reset-password-success", { replace: true });
    } catch (error: unknown) {
      const message = error && typeof (error as { message?: string }).message === "string"
        ? (error as { message: string }).message
        : "Failed to reset password. The link may have expired.";
      toast({ title: "Error", description: message, variant: "destructive" });
      setErrors({ password: message });
    } finally {
      setIsLoading(false);
    }
  };

  if (invalidLink) {
    return (
      <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center p-6">
        <img src={inSyncLogo} alt="InSync" className="h-40 mb-8" />
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold text-white mb-2">Invalid or expired link</h1>
          <p className="text-white/70 mb-6">This password reset link is invalid or has expired. Please request a new one from the login page.</p>
          <Button asChild variant="outline" className="border-cyan-glow/50 text-cyan-glow">
            <Link to="/forgot-password">Request new link</Link>
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
          <h1 className="text-xl font-semibold text-white mb-2">Set new password</h1>
          <p className="text-white/70">Enter your new password below.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/90">New password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>
            {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white/90">Confirm password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-9 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-400">{errors.confirmPassword}</p>}
          </div>
          <Button
            type="submit"
            className="w-full bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/50 hover:bg-cyan-glow/30"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset password"}
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
