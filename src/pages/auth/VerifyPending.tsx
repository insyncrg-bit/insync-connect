import { useEffect, useRef, useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { Button } from "@/components/ui/button";
import inSyncLogo from "@/landing/assets/in-sync-logo.png";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { sessionManager } from "@/lib/session";
import { getSmartRedirectPath } from "@/lib/onboarding";

export const VerifyPending = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const state = location.state as { email?: string } | null;
  const initialEmail = state?.email || auth.currentUser?.email || "";

  const [email] = useState(initialEmail);
  const [verificationEmailSent, setVerificationEmailSent] = useState<boolean>(!!initialEmail);

  const verificationCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const authUnsubscribeRef = useRef<(() => void) | null>(null);

  const cleanupVerificationWatchers = () => {
    if (verificationCheckIntervalRef.current) {
      clearInterval(verificationCheckIntervalRef.current);
      verificationCheckIntervalRef.current = null;
    }
    if (authUnsubscribeRef.current) {
      authUnsubscribeRef.current();
      authUnsubscribeRef.current = null;
    }
  };

  const handleVerifiedUser = useCallback(
    async (user: any) => {
      try {
        const tokenResult = await user.getIdTokenResult();

        // Persist basic session info; role comes from claims if present
        sessionManager.save({
          email: user.email || email,
          userId: user.uid,
        });

        const path = await getSmartRedirectPath(user, tokenResult.claims);
        navigate(path, { replace: true });
      } catch (error) {
        console.error("[VerifyPending] Error handling verified user", error);
        toast({
          title: "Error",
          description: "Failed to complete sign-in after verification. Please sign in again.",
          variant: "destructive",
        });
        await auth.signOut().catch(() => {});
        sessionManager.clear();
        navigate("/login", { replace: true });
      }
    },
    [email, navigate, toast]
  );

  // Set up polling / auth state listener to detect when the user becomes verified
  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      // No authenticated user – send them back to login
      navigate("/login", { replace: true });
      return;
    }

    // If already verified (e.g. user came here after verifying), redirect immediately
    if (user.emailVerified) {
      handleVerifiedUser(user);
      return;
    }

    authUnsubscribeRef.current = onAuthStateChanged(auth, async (changedUser) => {
      if (!changedUser) return;

      try {
        await changedUser.reload();

        if (changedUser.emailVerified) {
          cleanupVerificationWatchers();
          await handleVerifiedUser(changedUser);
        }
      } catch (error) {
        console.error("[VerifyPending] Error in auth state change handler", error);
        toast({
          title: "Verification check failed",
          description: "We couldn't confirm your email. Please try again or refresh the page.",
          variant: "destructive",
        });
      }
    });

    verificationCheckIntervalRef.current = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        await currentUser.reload();

        if (currentUser.emailVerified) {
          cleanupVerificationWatchers();
          await handleVerifiedUser(currentUser);
        }
      } catch (error) {
        console.error("[VerifyPending] Error in verification polling", error);
        toast({
          title: "Verification check failed",
          description: "We couldn't confirm your email. Please try again or refresh the page.",
          variant: "destructive",
        });
      }
    }, 2000);

    return () => {
      cleanupVerificationWatchers();
    };
  }, [handleVerifiedUser, navigate, toast]);

  const handleResendVerification = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        title: "Error",
        description: "No user found. Please try signing in again.",
        variant: "destructive",
      });
      navigate("/login", { replace: true });
      return;
    }

    try {
      await sendEmailVerification(currentUser, {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: true,
      });
      setVerificationEmailSent(true);
      toast({
        title: "Verification email resent",
        description: "Please check your email (including spam folder) for the verification link.",
      });
    } catch (error: any) {
      console.error("[VerifyPending] Error resending verification email", error);
      let errorMessage = "Failed to resend verification email. Please try again.";

      if (error?.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please wait a few minutes before requesting another email.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleCancel = async () => {
    cleanupVerificationWatchers();
    await auth.signOut().catch(() => {});
    sessionManager.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-glow/5 blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-glow/5 blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link to="/landing" className="block mb-6">
          <div className="relative">
            <div
              className="absolute inset-0 blur-[60px] animate-pulse"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(6,182,212,0.4) 0%, rgba(6,182,212,0.2) 40%, transparent 70%)",
              }}
            />
            <img
              src={inSyncLogo}
              alt="InSync"
              className="relative h-40 w-auto max-w-[500px] mx-auto"
              style={{
                filter:
                  "drop-shadow(0 0 30px rgba(6,182,212,0.5)) drop-shadow(0 0 60px rgba(6,182,212,0.3))",
              }}
            />
          </div>
        </Link>

        {/* Card */}
        <div className="bg-navy-card border border-white/10 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Verify your email (Check Spam folder)</h1>
            <p className="text-white/60">
<<<<<<< HEAD
              Please check your spam folder and click the verification link. We'll automatically proceed once you&apos;re
              verified.
=======
              Please check your email and click the verification link. If you don&apos;t see it, check your spam and
              junk folders. We&apos;ll automatically proceed once you&apos;re verified.
>>>>>>> a9e9751 (added junk email disclaimer)
            </p>
          </div>

          <div className="space-y-5">
            <div className="bg-cyan-glow/10 border border-cyan-glow/30 rounded-lg p-6 text-center">
              <div className="mb-4">
                <Mail className="h-12 w-12 text-cyan-glow mx-auto mb-3" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Verification email sent</h3>
              {email && (
                <p className="text-white/70 text-sm mb-2">
                  We&apos;ve sent a verification link to <strong>{email}</strong>
                </p>
              )}
              <p className="text-white/60 text-sm mb-4">
                Click the link in the email to verify your account. Can&apos;t find it? Check your spam and junk
                folders. This page will update automatically once you&apos;re verified.
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
                {verificationEmailSent ? "Resend verification email" : "Send verification email"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel and go back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPending;

