import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    // DISCONNECTED: API calls disabled - demo mode
    setIsCheckingSession(false);

    /* ORIGINAL API CALLS - DISCONNECTED
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setTimeout(() => {
            checkApplicationAndRedirect(session.user.id);
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkApplicationAndRedirect(session.user.id);
      } else {
        setIsCheckingSession(false);
      }
    });

    return () => subscription.unsubscribe();
    */
  }, []);

  const checkApplicationAndRedirect = async (userId: string) => {
    try {
      const { data: application, error } = await supabase
        .from("founder_applications")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error checking application:", error);
        navigate("/founder-application");
        return;
      }

      if (application) {
        navigate("/founder-dashboard");
      } else {
        navigate("/founder-application");
      }
    } catch (error) {
      console.error("Error in redirect:", error);
      navigate("/founder-application");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    // DISCONNECTED: API calls disabled - redirect to demo dashboard
    toast({
      title: "Demo Mode",
      description: "Redirecting to demo founder dashboard...",
    });
    setTimeout(() => {
      navigate("/founder-dashboard");
    }, 1000);

    /* ORIGINAL API CALLS - DISCONNECTED
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      let message = "An error occurred during authentication.";
      if (error.message?.includes("Invalid login credentials")) {
        message = "Invalid email or password. If you haven't created an account yet, please apply first.";
      } else if (error.message) {
        message = error.message;
      }

      toast({
        title: "Authentication Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    */
  };

  const handleGoogleLogin = async () => {
    // DISCONNECTED: API calls disabled - redirect to demo dashboard
    toast({
      title: "Demo Mode",
      description: "Redirecting to demo founder dashboard...",
    });
    setTimeout(() => {
      navigate("/founder-dashboard");
    }, 1000);

    /* ORIGINAL API CALLS - DISCONNECTED
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google Login Error",
        description: error.message || "Failed to initiate Google login.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
    */
  };

  const handleMicrosoftLogin = async () => {
    // DISCONNECTED: API calls disabled - redirect to demo dashboard
    toast({
      title: "Demo Mode",
      description: "Redirecting to demo founder dashboard...",
    });
    setTimeout(() => {
      navigate("/founder-dashboard");
    }, 1000);

    /* ORIGINAL API CALLS - DISCONNECTED
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "azure",
        options: {
          redirectTo: `${window.location.origin}/auth`,
          scopes: "email profile openid",
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Microsoft Login Error",
        description: error.message || "Failed to initiate Microsoft login.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
    */
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[hsl(var(--midnight-base))] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--cyan-glow))]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--midnight-base))] relative overflow-hidden">
      <Navigation />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--cyan-glow))]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--electric-purple))]/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-20">
        <div className="w-full max-w-md">
          <div className="bg-[hsl(var(--midnight-lighter))]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Access My Dashboard
              </h1>
              <p className="text-gray-400">
                Sign in to continue to your dashboard
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 bg-white/5 border-white/20 hover:bg-white/10 text-white"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 bg-white/5 border-white/20 hover:bg-white/10 text-white"
                onClick={handleMicrosoftLogin}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z" />
                  <path fill="#00A4EF" d="M1 13h10v10H1z" />
                  <path fill="#7FBA00" d="M13 1h10v10H13z" />
                  <path fill="#FFB900" d="M13 13h10v10H13z" />
                </svg>
                Continue with Microsoft
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[hsl(var(--midnight-lighter))] text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-[hsl(var(--cyan-glow))] to-[hsl(var(--electric-purple))] hover:opacity-90 text-white font-semibold"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : null}
                Sign In
              </Button>
            </form>

            {/* Link to apply */}
            <p className="mt-6 text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-[hsl(var(--cyan-glow))] hover:underline font-medium"
              >
                Apply as a founder/investor
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}