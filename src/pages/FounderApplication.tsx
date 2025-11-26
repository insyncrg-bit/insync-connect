import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const applicationSchema = z.object({
  founderName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  companyName: z.string().trim().min(2, "Company name required").max(100),
  website: z.string().trim().url("Invalid URL").optional().or(z.literal("")),
  vertical: z.string().min(1, "Please select a vertical"),
  stage: z.string().min(1, "Please select a stage"),
  location: z.string().trim().min(2, "Location required").max(100),
  fundingGoal: z.string().trim().min(1, "Funding goal required").max(50),
  businessModel: z.string().trim().min(50, "Please provide at least 50 characters").max(1000),
  traction: z.string().trim().min(50, "Please provide at least 50 characters").max(1000),
  currentAsk: z.string().trim().min(20, "Please describe your current needs").max(500),
});

export default function FounderApplication() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    founderName: "",
    email: "",
    companyName: "",
    website: "",
    vertical: "",
    stage: "",
    location: "",
    fundingGoal: "",
    businessModel: "",
    traction: "",
    currentAsk: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validated = applicationSchema.parse(formData);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to submit your application.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      // Save application to database
      const { error: insertError } = await supabase
        .from("founder_applications")
        .insert({
          user_id: user.id,
          founder_name: validated.founderName,
          email: validated.email,
          company_name: validated.companyName,
          website: validated.website || null,
          vertical: validated.vertical,
          stage: validated.stage,
          location: validated.location,
          funding_goal: validated.fundingGoal,
          business_model: validated.businessModel,
          traction: validated.traction,
          current_ask: validated.currentAsk,
          status: 'pending'
        });

      if (insertError) throw insertError;
      
      toast({
        title: "Application Submitted!",
        description: "Welcome to the ecosystem! Explore your dashboard.",
      });
      
      navigate("/founder-dashboard");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Submission Error",
          description: "Failed to submit application. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--gradient-navy-teal)' }}>
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] border border-[hsl(var(--cyan-glow))]/30 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] border border-[hsl(var(--cyan-glow))]/20 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/4 w-2 h-40 bg-gradient-to-b from-[hsl(var(--cyan-glow))]/40 to-transparent blur-sm" />
        <div className="absolute bottom-1/4 right-1/3 w-40 h-2 bg-gradient-to-r from-[hsl(var(--cyan-glow))]/40 to-transparent blur-sm" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[hsl(var(--navy-deep))]/80 backdrop-blur-lg border-b border-[hsl(var(--cyan-glow))]/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2 text-white hover:text-[hsl(var(--cyan-glow))] hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg" />
              <span className="text-xl font-bold text-white">In-Sync</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-16 relative z-10">
        <div className="container max-w-3xl mx-auto px-4 md:px-6">
          <div className="space-y-12">
            {/* Header Section */}
            <div className="text-center space-y-6">
              <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/30 rounded-full text-sm font-medium text-[hsl(var(--cyan-glow))]">
                Founder Application
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                Join the Ecosystem
              </h1>
              <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                Connect with precision-matched investors and accelerate your startup journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm border-2 border-[hsl(var(--cyan-glow))]/20 rounded-2xl p-10 space-y-10 shadow-2xl">
              {/* Founder Info */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Founder Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="founderName">Full Name *</Label>
                    <Input
                      id="founderName"
                      value={formData.founderName}
                      onChange={(e) => handleChange("founderName", e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="john@startup.com"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Company Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleChange("companyName", e.target.value)}
                      placeholder="Your Startup Inc."
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleChange("website", e.target.value)}
                      placeholder="https://yourstartup.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="vertical">Vertical *</Label>
                    <Select value={formData.vertical} onValueChange={(value) => handleChange("vertical", value)}>
                      <SelectTrigger id="vertical">
                        <SelectValue placeholder="Select vertical" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ai-ml">AI/ML</SelectItem>
                        <SelectItem value="fintech">FinTech</SelectItem>
                        <SelectItem value="healthtech">HealthTech</SelectItem>
                        <SelectItem value="climate">Climate Tech</SelectItem>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="hardware">Hardware</SelectItem>
                        <SelectItem value="biotech">BioTech</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage *</Label>
                    <Select value={formData.stage} onValueChange={(value) => handleChange("stage", value)}>
                      <SelectTrigger id="stage">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                        <SelectItem value="seed">Seed</SelectItem>
                        <SelectItem value="series-a">Series A</SelectItem>
                        <SelectItem value="series-b">Series B+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder="Boston, MA"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fundingGoal">Funding Goal *</Label>
                  <Input
                    id="fundingGoal"
                    value={formData.fundingGoal}
                    onChange={(e) => handleChange("fundingGoal", e.target.value)}
                    placeholder="e.g., $2M seed round"
                    required
                  />
                </div>
              </div>

              {/* Business Details */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Business Details</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="businessModel">Business Model & Value Proposition * (min 50 characters)</Label>
                  <Textarea
                    id="businessModel"
                    value={formData.businessModel}
                    onChange={(e) => handleChange("businessModel", e.target.value)}
                    placeholder="Describe your business model, target market, and unique value proposition..."
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{formData.businessModel.length}/1000</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="traction">Traction & Milestones * (min 50 characters)</Label>
                  <Textarea
                    id="traction"
                    value={formData.traction}
                    onChange={(e) => handleChange("traction", e.target.value)}
                    placeholder="Share key metrics, revenue, users, partnerships, or other traction indicators..."
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{formData.traction.length}/1000</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentAsk">Current Ask * (min 20 characters)</Label>
                  <Textarea
                    id="currentAsk"
                    value={formData.currentAsk}
                    onChange={(e) => handleChange("currentAsk", e.target.value)}
                    placeholder="What are you looking for right now? (funding, pilot customers, advisors, etc.)"
                    rows={3}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{formData.currentAsk.length}/500</p>
                </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Supporting Materials (Optional)</h2>
                <div className="border-2 border-dashed border-[hsl(var(--cyan-glow))]/30 rounded-xl p-8 text-center space-y-4 hover:border-[hsl(var(--cyan-glow))]/50 transition-colors">
                  <Upload className="h-12 w-12 mx-auto text-[hsl(var(--navy-deep))]/60" />
                  <div>
                    <p className="text-sm font-semibold text-[hsl(var(--navy-deep))]">Upload pitch deck or one-pager</p>
                    <p className="text-xs text-[hsl(var(--navy-deep))]/60">PDF, PPTX up to 10MB</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" className="border-[hsl(var(--cyan-glow))]/40 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-glow))]/10">
                    Choose File
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 bg-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/90 text-white border-2 border-[hsl(var(--cyan-glow))]/30 shadow-lg hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all text-lg py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>

              <p className="text-xs text-[hsl(var(--navy-deep))]/60 text-center">
                By submitting, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
