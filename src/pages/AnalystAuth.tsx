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
  const [name, setName] = useState("");
  const [firm, setFirm] = useState("");
  const [title, setTitle] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!name.trim() || !firm.trim() || !title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

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
      // First, verify that the firm exists and the company password matches
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
        console.log("No firms found matching:", firm.trim());
        toast({
          title: "Firm Not Found",
          description: "This firm has not registered with In-Sync. Please check the firm name or ask your firm to apply first.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Hash the entered password and compare
      const hashedPassword = await hashPassword(password);
      const matchingFirm = investorApps.find(app => app.company_password_hash === hashedPassword);

      if (!matchingFirm) {
        toast({
          title: "Invalid Password",
          description: "The company password is incorrect. Please check with your firm administrator.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Check if user already exists - try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // User doesn't exist, create new account
        if (signInError.message?.includes("Invalid login credentials")) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
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
                description: "This email is already registered. If you forgot your password, please contact support.",
                variant: "destructive",
              });
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
            description: "Your analyst account has been created.",
          });
          navigate("/analyst-dashboard");
        } else {
          throw signInError;
        }
      } else {
        // User exists, verify they have an analyst profile for this firm
        const user = signInData.user;
        
        const { data: existingProfile } = await supabase
          .from("analyst_profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!existingProfile) {
          // Create analyst profile for existing user
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

          if (profileError && !profileError.message?.includes("duplicate")) {
            console.error("Error creating analyst profile:", profileError);
          }
        }

        toast({
          title: "Welcome back!",
          description: `Signed in as ${name} from ${matchingFirm.firm_name}`,
        });
        navigate("/analyst-dashboard");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication.",
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
                VC Analyst Login
              </h1>
              <p className="text-muted-foreground mt-2">
                Sign in to access your analyst dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[hsl(var(--navy-deep))]">Your Name</Label>
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

              {/* Firm Field */}
              <div className="space-y-2">
                <Label htmlFor="firm" className="text-[hsl(var(--navy-deep))]">Firm</Label>
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

              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[hsl(var(--navy-deep))]">Title</Label>
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

              {/* LinkedIn Field */}
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
                <Label htmlFor="email" className="text-[hsl(var(--navy-deep))]">Email (company email)</Label>
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

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[hsl(var(--navy-deep))]">Password (your company password)</Label>
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
                <p className="text-xs text-muted-foreground">
                  Use the company password your firm created during registration
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
                Sign In
              </Button>

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
