import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Plus, Trash2, Upload, CheckCircle, Check, Sparkles, Building2, Users, Target, Briefcase, TrendingUp, Map, Swords } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

// Word count helper
const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

// Steps configuration
const STEPS = [
  { id: 0, title: "Welcome", icon: Sparkles },
  { id: 1, title: "Company Info", icon: Building2 },
  { id: 2, title: "Team & Overview", icon: Users },
  { id: 3, title: "Value Proposition", icon: Target },
  { id: 4, title: "Business Model", icon: Briefcase },
  { id: 5, title: "Go-to-Market", icon: TrendingUp },
  { id: 6, title: "Customer & Market", icon: Map },
  { id: 7, title: "Competitors", icon: Swords },
];

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
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

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

  // Section 2 - The Problem & Value Proposition
  const [currentPainPoint, setCurrentPainPoint] = useState("");
  const [valueDrivers, setValueDrivers] = useState<string[]>([]);

  // Section 3 - Business Model
  const [customerType, setCustomerType] = useState<string[]>([]);
  const [customerTypeExplanation, setCustomerTypeExplanation] = useState("");
  const [businessStructure, setBusinessStructure] = useState("");
  const [pricingStrategies, setPricingStrategies] = useState<string[]>([]);
  const [subscriptionType, setSubscriptionType] = useState("");
  const [subscriptionBillingCycle, setSubscriptionBillingCycle] = useState("");
  const [subscriptionTiers, setSubscriptionTiers] = useState("");
  const [transactionFeeType, setTransactionFeeType] = useState("");
  const [transactionFeePercentage, setTransactionFeePercentage] = useState("");
  const [licensingModel, setLicensingModel] = useState("");
  const [adRevenueModel, setAdRevenueModel] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [revenueMetrics, setRevenueMetrics] = useState<string[]>([]);
  const [revenueMetricsValues, setRevenueMetricsValues] = useState("");

  // Section 4 - Go-to-Market
  const [gtmAcquisition, setGtmAcquisition] = useState("");
  const [gtmTimeline, setGtmTimeline] = useState("");

  // Section 5 - Target Customer & Market Sizing
  const [targetGeography, setTargetGeography] = useState("");
  const [targetCustomerDescription, setTargetCustomerDescription] = useState("");
  const [tamValue, setTamValue] = useState("");
  const [tamCalculationMethod, setTamCalculationMethod] = useState("");
  const [tamBreakdown, setTamBreakdown] = useState("");
  const [samValue, setSamValue] = useState("");
  const [samBreakdown, setSamBreakdown] = useState("");
  const [somValue, setSomValue] = useState("");
  const [somTimeframe, setSomTimeframe] = useState("");
  const [somBreakdown, setSomBreakdown] = useState("");

  // Section 6 - Competitors
  const [competitors, setCompetitors] = useState<Competitor[]>([
    { name: "", description: "", howYouDiffer: "" },
    { name: "", description: "", howYouDiffer: "" },
    { name: "", description: "", howYouDiffer: "" },
  ]);
  const [competitiveMoat, setCompetitiveMoat] = useState("");

  // Value Proposition Options
  const VALUE_DRIVER_OPTIONS = [
    { 
      value: "scalability", 
      label: "True Scalability", 
      description: "Making life easier, more efficient, or intuitive",
      prompt: "Explain how your solution makes life easier, more efficient, or more intuitive for your customers..."
    },
    { 
      value: "severity", 
      label: "Severity & Urgency", 
      description: "How urgent or costly is the problem (impact analysis)",
      prompt: "Explain how urgent or costly this problem is for your customers and the impact of not solving it..."
    },
    { 
      value: "unique-tech", 
      label: "Unique Technology Value", 
      description: "What makes your uniqueness attractive to customers daily life",
      prompt: "Explain what makes your technology unique and how it improves your customers' daily life..."
    },
    { 
      value: "emotional", 
      label: "Emotional & Social Value", 
      description: "Does it create status, trust, or peace of mind",
      prompt: "Explain how your solution creates status, trust, belonging, or peace of mind for customers..."
    },
    { 
      value: "adaptability", 
      label: "Adaptability", 
      description: "Across regions, geographies, groups of people",
      prompt: "Explain how your solution adapts across different regions, geographies, or groups of people..."
    },
  ];

  const [valueDriverExplanations, setValueDriverExplanations] = useState<Record<string, string>>({});

  const CUSTOMER_TYPES = ["B2B", "B2C", "Both"];

  const PRICING_STRATEGIES = [
    { id: "subscription", label: "Subscription" },
    { id: "transaction", label: "Transaction-based" },
    { id: "licensing", label: "One-time / Licensing" },
    { id: "advertising", label: "Advertising-driven" },
    { id: "services", label: "Services" },
  ];

  const addCompetitor = () => {
    if (competitors.length < 5) {
      setCompetitors([...competitors, { name: "", description: "", howYouDiffer: "" }]);
    }
  };

  const removeCompetitor = (index: number) => {
    if (competitors.length > 3) {
      setCompetitors(competitors.filter((_, i) => i !== index));
    }
  };

  const SAAS_METRICS = ["MRR", "ARR", "LTV", "CAC", "Churn Rate", "Net Revenue Retention"];
  const TRANSACTION_METRICS = ["GMV", "Take Rate", "Transaction Volume", "Average Transaction Size"];
  const LICENSING_METRICS = ["Revenue per License", "Renewal Rate", "Number of Licenses Sold"];
  const AD_METRICS = ["DAU/MAU", "CPM", "Ad Revenue per User", "Engagement Rate"];
  const SERVICES_METRICS = ["Revenue per Project", "Utilization Rate", "Average Contract Value"];

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

  // Validation function for each step
  const validateStep = (stepId: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    switch (stepId) {
      case 0: // Welcome - no validation needed
        break;
      case 1: // Company Info
        if (!basicInfo.companyName.trim()) errors.push("Company name is required");
        if (!basicInfo.vertical) errors.push("Vertical is required");
        if (!basicInfo.stage) errors.push("Stage is required");
        if (!basicInfo.location.trim()) errors.push("Location is required");
        break;
      case 2: // Team & Overview
        if (countWords(companyOverview) < 30) errors.push("Problem statement needs at least 30 words");
        if (!founderName.trim()) errors.push("Your name is required");
        if (!founderEmail.trim()) errors.push("Your email is required");
        if (!teamMembers[0]?.role?.trim()) errors.push("Your role is required");
        break;
      case 3: // Value Proposition
        if (countWords(currentPainPoint) < 20) errors.push("Pain point description needs at least 20 words");
        if (valueDrivers.length === 0) errors.push("Select at least one value driver");
        break;
      case 4: // Business Model
        if (customerType.length === 0) errors.push("Select at least one customer type");
        if (pricingStrategies.length === 0) errors.push("Select at least one pricing strategy");
        break;
      case 5: // Go-to-Market
        if (!gtmAcquisition.trim()) errors.push("Customer acquisition strategy is required");
        break;
      case 6: // Customer & Market
        if (!targetGeography.trim()) errors.push("Target geography is required");
        if (countWords(targetCustomerDescription) < 20) errors.push("Customer description needs at least 20 words");
        if (!tamValue.trim()) errors.push("TAM value is required");
        if (!samValue.trim()) errors.push("SAM value is required");
        if (!somValue.trim()) errors.push("SOM value is required");
        break;
      case 7: // Competitors - optional but validate competitive moat
        break;
    }

    return { isValid: errors.length === 0, errors };
  };

  const isStepComplete = (stepId: number): boolean => {
    return validateStep(stepId).isValid;
  };

  const nextStep = () => {
    // TESTING MODE: Skip validation for testing purposes
    // const validation = validateStep(currentSection);
    // if (!validation.isValid) {
    //   toast({
    //     title: "Please complete required fields",
    //     description: validation.errors[0],
    //     variant: "destructive",
    //   });
    //   return;
    // }
    
    // Mark current step as completed
    if (!completedSteps.includes(currentSection)) {
      setCompletedSteps(prev => [...prev, currentSection]);
    }
    
    setCurrentSection(prev => Math.min(prev + 1, 7));
  };

  const prevStep = () => setCurrentSection(prev => Math.max(prev - 1, 0));

  const handleStepClick = (stepId: number) => {
    if (stepId < currentSection) {
      setCurrentSection(stepId);
    } else if (stepId === currentSection) {
      // Already on this step
    } else {
      let canProceed = true;
      for (let i = 0; i < stepId; i++) {
        if (!isStepComplete(i)) {
          canProceed = false;
          toast({
            title: "Complete previous sections first",
            description: `Please complete "${STEPS[i].title}" before proceeding.`,
            variant: "destructive",
          });
          break;
        }
      }
      if (canProceed) {
        setCurrentSection(stepId);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps before submission
    for (let step = 0; step <= 7; step++) {
      const validation = validateStep(step);
      if (!validation.isValid) {
        setCurrentSection(step);
        toast({
          title: "Please complete all sections",
          description: `Section "${STEPS[step].title}": ${validation.errors[0]}`,
          variant: "destructive",
        });
        return;
      }
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
          valueDrivers,
          valueDriverExplanations,
        },
        section3: {
          customerType,
          customerTypeExplanation,
          businessStructure,
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
          gtmAcquisition,
          gtmTimeline,
        },
        section5: {
          targetGeography,
          targetCustomerDescription,
          tamValue,
          tamCalculationMethod,
          tamBreakdown,
          samValue,
          samBreakdown,
          somValue,
          somTimeframe,
          somBreakdown,
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
          current_ask: gtmAcquisition || "N/A",
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
      <p className={`text-xs ${isValid ? "text-[hsl(var(--cyan-glow))]" : "text-muted-foreground"}`}>
        {words} / {min}-{max} words
      </p>
    );
  };

  // Thank You Page
  if (isSubmitted) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{ background: "var(--gradient-navy-teal)" }}>
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
              Thank You!
            </h1>
            <p className="text-lg text-[hsl(var(--navy-deep))]/70 mb-4">
              Your application is under review.
            </p>
            <p className="text-[hsl(var(--navy-deep))]/60 mb-8">
              We'll get back to you with your dashboard login featuring curated investors matched to your company.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="border-[hsl(var(--navy-deep))]/20 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5 font-semibold px-8"
              >
                Back to Home
              </Button>
              <Button
                onClick={() => navigate("/founder-dashboard")}
                className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-glow))]/90 font-semibold px-8"
              >
                Preview Dashboard
              </Button>
            </div>
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
                        className="text-muted-foreground hover:text-[hsl(var(--navy-deep))] hover:bg-muted"
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
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Section 2 — Value Proposition</h2>
              <p className="text-[hsl(var(--navy-deep))]/70">What value do you deliver and why does it matter?</p>
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

            {/* 2.2 Value Drivers - Multi-select dropdown */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">2.2 How do you deliver value?</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  Select all the ways your solution delivers value to customers. For each selection, you'll explain how.
                </p>
              </div>
              
              <div className="space-y-3">
                {VALUE_DRIVER_OPTIONS.map((option) => (
                  <div 
                    key={option.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      valueDrivers.includes(option.value)
                        ? "border-[hsl(var(--cyan-glow))] bg-[hsl(var(--cyan-glow))]/10"
                        : "border-[hsl(var(--navy-deep))]/20 hover:border-[hsl(var(--cyan-glow))]/50"
                    }`}
                    onClick={() => {
                      if (valueDrivers.includes(option.value)) {
                        setValueDrivers(valueDrivers.filter(v => v !== option.value));
                      } else {
                        setValueDrivers([...valueDrivers, option.value]);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox checked={valueDrivers.includes(option.value)} />
                      <div className="flex-1">
                        <div className="font-medium text-[hsl(var(--navy-deep))]">{option.label}</div>
                        <div className="text-sm text-[hsl(var(--navy-deep))]/60">{option.description}</div>
                      </div>
                    </div>
                    
                    {valueDrivers.includes(option.value) && (
                      <div className="mt-4 pt-4 border-t border-[hsl(var(--navy-deep))]/10">
                        <Textarea
                          value={valueDriverExplanations[option.value] || ""}
                          onChange={(e) => {
                            e.stopPropagation();
                            setValueDriverExplanations({
                              ...valueDriverExplanations,
                              [option.value]: e.target.value,
                            });
                          }}
                          onClick={(e) => e.stopPropagation()}
                          placeholder={option.prompt}
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Section 3 — Business Model</h2>
              <p className="text-[hsl(var(--navy-deep))]/70">How do you make money?</p>
            </div>

            {/* 3.1 Customer Type */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">3.1 Who is your customer?</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">Select all that apply</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {CUSTOMER_TYPES.map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={customerType.includes(type) ? "default" : "outline"}
                    onClick={() => toggleCheckbox(type, customerType, setCustomerType)}
                    className={customerType.includes(type) ? "bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))]" : ""}
                  >
                    {type}
                  </Button>
                ))}
              </div>
              {customerType.length > 0 && (
                <div className="space-y-2">
                  <Label>Explain your customer type choice</Label>
                  <Textarea
                    value={customerTypeExplanation}
                    onChange={(e) => setCustomerTypeExplanation(e.target.value)}
                    placeholder="Why did you choose this customer type? How does this affect your go-to-market?"
                    rows={2}
                  />
                </div>
              )}
            </div>

            {/* 3.2 Business Structure */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">3.2 Business Structure</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">How is your business structured?</p>
              </div>
              <Textarea
                value={businessStructure}
                onChange={(e) => setBusinessStructure(e.target.value)}
                placeholder="Describe your business structure, including revenue streams, cost structure, and key partnerships..."
                rows={3}
              />
            </div>

            {/* 3.3 Pricing Strategy */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">3.3 Pricing Strategy</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">How do you charge customers? Select all that apply.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PRICING_STRATEGIES.map((strategy) => (
                  <div
                    key={strategy.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      pricingStrategies.includes(strategy.id)
                        ? "border-[hsl(var(--cyan-glow))] bg-[hsl(var(--cyan-glow))]/10"
                        : "border-[hsl(var(--navy-deep))]/20 hover:border-[hsl(var(--cyan-glow))]/50"
                    }`}
                    onClick={() => toggleCheckbox(strategy.id, pricingStrategies, setPricingStrategies)}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox checked={pricingStrategies.includes(strategy.id)} />
                      <span className="font-medium">{strategy.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic sub-fields based on pricing strategy */}
              {pricingStrategies.includes("subscription") && (
                <div className="p-4 bg-[hsl(var(--cyan-glow))]/5 border border-[hsl(var(--cyan-glow))]/20 rounded-lg space-y-4">
                  <Label className="font-medium">Subscription Details</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Type</Label>
                      <Select value={subscriptionType} onValueChange={setSubscriptionType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flat">Flat Rate</SelectItem>
                          <SelectItem value="tiered">Tiered</SelectItem>
                          <SelectItem value="per-seat">Per Seat</SelectItem>
                          <SelectItem value="usage-based">Usage-Based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Billing Cycle</Label>
                      <Select value={subscriptionBillingCycle} onValueChange={setSubscriptionBillingCycle}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cycle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Pricing Tiers</Label>
                    <Input
                      value={subscriptionTiers}
                      onChange={(e) => setSubscriptionTiers(e.target.value)}
                      placeholder="e.g., Free, Pro ($29/mo), Enterprise (custom)"
                    />
                  </div>
                </div>
              )}

              {pricingStrategies.includes("transaction") && (
                <div className="p-4 bg-[hsl(var(--cyan-glow))]/5 border border-[hsl(var(--cyan-glow))]/20 rounded-lg space-y-4">
                  <Label className="font-medium">Transaction Fee Details</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Fee Type</Label>
                      <Select value={transactionFeeType} onValueChange={setTransactionFeeType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="flat">Flat Fee</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Fee Amount</Label>
                      <Input
                        value={transactionFeePercentage}
                        onChange={(e) => setTransactionFeePercentage(e.target.value)}
                        placeholder="e.g., 2.9% + $0.30"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3.4 Revenue Metrics */}
            {pricingStrategies.length > 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-semibold">3.4 Key Metrics</Label>
                  <p className="text-sm text-[hsl(var(--navy-deep))]/60">Select the metrics you track</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getRelevantMetrics().map((metric) => (
                    <Button
                      key={metric}
                      type="button"
                      variant={revenueMetrics.includes(metric) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCheckbox(metric, revenueMetrics, setRevenueMetrics)}
                      className={revenueMetrics.includes(metric) ? "bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))]" : ""}
                    >
                      {metric}
                    </Button>
                  ))}
                </div>
                {revenueMetrics.length > 0 && (
                  <div className="space-y-2">
                    <Label>Current Values (optional)</Label>
                    <Textarea
                      value={revenueMetricsValues}
                      onChange={(e) => setRevenueMetricsValues(e.target.value)}
                      placeholder="Share your current metrics (e.g., MRR: $10k, ARR: $120k, Churn: 5%)"
                      rows={2}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Section 4 — Go-to-Market Strategy</h2>
              <p className="text-[hsl(var(--navy-deep))]/70">How do you acquire and retain customers?</p>
            </div>

            {/* 4.1 Customer Acquisition */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">4.1 How do you acquire customers?</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  Describe your primary customer acquisition channels and strategy.
                </p>
              </div>
              <Textarea
                value={gtmAcquisition}
                onChange={(e) => setGtmAcquisition(e.target.value)}
                placeholder="We acquire customers through [channels]. Our primary strategy is [approach]. Our customer journey looks like [description]..."
                rows={4}
              />
            </div>

            {/* 4.2 Timeline */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">4.2 GTM Timeline</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  What are your near-term milestones?
                </p>
              </div>
              <Textarea
                value={gtmTimeline}
                onChange={(e) => setGtmTimeline(e.target.value)}
                placeholder="In the next 6-12 months, we plan to [milestones]. Key targets include [goals]..."
                rows={3}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Section 5 — Target Customer & Market Sizing</h2>
              <p className="text-[hsl(var(--navy-deep))]/70">Who do you serve and how big is the opportunity?</p>
            </div>

            {/* 5.1 Target Geography */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">5.1 Target Geography</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">Where do you sell?</p>
              </div>
              <Input
                value={targetGeography}
                onChange={(e) => setTargetGeography(e.target.value)}
                placeholder="e.g., US, North America, Global, Boston Metro Area"
              />
            </div>

            {/* 5.2 Target Customer Description */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">5.2 Ideal Customer Profile</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  Describe your ideal customer in detail.
                </p>
              </div>
              <Textarea
                value={targetCustomerDescription}
                onChange={(e) => setTargetCustomerDescription(e.target.value)}
                placeholder="Our ideal customer is [description]. They typically have [characteristics]. The decision maker is usually [role]..."
                rows={4}
              />
              <WordCounter current={targetCustomerDescription} min={20} max={150} />
            </div>

            {/* 5.3 TAM */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">5.3 Total Addressable Market (TAM)</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  The total market demand for your product/service.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>TAM Value *</Label>
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
                      <SelectItem value="top-down">Top-Down</SelectItem>
                      <SelectItem value="bottom-up">Bottom-Up</SelectItem>
                      <SelectItem value="value-theory">Value Theory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>TAM Breakdown</Label>
                <Textarea
                  value={tamBreakdown}
                  onChange={(e) => setTamBreakdown(e.target.value)}
                  placeholder="Explain how you arrived at this number..."
                  rows={2}
                />
              </div>
            </div>

            {/* 5.4 SAM */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">5.4 Serviceable Addressable Market (SAM)</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  The portion of TAM you can realistically target.
                </p>
              </div>
              <div className="space-y-2">
                <Label>SAM Value *</Label>
                <Input
                  value={samValue}
                  onChange={(e) => setSamValue(e.target.value)}
                  placeholder="e.g., $5B"
                />
              </div>
              <div className="space-y-2">
                <Label>SAM Breakdown</Label>
                <Textarea
                  value={samBreakdown}
                  onChange={(e) => setSamBreakdown(e.target.value)}
                  placeholder="Explain your SAM calculation..."
                  rows={2}
                />
              </div>
            </div>

            {/* 5.5 SOM */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">5.5 Serviceable Obtainable Market (SOM)</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  The realistic market share you can capture.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SOM Value *</Label>
                  <Input
                    value={somValue}
                    onChange={(e) => setSomValue(e.target.value)}
                    placeholder="e.g., $100M"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Timeframe</Label>
                  <Input
                    value={somTimeframe}
                    onChange={(e) => setSomTimeframe(e.target.value)}
                    placeholder="e.g., 5 years"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>SOM Breakdown</Label>
                <Textarea
                  value={somBreakdown}
                  onChange={(e) => setSomBreakdown(e.target.value)}
                  placeholder="Explain how you plan to capture this market share..."
                  rows={2}
                />
              </div>
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

            {/* 6.1 Competitors */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">6.1 Key Competitors</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  List 3-5 competitors and explain how you differ.
                </p>
              </div>
              
              {competitors.map((competitor, index) => (
                <div key={index} className="p-4 border border-[hsl(var(--navy-deep))]/10 rounded-lg space-y-4 bg-white">
                  <div className="flex justify-between items-center">
                    <Label className="font-medium">Competitor {index + 1}</Label>
                    {competitors.length > 3 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCompetitor(index)}
                        className="text-muted-foreground hover:text-[hsl(var(--navy-deep))] hover:bg-muted"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={competitor.name}
                        onChange={(e) => updateCompetitor(index, "name", e.target.value)}
                        placeholder="Competitor name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>What they do</Label>
                      <Input
                        value={competitor.description}
                        onChange={(e) => updateCompetitor(index, "description", e.target.value)}
                        placeholder="Brief description"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>How you differ</Label>
                      <Textarea
                        value={competitor.howYouDiffer}
                        onChange={(e) => updateCompetitor(index, "howYouDiffer", e.target.value)}
                        placeholder="Your competitive advantage against them..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {competitors.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCompetitor}
                  className="w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Competitor
                </Button>
              )}
            </div>

            {/* 6.2 Competitive Moat */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">6.2 Your Moat</Label>
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
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/founder-dashboard")}
                className="text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/30 hover:bg-[hsl(var(--cyan-glow))]/10"
              >
                Preview Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg" />
                <span className="text-xl font-bold text-white">In-Sync</span>
              </div>
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

            {/* Progress Steps */}
            <div className="hidden md:flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isCompleted = isStepComplete(step.id) && (completedSteps.includes(step.id) || currentSection > step.id);
                const isCurrent = currentSection === step.id;
                const canAccess = step.id <= currentSection || completedSteps.includes(step.id - 1) || (step.id > 0 && isStepComplete(step.id - 1));
                
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
                    disabled={!canAccess && step.id > currentSection}
                    className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${
                      isCurrent ? "bg-white/20" : 
                      canAccess ? "hover:bg-white/10 cursor-pointer" : "cursor-not-allowed opacity-50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? "bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))]" :
                      isCurrent ? "bg-white text-[hsl(var(--navy-deep))]" :
                      "bg-white/20 text-white/60"
                    }`}>
                      {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span className={`text-xs font-medium ${isCurrent ? "text-white" : "text-white/60"}`}>
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Progress */}
            <div className="md:hidden flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <span className="text-white font-medium">Step {currentSection + 1} of 8</span>
              <span className="text-white/70 text-sm">{STEPS[currentSection].title}</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="bg-white/95 backdrop-blur-sm border-2 border-[hsl(var(--cyan-glow))]/20 rounded-2xl p-8 md:p-10 shadow-2xl">
                {renderSection()}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-8 mt-8 border-t">
                  {currentSection > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="gap-2 border-[hsl(var(--navy-deep))]/20"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>
                  )}
                  
                  <div className="flex-1" />
                  
                  {currentSection < 7 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="gap-2 bg-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/90"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="gap-2 bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-glow))]/90 font-semibold"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                      <ArrowRight className="h-4 w-4" />
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
