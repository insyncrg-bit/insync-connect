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

const applicationSchema = z.object({
  contactName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  firmName: z.string().trim().min(2, "Firm name required").max(100),
  website: z.string().trim().url("Invalid URL").optional().or(z.literal("")),
  firmType: z.string().min(1, "Please select firm type"),
  checkSize: z.string().min(1, "Please select check size"),
  investmentStage: z.string().min(1, "Please select investment stage"),
  investmentThesis: z.string().trim().min(50, "Please provide at least 50 characters").max(1000),
  portfolio: z.string().trim().min(20, "Please provide portfolio examples").max(500),
  whyPartner: z.string().trim().min(20, "Please describe why you want to partner").max(500),
});

export default function InvestorApplication() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    contactName: "",
    email: "",
    firmName: "",
    website: "",
    firmType: "",
    checkSize: "",
    investmentStage: "",
    investmentThesis: "",
    portfolio: "",
    whyPartner: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validated = applicationSchema.parse(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Application Submitted!",
        description: "We'll review your partnership request and get back to you within 48 hours.",
      });
      
      navigate("/platform");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
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
        <div className="absolute top-0 right-0 w-[600px] h-[600px] border border-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] border border-white/15 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/4 w-2 h-40 bg-gradient-to-b from-white/30 to-transparent blur-sm" />
        <div className="absolute bottom-1/4 right-1/3 w-40 h-2 bg-gradient-to-r from-white/30 to-transparent blur-sm" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[hsl(var(--navy-deep))]/80 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/platform")}
              className="gap-2 text-white hover:text-white/80 hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Platform
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
              <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium text-white">
                Investor Partnership Application
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                Become a Partner
              </h1>
              <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                Access curated dealflow from Boston's most promising startups
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-10 space-y-10 shadow-2xl">
              {/* Contact Info */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Contact Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Full Name *</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => handleChange("contactName", e.target.value)}
                      placeholder="Jane Smith"
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
                      placeholder="jane@vcfirm.com"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Firm Info */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Firm Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firmName">Firm Name *</Label>
                    <Input
                      id="firmName"
                      value={formData.firmName}
                      onChange={(e) => handleChange("firmName", e.target.value)}
                      placeholder="Your VC Firm"
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
                      placeholder="https://yourfirm.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firmType">Firm Type *</Label>
                    <Select value={formData.firmType} onValueChange={(value) => handleChange("firmType", value)}>
                      <SelectTrigger id="firmType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vc">Venture Capital</SelectItem>
                        <SelectItem value="angel">Angel Group</SelectItem>
                        <SelectItem value="family-office">Family Office</SelectItem>
                        <SelectItem value="corporate">Corporate VC</SelectItem>
                        <SelectItem value="accelerator">Accelerator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkSize">Typical Check Size *</Label>
                    <Select value={formData.checkSize} onValueChange={(value) => handleChange("checkSize", value)}>
                      <SelectTrigger id="checkSize">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25k-100k">$25K - $100K</SelectItem>
                        <SelectItem value="100k-250k">$100K - $250K</SelectItem>
                        <SelectItem value="250k-500k">$250K - $500K</SelectItem>
                        <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                        <SelectItem value="1m-plus">$1M+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="investmentStage">Investment Stage *</Label>
                    <Select value={formData.investmentStage} onValueChange={(value) => handleChange("investmentStage", value)}>
                      <SelectTrigger id="investmentStage">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                        <SelectItem value="seed">Seed</SelectItem>
                        <SelectItem value="series-a">Series A</SelectItem>
                        <SelectItem value="series-b-plus">Series B+</SelectItem>
                        <SelectItem value="stage-agnostic">Stage Agnostic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Investment Details */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Investment Details</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="investmentThesis">Investment Thesis * (min 50 characters)</Label>
                  <Textarea
                    id="investmentThesis"
                    value={formData.investmentThesis}
                    onChange={(e) => handleChange("investmentThesis", e.target.value)}
                    placeholder="Describe your investment focus, sectors of interest, and what you look for in startups..."
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{formData.investmentThesis.length}/1000</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio Examples * (min 20 characters)</Label>
                  <Textarea
                    id="portfolio"
                    value={formData.portfolio}
                    onChange={(e) => handleChange("portfolio", e.target.value)}
                    placeholder="List 3-5 notable portfolio companies or past investments..."
                    rows={3}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{formData.portfolio.length}/500</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whyPartner">Why Partner with In-Sync? * (min 20 characters)</Label>
                  <Textarea
                    id="whyPartner"
                    value={formData.whyPartner}
                    onChange={(e) => handleChange("whyPartner", e.target.value)}
                    placeholder="What are you looking to gain from this partnership?"
                    rows={3}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{formData.whyPartner.length}/500</p>
                </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Supporting Materials (Optional)</h2>
                <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center space-y-4 hover:border-white/50 transition-colors">
                  <Upload className="h-12 w-12 mx-auto text-[hsl(var(--navy-deep))]/60" />
                  <div>
                    <p className="text-sm font-semibold text-[hsl(var(--navy-deep))]">Upload firm deck or one-pager</p>
                    <p className="text-xs text-[hsl(var(--navy-deep))]/60">PDF, PPTX up to 10MB</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" className="border-white/40 text-[hsl(var(--navy-deep))] hover:bg-white/10">
                    Choose File
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 bg-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/90 text-white border-2 border-white/30 shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all text-lg py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Partnership Application"}
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
