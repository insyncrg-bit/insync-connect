import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Mail, Lock, Loader2, User, Building2, Briefcase, Linkedin } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

export default function AnalystAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mode: "login" for returning users, "register" for new analysts
  const [mode, setMode] = useState<"login" | "register">("login");
  
  // Login fields (returning analysts)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration fields (new analysts)
  const [name, setName] = useState("");
  const [firm, setFirm] = useState("");
  const [title, setTitle] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  // Simple hash function for password comparison
  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  // Handle login for returning analysts
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      // Try to sign in with email and password
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message?.includes("Invalid login credentials")) {
          toast({
            title: "Invalid Credentials",
            description: "Email or password is incorrect. If you're a new analyst, click 'Create Account' below.",
            variant: "destructive",
          });
        } else {
          throw signInError;
        }
        setIsLoading(false);
        return;
      }

      const user = signInData.user;
      
      // Check if user has an analyst profile
      const { data: analystProfile } = await supabase
        .from("analyst_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (analystProfile) {
        toast({
          title: "Welcome back!",
          description: `Signed in as ${analystProfile.name} from ${analystProfile.firm_name}`,
        });
        navigate("/analyst-dashboard");
      } else {
        // User exists but no analyst profile - check if they're a founder
        const { data: founderApp } = await supabase
          .from("founder_applications")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (founderApp) {
          toast({
            title: "Founder Account",
            description: "This email is registered as a founder. Redirecting to founder dashboard.",
          });
          navigate("/founder-dashboard");
        } else {
          // No profile at all - they need to register as analyst
          toast({
            title: "No Analyst Profile",
            description: "Please create an analyst account first.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          setMode("register");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration for new analysts
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!name.trim() || !firm.trim() || !title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      passwordSchema.parse(companyPassword);
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
      // Verify that the firm exists and the company password matches
      console.log("Looking up firm:", firm.trim());
      const { data: investorApps, error: firmError } = await supabase
        .from("investor_applications")
        .select("id, firm_name, company_password_hash")
        .ilike("firm_name", firm.trim());

      console.log("Firm lookup result:", { investorApps, firmError });

      if (firmError) {
        console.error("Firm lookup error:", firmError);
        throw firmError;
      }

      if (!investorApps || investorApps.length === 0) {
        toast({
          title: "Firm Not Found",
          description: "This firm has not registered with In-Sync. Please check the firm name or ask your firm to apply first.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Hash the entered company password and compare
      const hashedCompanyPassword = await hashPassword(companyPassword);
      const matchingFirm = investorApps.find(app => app.company_password_hash === hashedCompanyPassword);

      if (!matchingFirm) {
        toast({
          title: "Invalid Company Password",
          description: "The company password is incorrect. Please check with your firm administrator.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Create new user account with their personal password
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password, // This is their personal password for future logins
        options: {
          emailRedirectTo: `${window.location.origin}/analyst-dashboard`,
          data: {
            full_name: name,
            is_analyst: true,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message?.includes("User already registered")) {
          toast({
            title: "Account Exists",
            description: "This email is already registered. Try logging in instead.",
            variant: "destructive",
          });
          setMode("login");
        } else {
          throw signUpError;
        }
        setIsLoading(false);
        return;
      }

      const user = signUpData.user;
      if (!user) {
        toast({
          title: "Error",
          description: "Failed to create account. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Create analyst profile
      const { error: profileError } = await supabase
        .from("analyst_profiles")
        .insert({
          user_id: user.id,
          firm_id: matchingFirm.id,
          name: name.trim(),
          title: title.trim(),
          firm_name: matchingFirm.firm_name,
          email: email.trim(),
          linkedin_url: linkedin.trim() || null,
          profile_completed: false,
        });

      if (profileError) {
        console.error("Error creating analyst profile:", profileError);
      }

      toast({
        title: "Welcome to In-Sync!",
        description: "Your analyst account has been created. You can now log in with your email and personal password.",
      });
      navigate("/analyst-dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Error",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--gradient-navy-teal)" }}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] border border-[hsl(var(--cyan-glow))]/30 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] border border-[hsl(var(--cyan-glow))]/20 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <Navigation />

      <div className="relative z-10 flex items-center justify-center min-h-screen pt-20 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm border-2 border-[hsl(var(--cyan-glow))]/20 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">
                {mode === "login" ? "VC Analyst Login" : "Create Analyst Account"}
              </h1>
              <p className="text-muted-foreground mt-2">
                {mode === "login" 
                  ? "Sign in to access your analyst dashboard" 
                  : "Register as a new analyst for your firm"}
              </p>
            </div>

            {mode === "login" ? (
              // LOGIN FORM (returning analysts)
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[hsl(var(--navy-deep))]">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@firm.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[hsl(var(--navy-deep))]">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Sign In
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>New analyst?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-[hsl(var(--cyan-glow))] hover:underline font-medium"
                    >
                      Create Account
                    </button>
                  </p>
                </div>

                {/* Demo Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/analyst-dashboard?demo=true")}
                  className="w-full h-12 border-[hsl(var(--cyan-glow))]/40 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-glow))]/10"
                >
                  View Demo Dashboard
                </Button>
              </form>
            ) : (
              // REGISTRATION FORM (new analysts)
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[hsl(var(--navy-deep))]">Your Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firm" className="text-[hsl(var(--navy-deep))]">Firm *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="firm"
                      type="text"
                      placeholder="Your VC firm name"
                      value={firm}
                      onChange={(e) => setFirm(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[hsl(var(--navy-deep))]">Title *</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="title"
                      type="text"
                      placeholder="e.g. Associate, Analyst, Principal"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-[hsl(var(--navy-deep))]">LinkedIn Profile</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-[hsl(var(--navy-deep))]">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="you@firm.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyPassword" className="text-[hsl(var(--navy-deep))]">Company Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="companyPassword"
                      type="password"
                      placeholder="••••••••"
                      value={companyPassword}
                      onChange={(e) => setCompanyPassword(e.target.value)}
                      className="pl-10 h-12"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get this from your firm administrator
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personalPassword" className="text-[hsl(var(--navy-deep))]">Create Your Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="personalPassword"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is your personal password for future logins (min 6 characters)
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Create Account
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-[hsl(var(--cyan-glow))] hover:underline font-medium"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* Link to regular auth */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Not an analyst?{" "}
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="text-[hsl(var(--cyan-glow))] hover:underline font-medium"
              >
                Sign in as founder/investor
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
