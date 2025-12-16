import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Trash2, Upload, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

// Word count helper
const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

// Team member type
interface TeamMember {
  name: string;
  role: string;
  linkedin: string;
  background: string;
}

// Competitor type
interface Competitor {
  name: string;
  description: string;
  howYouDiffer: string;
}

export default function FounderApplication() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionErrors, setSectionErrors] = useState<string[]>([]);

  // Basic company info
  const [basicInfo, setBasicInfo] = useState({
    companyName: "",
    website: "",
    linkedIn: "",
    vertical: "",
    stage: "",
    location: "",
  });
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Section 1 - Company Overview & Team
  const [companyOverview, setCompanyOverview] = useState("");
  const [founderName, setFounderName] = useState("");
  const [founderEmail, setFounderEmail] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ name: "", role: "", linkedin: "", background: "" }]);

  // Section 2 - The Problem
  const [currentPainPoint, setCurrentPainPoint] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [valueDrivers, setValueDrivers] = useState<string[]>([]);
  const [severityUrgency, setSeverityUrgency] = useState("");
  const [necessityType, setNecessityType] = useState("");
  const [necessityExplanation, setNecessityExplanation] = useState("");
  const [uniqueValue, setUniqueValue] = useState("");
  const [emotionalValue, setEmotionalValue] = useState("");
  const [adaptability, setAdaptability] = useState("");
  const [marketContext, setMarketContext] = useState("");

  // Section 3 - Business Model
  const [customerType, setCustomerType] = useState<string[]>([]);
  const [customerTypeExplanation, setCustomerTypeExplanation] = useState("");
  const [gtmDescription, setGtmDescription] = useState("");
  const [gtmValueAlignment, setGtmValueAlignment] = useState("");
  const [pricingStrategies, setPricingStrategies] = useState<string[]>([]);
  // Dynamic pricing sub-fields
  const [subscriptionType, setSubscriptionType] = useState("");
  const [subscriptionBillingCycle, setSubscriptionBillingCycle] = useState("");
  const [subscriptionTiers, setSubscriptionTiers] = useState("");
  const [transactionFeeType, setTransactionFeeType] = useState("");
  const [transactionFeePercentage, setTransactionFeePercentage] = useState("");
  const [licensingModel, setLicensingModel] = useState("");
  const [adRevenueModel, setAdRevenueModel] = useState("");
  const [serviceType, setServiceType] = useState("");
  // Revenue metrics
  const [revenueMetrics, setRevenueMetrics] = useState<string[]>([]);
  const [revenueMetricsValues, setRevenueMetricsValues] = useState("");

  // Section 4 - Market Sizing
  const [tamValue, setTamValue] = useState("");
  const [tamCalculationMethod, setTamCalculationMethod] = useState("");
  const [tamBreakdown, setTamBreakdown] = useState("");
  const [samValue, setSamValue] = useState("");
  const [samSegments, setSamSegments] = useState("");
  const [somValue, setSomValue] = useState("");
  const [somTimeframe, setSomTimeframe] = useState("");
  const [somStrategy, setSomStrategy] = useState("");

  // Section 5 - Target Customer
  const [targetGeography, setTargetGeography] = useState("");
  const [targetCustomerDescription, setTargetCustomerDescription] = useState("");

  // Section 6 - Competitors
  const [competitors, setCompetitors] = useState<Competitor[]>([
    { name: "", description: "", howYouDiffer: "" },
    { name: "", description: "", howYouDiffer: "" },
    { name: "", description: "", howYouDiffer: "" },
  ]);
  const [competitiveMoat, setCompetitiveMoat] = useState("");

  const VALUE_DRIVERS = [
    "Saves time",
    "Reduces cost",
    "Improves efficiency",
    "Reduces risk or error",
    "Improves compliance or reliability",
    "Improves user experience or intuitiveness",
  ];

  const CUSTOMER_TYPES = ["B2B", "B2C", "Both"];

  const PRICING_STRATEGIES = [
    { id: "subscription", label: "Subscription" },
    { id: "transaction", label: "Transaction-based" },
    { id: "licensing", label: "One-time / Licensing" },
    { id: "advertising", label: "Advertising-driven" },
    { id: "services", label: "Services" },
  ];

  const GTM_ALIGNMENT_OPTIONS = [
    { value: "enterprise-sales", label: "Enterprise Sales", desc: "High-touch, long sales cycles for complex solutions" },
    { value: "self-serve", label: "Self-Serve / PLG", desc: "Product-led growth with minimal sales involvement" },
    { value: "channel-partners", label: "Channel Partners", desc: "Distribution through resellers or integrators" },
    { value: "marketplace", label: "Marketplace", desc: "Platform connecting buyers and sellers" },
    { value: "direct-consumer", label: "Direct to Consumer", desc: "B2C acquisition through marketing" },
    { value: "hybrid", label: "Hybrid", desc: "Combination of multiple approaches" },
  ];

  const SAAS_METRICS = ["MRR", "ARR", "LTV", "CAC", "Churn Rate", "Net Revenue Retention"];
  const TRANSACTION_METRICS = ["GMV", "Take Rate", "Transaction Volume", "Average Transaction Size"];
  const LICENSING_METRICS = ["Revenue per License", "Renewal Rate", "Number of Licenses Sold"];
  const AD_METRICS = ["DAU/MAU", "CPM", "Ad Revenue per User", "Engagement Rate"];
  const SERVICES_METRICS = ["Revenue per Project", "Utilization Rate", "Average Contract Value"];

  const sections = [
    "Welcome",
    "Company Info",
    "Team & Overview",
    "The Problem",
    "Business Model",
    "Market Sizing",
    "Target Customer",
    "Competitors",
  ];

  const getRelevantMetrics = () => {
    const metrics: string[] = [];
    if (pricingStrategies.includes("subscription")) metrics.push(...SAAS_METRICS);
    if (pricingStrategies.includes("transaction")) metrics.push(...TRANSACTION_METRICS);
    if (pricingStrategies.includes("licensing")) metrics.push(...LICENSING_METRICS);
    if (pricingStrategies.includes("advertising")) metrics.push(...AD_METRICS);
    if (pricingStrategies.includes("services")) metrics.push(...SERVICES_METRICS);
    return [...new Set(metrics)];
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanyLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", role: "", linkedin: "", background: "" }]);
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const updateCompetitor = (index: number, field: keyof Competitor, value: string) => {
    const updated = [...competitors];
    updated[index][field] = value;
    setCompetitors(updated);
  };

  const toggleCheckbox = (value: string, currentArray: string[], setter: (arr: string[]) => void) => {
    if (currentArray.includes(value)) {
      setter(currentArray.filter((v) => v !== value));
    } else {
      setter([...currentArray, value]);
    }
  };

  const validateSection = (sectionIndex: number): boolean => {
    const errors: string[] = [];

    switch (sectionIndex) {
      case 0:
        break;
      case 1:
        if (!basicInfo.companyName.trim()) errors.push("Company name is required");
        if (!basicInfo.vertical) errors.push("Vertical is required");
        if (!basicInfo.stage) errors.push("Stage is required");
        if (!basicInfo.location.trim()) errors.push("Location is required");
        break;
      case 2:
        if (countWords(companyOverview) < 30) errors.push("Problem statement needs at least 30 words");
        if (!founderName.trim()) errors.push("Your name is required");
        if (!founderEmail.trim()) errors.push("Your email is required");
        if (!teamMembers[0]?.role?.trim()) errors.push("Your role is required");
        break;
      case 3:
        if (countWords(currentPainPoint) < 20) errors.push("Pain point description needs at least 20 words");
        if (valueDrivers.length === 0) errors.push("Select at least one value type");
        break;
      case 4:
        if (customerType.length === 0) errors.push("Select at least one customer type");
        if (!gtmDescription.trim()) errors.push("GTM description is required");
        if (pricingStrategies.length === 0) errors.push("Select at least one pricing strategy");
        break;
      case 5:
        if (!tamValue.trim()) errors.push("TAM value is required");
        if (!samValue.trim()) errors.push("SAM value is required");
        if (!somValue.trim()) errors.push("SOM value is required");
        break;
      case 6:
        if (!targetGeography.trim()) errors.push("Target geography is required");
        if (countWords(targetCustomerDescription) < 20) errors.push("Customer description needs at least 20 words");
        break;
      case 7:
        break;
    }

    setSectionErrors(errors);

    if (errors.length > 0) {
      toast({
        title: "Please complete required fields",
        description: errors[0],
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleNextSection = () => {
    setCurrentSection(currentSection + 1);
  };

  const validateAllSections = (): string[] => {
    const errors: string[] = [];
    
    if (!basicInfo.companyName.trim()) errors.push("Company name is required");
    if (!basicInfo.vertical) errors.push("Vertical is required");
    if (!basicInfo.stage) errors.push("Stage is required");
    if (!basicInfo.location.trim()) errors.push("Location is required");
    if (countWords(companyOverview) < 30) errors.push("Problem statement needs at least 30 words");
    if (!founderName.trim()) errors.push("Your name is required");
    if (!founderEmail.trim()) errors.push("Your email is required");
    if (countWords(currentPainPoint) < 20) errors.push("Pain point description needs at least 20 words");
    if (valueDrivers.length === 0) errors.push("Select at least one value type");
    if (customerType.length === 0) errors.push("Select at least one customer type");
    if (pricingStrategies.length === 0) errors.push("Select at least one pricing strategy");
    if (!tamValue.trim()) errors.push("TAM value is required");
    if (!samValue.trim()) errors.push("SAM value is required");
    if (!somValue.trim()) errors.push("SOM value is required");
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateAllSections();
    if (errors.length > 0) {
      toast({
        title: "Please complete required fields",
        description: errors[0],
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
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

      const applicationSections = {
        section1: {
          companyOverview,
          teamMembers,
        },
        section2: {
          currentPainPoint,
          valueProposition,
          valueDrivers,
          severityUrgency,
          uniqueValue,
          emotionalValue,
          adaptability,
          marketContext,
        },
        section3: {
          customerType,
          customerTypeExplanation,
          gtmDescription,
          gtmValueAlignment,
          pricingStrategies,
          subscriptionType,
          subscriptionBillingCycle,
          subscriptionTiers,
          transactionFeeType,
          transactionFeePercentage,
          licensingModel,
          adRevenueModel,
          serviceType,
          revenueMetrics,
          revenueMetricsValues,
        },
        section4: {
          tamValue,
          tamCalculationMethod,
          tamBreakdown,
          samValue,
          samSegments,
          somValue,
          somTimeframe,
          somStrategy,
        },
        section5: {
          targetGeography,
          targetCustomerDescription,
        },
        section6: {
          competitors,
          competitiveMoat,
        },
      };

      const { error: insertError } = await supabase
        .from("founder_applications")
        .insert({
          user_id: user.id,
          founder_name: founderName,
          email: founderEmail,
          company_name: basicInfo.companyName,
          website: basicInfo.website || null,
          vertical: basicInfo.vertical,
          stage: basicInfo.stage,
          location: basicInfo.location,
          funding_goal: "TBD",
          business_model: companyOverview,
          traction: revenueMetricsValues || "N/A",
          current_ask: gtmDescription || "N/A",
          application_sections: {
            ...applicationSections,
            linkedIn: basicInfo.linkedIn,
          } as unknown as Record<string, unknown>,
          team_members: teamMembers as unknown as Record<string, unknown>[],
          status: "pending",
        } as any);

      if (insertError) throw insertError;

      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const WordCounter = ({ current, min, max }: { current: string; min: number; max: number }) => {
    const words = countWords(current);
    const isValid = words >= min && words <= max;
    return (
      <p className={`text-xs ${isValid ? "text-green-600" : "text-amber-600"}`}>
        {words} / {min}-{max} words
      </p>
    );
  };

  // Thank You Page
  if (isSubmitted) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{ background: "var(--gradient-navy-teal)" }}>
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] border border-[hsl(var(--cyan-glow))]/30 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] border border-[hsl(var(--cyan-glow))]/20 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white/95 backdrop-blur-sm border-2 border-[hsl(var(--cyan-glow))]/20 rounded-2xl p-12 shadow-2xl">
            <div className="w-20 h-20 mx-auto mb-6 bg-[hsl(var(--cyan-glow))]/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[hsl(var(--cyan-glow))]" />
            </div>
            <h1 className="text-3xl font-bold text-[hsl(var(--navy-deep))] mb-4">
              Thank You for Your Submission
            </h1>
            <p className="text-lg text-[hsl(var(--navy-deep))]/70 mb-8">
              We will get back to you after reviewing your memo and provide access to your curated database.
            </p>
            <Button
              onClick={() => navigate("/founder-dashboard")}
              className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-glow))]/90 font-semibold px-8"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-[hsl(var(--navy-deep))]">Welcome</h2>
              <p className="text-lg text-[hsl(var(--navy-deep))]/80 max-w-2xl mx-auto">
                Help us understand the <strong>what</strong>, <strong>why</strong>, and <strong>how</strong> of your company so we can match you with the right investors.
              </p>
            </div>

            <div className="bg-[hsl(var(--cyan-glow))]/10 border border-[hsl(var(--cyan-glow))]/30 rounded-xl p-6 space-y-4">
              <p className="text-[hsl(var(--navy-deep))]/80">
                This application is structured so that, by the end, you will have effectively written an <strong>investor-ready memo</strong>.
              </p>
              <p className="text-[hsl(var(--navy-deep))]/70">Every question helps us understand:</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 bg-white border border-[hsl(var(--cyan-glow))]/20 rounded-xl">
                <div className="text-2xl font-bold text-[hsl(var(--cyan-glow))] mb-2">WHAT</div>
                <p className="text-[hsl(var(--navy-deep))]/70">The problem you're solving</p>
              </div>
              <div className="p-5 bg-white border border-[hsl(var(--cyan-glow))]/20 rounded-xl">
                <div className="text-2xl font-bold text-[hsl(var(--cyan-glow))] mb-2">WHY</div>
                <p className="text-[hsl(var(--navy-deep))]/70">Motivation, urgency, vision</p>
              </div>
              <div className="p-5 bg-white border border-[hsl(var(--cyan-glow))]/20 rounded-xl">
                <div className="text-2xl font-bold text-[hsl(var(--cyan-glow))] mb-2">HOW</div>
                <p className="text-[hsl(var(--navy-deep))]/70">Solution & business model</p>
              </div>
              <div className="p-5 bg-white border border-[hsl(var(--cyan-glow))]/20 rounded-xl">
                <div className="text-2xl font-bold text-[hsl(var(--cyan-glow))] mb-2">METRIC</div>
                <p className="text-[hsl(var(--navy-deep))]/70">Proof, behavior, traction</p>
              </div>
            </div>

            <p className="text-sm text-[hsl(var(--navy-deep))]/60 text-center italic">
              Your answers will be kept confidential and only shared with approved investors.
            </p>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Company Information</h2>
              <p className="text-[hsl(var(--navy-deep))]/70">Tell us about your company</p>
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label className="font-medium">Company Logo</Label>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-[hsl(var(--cyan-glow))]/30">
                    <img src={logoPreview} alt="Company logo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed border-[hsl(var(--navy-deep))]/20 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-[hsl(var(--navy-deep))]/40" />
                  </div>
                )}
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>Upload Logo</span>
                    </Button>
                  </Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/50 mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-medium">Company Name *</Label>
                <Input
                  value={basicInfo.companyName}
                  onChange={(e) => setBasicInfo({ ...basicInfo, companyName: e.target.value })}
                  placeholder="Your company name"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Website</Label>
                <Input
                  value={basicInfo.website}
                  onChange={(e) => setBasicInfo({ ...basicInfo, website: e.target.value })}
                  placeholder="https://yourcompany.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-medium">LinkedIn</Label>
                <Input
                  value={basicInfo.linkedIn}
                  onChange={(e) => setBasicInfo({ ...basicInfo, linkedIn: e.target.value })}
                  placeholder="Company LinkedIn URL"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Vertical *</Label>
                <Select value={basicInfo.vertical} onValueChange={(v) => setBasicInfo({ ...basicInfo, vertical: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vertical" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-ml">AI / Machine Learning</SelectItem>
                    <SelectItem value="fintech">Fintech</SelectItem>
                    <SelectItem value="healthtech">Healthtech</SelectItem>
                    <SelectItem value="edtech">Edtech</SelectItem>
                    <SelectItem value="enterprise">Enterprise SaaS</SelectItem>
                    <SelectItem value="consumer">Consumer</SelectItem>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                    <SelectItem value="hardware">Hardware / IoT</SelectItem>
                    <SelectItem value="climate">Climate / Cleantech</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Stage *</Label>
                <Select value={basicInfo.stage} onValueChange={(v) => setBasicInfo({ ...basicInfo, stage: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea / Concept</SelectItem>
                    <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                    <SelectItem value="seed">Seed</SelectItem>
                    <SelectItem value="series-a">Series A</SelectItem>
                    <SelectItem value="series-b">Series B+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Headquarters *</Label>
                <Input
                  value={basicInfo.location}
                  onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })}
                  placeholder="City, State/Country"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Section 1 — Your Team & Company Overview</h2>
              <p className="text-[hsl(var(--navy-deep))]/70">Who's building this and what does the company do?</p>
            </div>

            {/* 1.1 Company Overview */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">1.1 Tell us about your company</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  One paragraph that clearly explains what your company does, the problem it solves, and who it's for. This is your pitch.
                </p>
              </div>
              <Textarea
                value={companyOverview}
                onChange={(e) => setCompanyOverview(e.target.value)}
                placeholder="We're building [what] for [who] to solve [problem]. Currently, [pain point]. Our solution [how it works] which results in [outcome]..."
                rows={5}
              />
              <WordCounter current={companyOverview} min={30} max={100} />
            </div>

            {/* 1.2 Founder / Key Contact */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">1.2 Your Information</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">Primary contact for this application</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Your Name *</Label>
                  <Input
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Your Email *</Label>
                  <Input
                    type="email"
                    value={founderEmail}
                    onChange={(e) => setFounderEmail(e.target.value)}
                    placeholder="you@company.com"
                  />
                </div>
              </div>
            </div>

            {/* 1.3 Team */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">1.3 Team Members</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">Add your founding team and key hires</p>
              </div>
              
              {teamMembers.map((member, index) => (
                <div key={index} className="p-4 border border-[hsl(var(--navy-deep))]/10 rounded-lg space-y-4 bg-white">
                  <div className="flex justify-between items-center">
                    <Label className="font-medium">Team Member {index + 1}</Label>
                    {teamMembers.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTeamMember(index)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                        placeholder="Full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role *</Label>
                      <Input
                        value={member.role}
                        onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                        placeholder="e.g., CEO, CTO, Head of Product"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>LinkedIn</Label>
                      <Input
                        value={member.linkedin}
                        onChange={(e) => updateTeamMember(index, "linkedin", e.target.value)}
                        placeholder="LinkedIn URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Background</Label>
                      <Input
                        value={member.background}
                        onChange={(e) => updateTeamMember(index, "background", e.target.value)}
                        placeholder="Previous experience (1-2 highlights)"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addTeamMember}
                className="w-full border-dashed"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Section 2 — The Problem</h2>
              <p className="text-[hsl(var(--navy-deep))]/70">What pain point are you solving and why does it matter?</p>
            </div>

            {/* 2.1 Current Pain Point */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">2.1 What problem are you solving?</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  Describe the core pain point your target customer faces. Be specific — vague problems lead to vague solutions.
                </p>
              </div>
              <Textarea
                value={currentPainPoint}
                onChange={(e) => setCurrentPainPoint(e.target.value)}
                placeholder="Today, [target customer] struggles with [specific problem]. This happens because [root cause]. The impact is [consequence]..."
                rows={4}
              />
              <WordCounter current={currentPainPoint} min={20} max={100} />
            </div>

            {/* 2.2 Value Type */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">2.2 What type of value do you deliver?</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">Select all that apply</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {VALUE_DRIVERS.map((driver) => (
                  <div
                    key={driver}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      valueDrivers.includes(driver)
                        ? "border-[hsl(var(--cyan-glow))] bg-[hsl(var(--cyan-glow))]/10"
                        : "border-[hsl(var(--navy-deep))]/20 hover:border-[hsl(var(--cyan-glow))]/50"
                    }`}
                    onClick={() => toggleCheckbox(driver, valueDrivers, setValueDrivers)}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox checked={valueDrivers.includes(driver)} />
                      <span className="text-sm">{driver}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2.3 Severity */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">2.3 How urgent is this problem?</Label>
              </div>
              <Textarea
                value={severityUrgency}
                onChange={(e) => setSeverityUrgency(e.target.value)}
                placeholder="What happens if the customer does nothing? Is this a nice-to-have or a burning need?"
                rows={3}
              />
              <WordCounter current={severityUrgency} min={20} max={75} />
            </div>

            {/* 2.4 Unique Value */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">2.4 What makes your solution unique?</Label>
              </div>
              <Textarea
                value={uniqueValue}
                onChange={(e) => setUniqueValue(e.target.value)}
                placeholder="What can you do that competitors can't? What's your unfair advantage?"
                rows={3}
              />
              <WordCounter current={uniqueValue} min={20} max={75} />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Section 3 — Business Model</h2>
              <p className="text-[hsl(var(--navy-deep))]/70">How do you make money and reach customers?</p>
            </div>

            {/* 3.1 Customer Type */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">3.1 Who is your customer?</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">Select your primary customer type</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {CUSTOMER_TYPES.map((type) => (
                  <div
                    key={type}
                    className={`px-4 py-2 border rounded-full cursor-pointer transition-all ${
                      customerType.includes(type)
                        ? "border-[hsl(var(--cyan-glow))] bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--navy-deep))]"
                        : "border-[hsl(var(--navy-deep))]/20 hover:border-[hsl(var(--cyan-glow))]/50"
                    }`}
                    onClick={() => toggleCheckbox(type, customerType, setCustomerType)}
                  >
                    <span className="text-sm font-medium">{type}</span>
                  </div>
                ))}
              </div>
              {customerType.length > 0 && (
                <Textarea
                  value={customerTypeExplanation}
                  onChange={(e) => setCustomerTypeExplanation(e.target.value)}
                  placeholder="Briefly describe your buyer persona and decision-maker..."
                  rows={2}
                />
              )}
            </div>

            {/* 3.2 GTM Strategy */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">3.2 Go-to-Market Strategy</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">How do you acquire customers?</p>
              </div>
              <Textarea
                value={gtmDescription}
                onChange={(e) => setGtmDescription(e.target.value)}
                placeholder="Describe your current or planned customer acquisition channels, sales process, and how you convert leads to customers..."
                rows={4}
              />
              <WordCounter current={gtmDescription} min={50} max={100} />

              <div className="space-y-2 mt-4">
                <Label className="font-medium">How does this align with your value proposition?</Label>
                <Select value={gtmValueAlignment} onValueChange={setGtmValueAlignment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select GTM alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    {GTM_ALIGNMENT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <span className="font-medium">{option.label}</span>
                          <span className="text-muted-foreground ml-2">— {option.desc}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 3.3 Pricing Strategy */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">3.3 Pricing Strategy</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">How do you charge customers? Select all that apply.</p>
              </div>
              <div className="space-y-3">
                {PRICING_STRATEGIES.map((strategy) => (
                  <div key={strategy.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`pricing-${strategy.id}`}
                      checked={pricingStrategies.includes(strategy.id)}
                      onCheckedChange={() => toggleCheckbox(strategy.id, pricingStrategies, setPricingStrategies)}
                    />
                    <Label htmlFor={`pricing-${strategy.id}`} className="cursor-pointer">{strategy.label}</Label>
                  </div>
                ))}
              </div>

              {/* Dynamic sub-fields based on pricing selection */}
              {pricingStrategies.includes("subscription") && (
                <div className="p-4 bg-[hsl(var(--cyan-glow))]/5 border border-[hsl(var(--cyan-glow))]/20 rounded-lg space-y-4">
                  <Label className="font-semibold text-[hsl(var(--navy-deep))]">Subscription Details</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Subscription Type</Label>
                      <Select value={subscriptionType} onValueChange={setSubscriptionType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flat">Flat Rate</SelectItem>
                          <SelectItem value="tiered">Tiered Pricing</SelectItem>
                          <SelectItem value="usage-based">Usage-Based</SelectItem>
                          <SelectItem value="per-seat">Per-Seat</SelectItem>
                          <SelectItem value="freemium">Freemium + Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Billing Cycle</Label>
                      <Select value={subscriptionBillingCycle} onValueChange={setSubscriptionBillingCycle}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cycle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                          <SelectItem value="both">Both (with annual discount)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Describe your tiers/pricing structure</Label>
                    <Textarea
                      value={subscriptionTiers}
                      onChange={(e) => setSubscriptionTiers(e.target.value)}
                      placeholder="e.g., Free tier: X features, Pro: $29/mo with Y features, Enterprise: Custom pricing..."
                      rows={2}
                    />
                  </div>
                </div>
              )}

              {pricingStrategies.includes("transaction") && (
                <div className="p-4 bg-[hsl(var(--cyan-glow))]/5 border border-[hsl(var(--cyan-glow))]/20 rounded-lg space-y-4">
                  <Label className="font-semibold text-[hsl(var(--navy-deep))]">Transaction-Based Details</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fee Type</Label>
                      <Select value={transactionFeeType} onValueChange={setTransactionFeeType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fee type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (Take Rate)</SelectItem>
                          <SelectItem value="flat-fee">Flat Fee per Transaction</SelectItem>
                          <SelectItem value="hybrid">Hybrid (% + Flat)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Fee Amount/Percentage</Label>
                      <Input
                        value={transactionFeePercentage}
                        onChange={(e) => setTransactionFeePercentage(e.target.value)}
                        placeholder="e.g., 2.9% + $0.30"
                      />
                    </div>
                  </div>
                </div>
              )}

              {pricingStrategies.includes("licensing") && (
                <div className="p-4 bg-[hsl(var(--cyan-glow))]/5 border border-[hsl(var(--cyan-glow))]/20 rounded-lg space-y-4">
                  <Label className="font-semibold text-[hsl(var(--navy-deep))]">Licensing Details</Label>
                  <div className="space-y-2">
                    <Label>Licensing Model</Label>
                    <Select value={licensingModel} onValueChange={setLicensingModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="perpetual">Perpetual License</SelectItem>
                        <SelectItem value="term">Term License</SelectItem>
                        <SelectItem value="enterprise">Enterprise Agreement</SelectItem>
                        <SelectItem value="oem">OEM/White Label</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {pricingStrategies.includes("advertising") && (
                <div className="p-4 bg-[hsl(var(--cyan-glow))]/5 border border-[hsl(var(--cyan-glow))]/20 rounded-lg space-y-4">
                  <Label className="font-semibold text-[hsl(var(--navy-deep))]">Advertising Revenue Details</Label>
                  <div className="space-y-2">
                    <Label>Ad Revenue Model</Label>
                    <Select value={adRevenueModel} onValueChange={setAdRevenueModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="display">Display Ads (CPM)</SelectItem>
                        <SelectItem value="sponsored">Sponsored Content</SelectItem>
                        <SelectItem value="affiliate">Affiliate/Referral</SelectItem>
                        <SelectItem value="native">Native Advertising</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {pricingStrategies.includes("services") && (
                <div className="p-4 bg-[hsl(var(--cyan-glow))]/5 border border-[hsl(var(--cyan-glow))]/20 rounded-lg space-y-4">
                  <Label className="font-semibold text-[hsl(var(--navy-deep))]">Services Details</Label>
                  <div className="space-y-2">
                    <Label>Service Type</Label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consulting">Consulting/Advisory</SelectItem>
                        <SelectItem value="implementation">Implementation Services</SelectItem>
                        <SelectItem value="managed">Managed Services</SelectItem>
                        <SelectItem value="training">Training/Education</SelectItem>
                        <SelectItem value="support">Premium Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            {/* 3.4 Revenue & Metrics */}
            {pricingStrategies.length > 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-semibold">3.4 Key Metrics</Label>
                  <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                    Based on your pricing model, select the metrics you track (and share values if available)
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getRelevantMetrics().map((metric) => (
                    <div
                      key={metric}
                      className={`p-3 border rounded-lg cursor-pointer transition-all text-center ${
                        revenueMetrics.includes(metric)
                          ? "border-[hsl(var(--cyan-glow))] bg-[hsl(var(--cyan-glow))]/10"
                          : "border-[hsl(var(--navy-deep))]/20 hover:border-[hsl(var(--cyan-glow))]/50"
                      }`}
                      onClick={() => toggleCheckbox(metric, revenueMetrics, setRevenueMetrics)}
                    >
                      <Checkbox checked={revenueMetrics.includes(metric)} className="mr-2" />
                      <span className="text-sm font-medium">{metric}</span>
                    </div>
                  ))}
                </div>
                {revenueMetrics.length > 0 && (
                  <Textarea
                    value={revenueMetricsValues}
                    onChange={(e) => setRevenueMetricsValues(e.target.value)}
                    placeholder="Share your current numbers for the selected metrics (e.g., ARR: $500K, Churn: 2%/mo, LTV: $2,400)..."
                    rows={3}
                  />
                )}
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Section 4 — Market Sizing</h2>
              <p className="text-[hsl(var(--navy-deep))]/70">How big is the opportunity?</p>
            </div>

            {/* Market Opportunity */}
            <div className="space-y-6">
              <Label className="text-base font-semibold">Market Opportunity (TAM → SAM → SOM)</Label>
              <p className="text-sm text-[hsl(var(--navy-deep))]/60 bg-blue-50 p-3 rounded-lg">
                💡 <strong>Tip:</strong> TAM = Total market if you had 100% share. SAM = Segment you can actually reach. SOM = What you can realistically capture in 2-3 years.
              </p>

              {/* TAM */}
              <div className="p-4 border border-[hsl(var(--cyan-glow))]/20 rounded-lg space-y-4">
                <Label className="font-semibold text-[hsl(var(--navy-deep))]">TAM — Total Addressable Market</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Market Size ($ value) *</Label>
                    <Input
                      value={tamValue}
                      onChange={(e) => setTamValue(e.target.value)}
                      placeholder="e.g., $50B"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Calculation Method</Label>
                    <Select value={tamCalculationMethod} onValueChange={setTamCalculationMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="How did you calculate?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top-down">Top-Down (industry reports)</SelectItem>
                        <SelectItem value="bottom-up">Bottom-Up (# customers × price)</SelectItem>
                        <SelectItem value="value-theory">Value Theory (problem cost × reach)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Show your work — break down how you got this number</Label>
                  <Textarea
                    value={tamBreakdown}
                    onChange={(e) => setTamBreakdown(e.target.value)}
                    placeholder="e.g., For LymeAlert: 476,000 new Lyme cases/year in US × $3,000 avg treatment cost = $1.4B direct treatment market. Endemic regions: Northeast (65%), Upper Midwest (25%), Pacific Coast (10%)..."
                    rows={3}
                  />
                </div>
              </div>

              {/* SAM */}
              <div className="p-4 border border-[hsl(var(--cyan-glow))]/20 rounded-lg space-y-4">
                <Label className="font-semibold text-[hsl(var(--navy-deep))]">SAM — Serviceable Addressable Market</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Serviceable Market Size *</Label>
                    <Input
                      value={samValue}
                      onChange={(e) => setSamValue(e.target.value)}
                      placeholder="e.g., $5B"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>What segments are you focusing on and why?</Label>
                  <Textarea
                    value={samSegments}
                    onChange={(e) => setSamSegments(e.target.value)}
                    placeholder="e.g., Focusing on high-risk outdoor workers in endemic regions first (forestry, construction, landscaping) = 2.3M workers. Then expanding to recreational outdoor enthusiasts..."
                    rows={3}
                  />
                </div>
              </div>

              {/* SOM */}
              <div className="p-4 border border-[hsl(var(--cyan-glow))]/20 rounded-lg space-y-4">
                <Label className="font-semibold text-[hsl(var(--navy-deep))]">SOM — Serviceable Obtainable Market</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Obtainable Market Size *</Label>
                    <Input
                      value={somValue}
                      onChange={(e) => setSomValue(e.target.value)}
                      placeholder="e.g., $500M"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Timeframe</Label>
                    <Select value={somTimeframe} onValueChange={setSomTimeframe}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-year">1 Year</SelectItem>
                        <SelectItem value="2-years">2 Years</SelectItem>
                        <SelectItem value="3-years">3 Years</SelectItem>
                        <SelectItem value="5-years">5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>How will you capture this?</Label>
                  <Textarea
                    value={somStrategy}
                    onChange={(e) => setSomStrategy(e.target.value)}
                    placeholder="e.g., Year 1: Partner with 50 forestry companies in CT/MA/NY (15,000 workers). Year 2: Expand to all Northeast states + launch consumer app. Year 3: National rollout..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Section 5 — Target Customer</h2>
              <p className="text-[hsl(var(--navy-deep))]/70">Who exactly are you selling to?</p>
            </div>

            {/* Geography */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">5.1 Target Geography *</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  Be specific about your geographic focus. Include regions, cities, states, or countries you're targeting.
                </p>
              </div>
              <Textarea
                value={targetGeography}
                onChange={(e) => setTargetGeography(e.target.value)}
                placeholder="e.g., Initially focusing on the Northeast US corridor (Boston to Washington DC) due to high concentration of target enterprise customers. Expanding to Chicago and San Francisco metro areas in Year 2..."
                rows={3}
              />
            </div>

            {/* Target Customer Description */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">5.2 Describe Your Target Customer *</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  Paint a complete picture of who you're selling to. Include their role, what their day looks like, their pain points, and why they're the right fit. Also describe who you're actually going after right now — your actionable customer list.
                </p>
              </div>
              <Textarea
                value={targetCustomerDescription}
                onChange={(e) => setTargetCustomerDescription(e.target.value)}
                placeholder="Our ideal customer is a VP of Operations at a mid-size manufacturing company (100-500 employees) who is frustrated by outdated inventory management. They spend 3+ hours daily reconciling spreadsheets and have been burned by stockouts. Right now, we're targeting 150 specific manufacturing companies in the Midwest that use legacy ERP systems..."
                rows={6}
              />
              <WordCounter current={targetCustomerDescription} min={20} max={200} />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Section 6 — Competitive Landscape</h2>
              <p className="text-[hsl(var(--navy-deep))]/70">Who else is solving this problem?</p>
            </div>

            {/* Competitors */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">6.1 Competitors</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  List up to 3 competitors. Describe what they do and how you're different.
                </p>
              </div>
              
              <div className="space-y-4">
                {competitors.map((competitor, index) => (
                  <div key={index} className="p-4 border border-[hsl(var(--navy-deep))]/10 rounded-lg bg-white space-y-4">
                    <Label className="font-medium text-[hsl(var(--navy-deep))]">Competitor {index + 1}</Label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input
                          value={competitor.name}
                          onChange={(e) => updateCompetitor(index, "name", e.target.value)}
                          placeholder="Competitor name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>What They Do</Label>
                        <Textarea
                          value={competitor.description}
                          onChange={(e) => updateCompetitor(index, "description", e.target.value)}
                          placeholder="Describe their product/service, target market, and approach..."
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>How You Differ</Label>
                        <Textarea
                          value={competitor.howYouDiffer}
                          onChange={(e) => updateCompetitor(index, "howYouDiffer", e.target.value)}
                          placeholder="What's your key differentiator against this competitor?"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitive Moat */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">6.2 Competitive Moat</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  What is your defensible advantage over competitors?
                </p>
              </div>
              <Textarea
                value={competitiveMoat}
                onChange={(e) => setCompetitiveMoat(e.target.value)}
                placeholder="Technology, data, switching costs, brand, regulatory, network effects..."
                rows={4}
              />
              <WordCounter current={competitiveMoat} min={75} max={100} />
            </div>

            {/* Final Note */}
            <div className="p-6 bg-[hsl(var(--cyan-glow))]/10 border border-[hsl(var(--cyan-glow))]/30 rounded-xl">
              <p className="text-[hsl(var(--navy-deep))] font-medium text-center italic">
                "This is not a test — it's a tool. If you can answer these questions clearly, you are already thinking like an investor."
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--gradient-navy-teal)" }}>
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] border border-[hsl(var(--cyan-glow))]/30 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] border border-[hsl(var(--cyan-glow))]/20 rounded-full translate-y-1/2 -translate-x-1/2" />
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
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg" />
              <span className="text-xl font-bold text-white">In-Sync</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 relative z-10">
        <div className="container max-w-4xl mx-auto px-4 md:px-6">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/30 rounded-full text-sm font-medium text-[hsl(var(--cyan-glow))]">
                IN-SYNC | FOUNDER APPLICATION
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Investor-Ready Memo
              </h1>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Help us understand the what, why, and how of your company so we can match you with the right investors.
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center gap-2 flex-wrap">
              {sections.map((section, index) => (
                <button
                  key={section}
                  onClick={() => setCurrentSection(index)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    currentSection === index
                      ? "bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))]"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {index + 1}. {section}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="bg-white/95 backdrop-blur-sm border-2 border-[hsl(var(--cyan-glow))]/20 rounded-2xl p-8 md:p-10 shadow-2xl">
                {renderSection()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-10 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                    disabled={currentSection === 0}
                    className="border-[hsl(var(--navy-deep))]/20"
                  >
                    Previous
                  </Button>

                  {currentSection < sections.length - 1 ? (
                    <Button
                      type="button"
                      onClick={handleNextSection}
                      className="bg-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/90"
                    >
                      Next Section
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-glow))]/90 font-semibold"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
