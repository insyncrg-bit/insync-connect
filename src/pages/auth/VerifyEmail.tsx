import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { applyActionCode, checkActionCode } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import inSyncLogo from "@/landing/assets/in-sync-logo.png";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

/**
 * Email verification page. User lands here from the email link with oobCode in the URL.
 * Verifies the email using Firebase applyActionCode, then redirects to login.
 */
export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");

  const [status, setStatus] = useState<"verifying" | "success" | "error" | "invalid">("verifying");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const startVerification = async (user: any) => {
      try {
        // If the user exists, check if they are already verified
        if (user) {
          await user.reload();
          if (user.emailVerified) {
            console.log("VerifyEmail: User already verified session, skipping applyActionCode");
            setStatus("success");
            setTimeout(() => navigate("/select-role", { replace: true }), 1500);
            return;
          }
        }

        // Check if this is an email verification action
        if (mode !== "verifyEmail" || !oobCode) {
          setStatus("invalid");
          return;
        }

        // First verify the code is valid
        try {
          await checkActionCode(auth, oobCode);
        } catch (checkError: any) {
          // Final check if they became verified while we were waiting
          const currentUser = auth.currentUser;
          if (currentUser) {
            await currentUser.reload();
            if (currentUser.emailVerified) {
              console.log("VerifyEmail: Code used/invalid but user is verified. Continuing.");
              setStatus("success");
              setTimeout(() => navigate("/select-role", { replace: true }), 1500);
              return;
            }
          }
          throw checkError;
        }
        
        // Apply the verification
        await applyActionCode(auth, oobCode);
        
        setStatus("success");
        toast({
          title: "Email verified!",
          description: "Your email has been successfully verified. You can now sign in.",
        });
        
        // Redirect to after a short delay
        setTimeout(() => {
          navigate("/select-role", { replace: true });
        }, 2000);
      } catch (error: unknown) {
        const message = error && typeof (error as { message?: string }).message === "string"
          ? (error as { message: string }).message
          : "Failed to verify email. The link may have expired.";
        
        // Handle specific Firebase errors
        let errorMsg = message;
        if (error && typeof error === "object" && "code" in error) {
          const code = (error as { code: string }).code;
          if (code === "auth/expired-action-code") {
            errorMsg = "This verification link has expired. Please request a new one.";
          } else if (code === "auth/invalid-action-code") {
            errorMsg = "This verification link is invalid or has already been used.";
          } else if (code === "auth/user-disabled") {
            errorMsg = "This account has been disabled.";
          }
        }
        
        setErrorMessage(errorMsg);
        setStatus("error");
        toast({
          title: "Verification failed",
          description: errorMsg,
          variant: "destructive",
        });
      }
    };

    // We wait for auth state to be resolved (even if null) before starting
    const unsubscribe = auth.onAuthStateChanged((user) => {
      startVerification(user);
      unsubscribe(); // Only need to trigger once
    });

    return () => unsubscribe();
  }, [oobCode, mode, navigate, toast]);

  if (status === "invalid") {
    return (
      <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center p-6">
        <img src={inSyncLogo} alt="InSync" className="h-40 mb-8" />
        <div className="text-center max-w-md">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">Invalid verification link</h1>
          <p className="text-white/70 mb-6">
            This verification link is invalid or missing required parameters. Please check your email for the correct link.
          </p>
          <Button asChild variant="outline" className="border-cyan-glow/50 text-cyan-glow">
            <Link to="/select-role">Continue to App</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center p-6">
        <img src={inSyncLogo} alt="InSync" className="h-40 mb-8" />
        <div className="text-center max-w-md">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">Verification failed</h1>
          <p className="text-white/70 mb-6">{errorMessage}</p>
          <div className="flex flex-col gap-3">
            <Button asChild variant="outline" className="border-cyan-glow/50 text-cyan-glow">
              <Link to="/select-role">Continue to App</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-white/70">
              <Link to="/signup">Create new account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center p-6">
        <img src={inSyncLogo} alt="InSync" className="h-40 mb-8" />
        <div className="text-center max-w-md">
          <CheckCircle2 className="h-12 w-12 text-cyan-glow mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-white mb-2">Email verified!</h1>
          <p className="text-white/70 mb-6">
            Your email has been successfully verified. Redirecting you to login...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/50">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Redirecting...</span>
          </div>
        </div>
      </div>
    );
  }

  // status === "verifying"
  return (
    <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center p-6">
      <img src={inSyncLogo} alt="InSync" className="h-40 mb-8" />
      <div className="text-center max-w-md">
        <Loader2 className="h-12 w-12 text-cyan-glow mx-auto mb-4 animate-spin" />
        <h1 className="text-xl font-semibold text-white mb-2">Verifying your email...</h1>
        <p className="text-white/70">Please wait while we verify your email address.</p>
      </div>
    </div>
  );
}
