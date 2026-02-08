import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import inSyncLogo from "@/landing/assets/in-sync-logo.png";

/**
 * Reset password success page. Shown after user successfully resets their password.
 */
export function ResetPasswordSuccess() {
  return (
    <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center p-6">
      <img src={inSyncLogo} alt="InSync" className="h-40 mb-8" />
      <div className="w-full max-w-md space-y-6">
        <div className="bg-cyan-glow/10 border border-cyan-glow/30 rounded-lg p-6 text-center">
          <div className="mb-4">
            <CheckCircle2 className="h-12 w-12 text-cyan-glow mx-auto mb-3" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">
            Password reset successful!
          </h1>
          <p className="text-white/70 mb-2">
            Your password has been successfully reset.
          </p>
          <p className="text-white/60 text-sm">
            You can now sign in with your new password.
          </p>
        </div>
        <Button asChild className="w-full bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/50 hover:bg-cyan-glow/30">
          <Link to="/login" className="flex items-center justify-center gap-2">
            Go to Login <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
