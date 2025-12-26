import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ArrowRight, Upload, Check, Building2, Briefcase, Target, Users, Handshake, FolderOpen, Shield, Plus, X, GripVertical, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";

const STEPS = [
  { id: 0, title: "Welcome", icon: Sparkles },
  { id: 1, title: "Admin & Verification", icon: Shield },
  { id: 2, title: "Fund Overview", icon: Building2 },
  { id: 3, title: "Investment Thesis", icon: Target },
  { id: 4, title: "What You Look For", icon: Users },
  { id: 5, title: "Deal Mechanics", icon: Briefcase },
  { id: 6, title: "Value-Add", icon: Handshake },
  { id: 7, title: "Portfolio & Conflicts", icon: FolderOpen },
];

const FUND_TYPES = ["VC", "Micro-VC", "Seed Fund", "Angel Syndicate", "CVC", "Family Office", "Accelerator Fund"];
const CHECK_SIZES = ["<$50K", "$50–150K", "$150–250K", "$250–500K", "$500K–$1M", "$1–3M", "$3–7M", "$7M+"];
const STAGE_FOCUS = ["Idea/Concept", "Pre-seed", "Seed", "Seed+", "Series A", "Series A+", "Series B", "Series B+", "Series C+", "Growth", "Late Stage"];
const SECTOR_TAGS = [
  // Core Tech
  "AI/ML", "Generative AI", "Computer Vision", "NLP", "Robotics", "Automation",
  // FinTech
  "FinTech", "Payments", "InsurTech", "WealthTech", "Lending", "Banking Infrastructure", "Crypto/Web3", "DeFi",
  // Health & Life Sciences
  "HealthTech", "Digital Health", "Biotech", "MedTech", "Mental Health", "Femtech", "AgeTech", "Genomics",
  // Enterprise & B2B
  "SaaS", "Enterprise Software", "DevTools", "Developer Infrastructure", "API-First", "Cybersecurity", "Data Infrastructure", "Cloud Infrastructure",
  // Consumer & Marketplace
  "Consumer", "D2C", "Marketplace", "E-commerce", "Creator Economy", "Social", "Gaming", "EdTech",
  // Sustainability & Impact
  "Climate", "CleanTech", "AgTech", "FoodTech", "Sustainability", "Impact",
  // Industry Specific
  "PropTech", "Real Estate", "Construction Tech", "Logistics", "Supply Chain", "Manufacturing", "Industrial", "LegalTech", "HR Tech", "Recruiting",
  // Emerging
  "SpaceTech", "DeepTech", "Quantum", "AR/VR", "IoT", "5G/Connectivity",
  // Other
  "Other"
];
const LEAD_FOLLOW = ["Lead", "Co-lead", "Follow", "Flexible"];
const CUSTOMER_TYPES = ["SMB", "Mid-market", "Enterprise", "Consumer", "Gov", "Hybrid"];
const REVENUE_MODELS = ["Subscription", "Usage", "Transaction", "Licensing", "Services", "Ads"];
const TRACTION_LEVELS = ["Idea", "Prototype", "Beta users", "Pilots", "Paid pilots", "$X MRR", "$X ARR", "Enterprise LOIs", "Other"];
const METRICS = ["ARR/MRR", "Growth rate", "GRR/NRR", "Churn", "CAC payback", "LTV/CAC", "Gross margin", "Sales efficiency", "Cohort retention", "NPS/CSAT"];
const DECISION_PROCESS = ["Partner-led", "IC", "Rolling", "Committee"];
const RESPONSE_TIMES = ["24h", "48h", "1 week", "2 weeks", "Varies"];
const DECISION_TIMES = ["2–4 wks", "4–8 wks", "8+ wks"];
const BOARD_INVOLVEMENT = ["None", "Observer", "Board seat sometimes", "Usually"];
const OPERATING_SUPPORT = ["Hiring (exec + IC)", "GTM / sales strategy", "Enterprise intros", "Fundraising strategy", "Product strategy", "Partnerships / distribution", "Compliance / security guidance", "Community / events"];
const TALENT_NETWORKS = ["Engineering", "Growth", "Finance", "Operators"];
const SUPPORT_STYLE = ["High-touch (weekly)", "Medium", "Light-touch", "On-demand"];
const CONFLICTS_POLICY = ["Strict", "Case-by-case", "Flexible"];
const FAST_SIGNALS = ["Customer pull", "Retention", "Revenue", "Pilots", "Technical moat", "Regulatory clearance", "Other"];
const HARD_NOS = ["Geography restrictions", "Certain sectors", "Business model types", "Other"];

interface Contact {
  name: string;
  title: string;
  email: string;
}

export default function InvestorApplication() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [thesisMemo, setThesisMemo] = useState<File | null>(null);
  const [thesisMemoName, setThesisMemoName] = useState<string | null>(null);
  const [sectorTagsOpen, setSectorTagsOpen] = useState(false);
  const [customSectorTag, setCustomSectorTag] = useState("");
  
  const [formData, setFormData] = useState({
    // Section 1: Admin & Verification
    firmName: "",
    website: "",
    companyLinkedIn: "",
    hqLocation: "",
    otherLocationBranches: [] as string[],
    otherLocationBranchesText: "",
    contacts: [{ name: "", title: "", email: "" }] as Contact[],
    publicProfile: true,
    investorName: "",
    investorEmail: "",
    investorPassword: "",
    investorConfirmPassword: "",
    
    // Section 2: Fund Overview
    firmDescription: "",
    aum: "",
    fundVintage: "",
    fundType: "",
    ownershipTarget: "",
    leadFollow: "",
    checkSizes: [] as string[],
    stageFocus: [] as string[],
    sectorTags: [] as string[],
    portfolioCount: "",
    topInvestments: "",
    geographicFocus: "" as "" | "boston" | "other",
    geographicFocusDetail: "",
    
    // Section 3: Investment Thesis
    thesisStatement: "",
    subThemes: [] as string[],
    subThemesOther: "",
    nonNegotiables: {
      category: false,
      traction: false,
      founderProfile: false,
      businessModel: false,
      complianceConstraints: false,
    },
    hardNos: [] as string[],
    fastSignals: [] as string[],
    
    // Section 4: What You Look For
    painSeverity: "",
    buyerPersonaRequired: false,
    buyerPersonaWho: "",
    customerTypes: [] as string[],
    regulatedIndustries: "",
    b2bB2c: "",
    b2bB2cWhy: "",
    revenueModels: [] as string[],
    minimumTraction: [] as string[],
    rankedMetrics: [] as string[],
    
    // Section 5: Deal Mechanics
    decisionProcess: "",
    timeToFirstResponse: "",
    timeToDecision: "",
    givesNoWithFeedback: null as boolean | null,
    feedbackWhen: "",
    followOnReserves: "",
    followOnWhen: "",
    boardInvolvement: "",
    
    // Section 6: Value-Add
    operatingSupport: [] as string[],
    customerVerticals: "",
    partnerCategories: "",
    talentNetworks: [] as string[],
    supportStyle: "",
    
    // Section 7: Portfolio & Conflicts
    portfolioList: "",
    conflictsPolicy: "",
    investsInCompetitors: false,
    signsNDAs: false,
    ndaConditions: "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => {
      const arr = prev[field as keyof typeof prev] as string[];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter(v => v !== value) };
      }
      return { ...prev, [field]: [...arr, value] };
    });
  };

  // Contact management
  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { name: "", title: "", email: "" }]
    }));
  };

  const removeContact = (index: number) => {
    if (formData.contacts.length > 1) {
      setFormData(prev => ({
        ...prev,
        contacts: prev.contacts.filter((_, i) => i !== index)
      }));
    }
  };

  const updateContact = (index: number, field: keyof Contact, value: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  // Metrics ranking
  const handleMetricRank = (metric: string) => {
    setFormData(prev => {
      const ranked = [...prev.rankedMetrics];
      if (ranked.includes(metric)) {
        return { ...prev, rankedMetrics: ranked.filter(m => m !== metric) };
      }
      if (ranked.length < 5) {
        return { ...prev, rankedMetrics: [...ranked, metric] };
      }
      return prev;
    });
  };

  const moveMetricUp = (index: number) => {
    if (index === 0) return;
    setFormData(prev => {
      const ranked = [...prev.rankedMetrics];
      [ranked[index - 1], ranked[index]] = [ranked[index], ranked[index - 1]];
      return { ...prev, rankedMetrics: ranked };
    });
  };

  const moveMetricDown = (index: number) => {
    if (index === formData.rankedMetrics.length - 1) return;
    setFormData(prev => {
      const ranked = [...prev.rankedMetrics];
      [ranked[index], ranked[index + 1]] = [ranked[index + 1], ranked[index]];
      return { ...prev, rankedMetrics: ranked };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps before submission
    for (let step = 0; step <= 7; step++) {
      const validation = validateStep(step);
      if (!validation.isValid) {
        setCurrentStep(step);
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
      // First, create the user account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.investorEmail,
        password: formData.investorPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/investor-dashboard`,
          data: {
            full_name: formData.investorName,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message?.includes("User already registered")) {
          toast({
            title: "Account Already Exists",
            description: "This email is already registered. Please use the login page to access your dashboard.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account Creation Failed",
            description: signUpError.message,
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
        return;
      }

      const user = signUpData.user;

      if (!user) {
        toast({
          title: "Account Creation Failed",
          description: "Unable to create account. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Combine branches with text entry if "Other" is selected
      const allBranches = formData.otherLocationBranches.includes("Other") && formData.otherLocationBranchesText.trim()
        ? [...formData.otherLocationBranches.filter(b => b !== "Other"), formData.otherLocationBranchesText.trim()]
        : formData.otherLocationBranches;

      const applicationData = {
        user_id: user.id,
        firm_name: formData.firmName,
        website: formData.website,
        hq_location: formData.hqLocation,
        geographies_covered: allBranches as unknown as null,
        contacts: formData.contacts as unknown as null,
        public_profile: formData.publicProfile,
        firm_description: formData.firmDescription,
        aum: formData.aum,
        fund_vintage: formData.fundVintage,
        fund_type: formData.fundType,
        ownership_target: formData.ownershipTarget,
        lead_follow: formData.leadFollow,
        check_sizes: formData.checkSizes as unknown as null,
        stage_focus: formData.stageFocus as unknown as null,
        sector_tags: formData.sectorTags as unknown as null,
        portfolio_count: formData.portfolioCount,
        top_investments: formData.topInvestments,
        geographic_focus: formData.geographicFocus,
        geographic_focus_detail: formData.geographicFocusDetail,
        thesis_statement: formData.thesisStatement,
        sub_themes: formData.subThemes as unknown as null,
        sub_themes_other: formData.subThemesOther,
        non_negotiables: formData.nonNegotiables as unknown as null,
        hard_nos: formData.hardNos as unknown as null,
        fast_signals: formData.fastSignals as unknown as null,
        pain_severity: formData.painSeverity,
        buyer_persona_required: formData.buyerPersonaRequired,
        buyer_persona_who: formData.buyerPersonaWho,
        customer_types: formData.customerTypes as unknown as null,
        regulated_industries: formData.regulatedIndustries,
        b2b_b2c: formData.b2bB2c,
        b2b_b2c_why: formData.b2bB2cWhy,
        revenue_models: formData.revenueModels as unknown as null,
        minimum_traction: formData.minimumTraction as unknown as null,
        ranked_metrics: formData.rankedMetrics as unknown as null,
        decision_process: formData.decisionProcess,
        time_to_first_response: formData.timeToFirstResponse,
        time_to_decision: formData.timeToDecision,
        gives_no_with_feedback: formData.givesNoWithFeedback,
        feedback_when: formData.feedbackWhen,
        follow_on_reserves: formData.followOnReserves,
        follow_on_when: formData.followOnWhen,
        board_involvement: formData.boardInvolvement,
        operating_support: formData.operatingSupport as unknown as null,
        customer_verticals: formData.customerVerticals,
        partner_categories: formData.partnerCategories,
        talent_networks: formData.talentNetworks as unknown as null,
        support_style: formData.supportStyle,
        portfolio_list: formData.portfolioList,
        conflicts_policy: formData.conflictsPolicy,
        invests_in_competitors: formData.investsInCompetitors,
        signs_ndas: formData.signsNDAs,
        nda_conditions: formData.ndaConditions,
      };

      // Check if user already has an application
      const { data: existing } = await supabase
        .from("investor_applications")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        // Update existing application
        const { error } = await supabase
          .from("investor_applications")
          .update(applicationData)
          .eq("id", existing.id);
        
        if (error) throw error;
      } else {
        // Insert new application
        const { error } = await supabase
          .from("investor_applications")
          .insert(applicationData);
        
        if (error) throw error;
      }

      toast({
        title: "Welcome to In-Sync!",
        description: "Your application has been submitted. Redirecting to your dashboard...",
      });
      navigate("/investor-dashboard");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation function for each step
  const validateStep = (step: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    switch (step) {
      case 0: // Welcome - no validation needed
        break;
      case 1: // Admin & Verification
        if (!formData.firmName.trim()) errors.push("Firm/Fund name is required");
        if (!formData.website.trim()) errors.push("Website is required");
        if (!formData.hqLocation.trim()) errors.push("HQ location is required");
        if (!formData.investorName.trim()) errors.push("Your name is required");
        if (!formData.investorEmail.trim()) errors.push("Your email is required");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.investorEmail)) errors.push("Please enter a valid email address");
        if (formData.investorPassword.length < 8) errors.push("Password must be at least 8 characters");
        if (!/[A-Z]/.test(formData.investorPassword)) errors.push("Password must contain at least one uppercase letter");
        if (!/[a-z]/.test(formData.investorPassword)) errors.push("Password must contain at least one lowercase letter");
        if (!/[0-9]/.test(formData.investorPassword)) errors.push("Password must contain at least one number");
        if (formData.investorPassword !== formData.investorConfirmPassword) errors.push("Passwords do not match");
        // Validate at least the first contact
        if (!formData.contacts[0]?.name.trim()) errors.push("At least one contact name is required");
        if (!formData.contacts[0]?.title.trim()) errors.push("At least one contact title is required");
        if (!formData.contacts[0]?.email.trim()) errors.push("At least one contact email is required");
        break;
      case 2: // Fund Overview
        if (!formData.firmDescription.trim()) errors.push("Firm description is required");
        if (!formData.fundType) errors.push("Fund type is required");
        if (!formData.leadFollow) errors.push("Lead vs Follow preference is required");
        if (formData.checkSizes.length === 0) errors.push("Select at least one check size");
        if (formData.stageFocus.length === 0) errors.push("Select at least one stage focus");
        if (!formData.geographicFocus) errors.push("Geographic focus selection is required");
        if (formData.geographicFocus === "other" && !formData.geographicFocusDetail.trim()) {
          errors.push("Please specify your geographic focus");
        }
        break;
      case 3: // Investment Thesis
        if (!formData.thesisStatement.trim()) errors.push("Thesis statement is required");
        if (formData.fastSignals.length === 0) errors.push("Select at least one fast signal");
        break;
      case 4: // What You Look For
        if (!formData.painSeverity) errors.push("Pain severity preference is required");
        if (formData.customerTypes.length === 0) errors.push("Select at least one customer type");
        if (!formData.b2bB2c) errors.push("B2B/B2C preference is required");
        if (formData.revenueModels.length === 0) errors.push("Select at least one revenue model");
        if (formData.minimumTraction.length === 0) errors.push("Select at least one minimum traction level");
        if (formData.rankedMetrics.length < 5) errors.push("Please rank exactly 5 metrics");
        break;
      case 5: // Deal Mechanics
        if (!formData.decisionProcess) errors.push("Decision process is required");
        if (!formData.timeToFirstResponse) errors.push("Time to first response is required");
        if (!formData.timeToDecision) errors.push("Time to decision is required");
        if (!formData.boardInvolvement) errors.push("Board involvement preference is required");
        if (formData.givesNoWithFeedback === null) errors.push("Please indicate if you give 'no' with feedback");
        if (formData.givesNoWithFeedback === true && !formData.feedbackWhen.trim()) {
          errors.push("Please describe when you provide feedback");
        }
        break;
      case 6: // Value-Add
        if (formData.operatingSupport.length === 0) errors.push("Select at least one operating support type");
        if (!formData.supportStyle) errors.push("Support style is required");
        break;
      case 7: // Portfolio & Conflicts
        if (!formData.conflictsPolicy) errors.push("Conflicts policy is required");
        break;
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const isStepComplete = (step: number): boolean => {
    return validateStep(step).isValid;
  };

  const nextStep = () => {
    // TESTING MODE: Skip validation for testing purposes
    // const validation = validateStep(currentStep);
    // if (!validation.isValid) {
    //   toast({
    //     title: "Please complete required fields",
    //     description: validation.errors[0],
    //     variant: "destructive",
    //   });
    //   return;
    // }
    
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 7));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleStepClick = (stepId: number) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
    } else if (stepId === currentStep) {
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
        setCurrentStep(stepId);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-[hsl(var(--navy-deep))]">Welcome</h2>
              <p className="text-lg text-[hsl(var(--navy-deep))]/80 max-w-2xl mx-auto">
                Help us understand your <strong>investment thesis</strong>, <strong>deal criteria</strong>, and <strong>value-add</strong> so we can match you with the right startups.
              </p>
            </div>

            <div className="bg-[hsl(var(--cyan-glow))]/10 border border-[hsl(var(--cyan-glow))]/30 rounded-xl p-6 space-y-4">
              <p className="text-[hsl(var(--navy-deep))]/80">
                This application is structured so that, by the end, you will have effectively created a <strong>comprehensive investor profile</strong>.
              </p>
              <p className="text-[hsl(var(--navy-deep))]/70">Every question helps founders understand:</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 bg-white border border-[hsl(var(--cyan-glow))]/20 rounded-xl">
                <div className="text-2xl font-bold text-[hsl(var(--cyan-glow))] mb-2">THESIS</div>
                <p className="text-[hsl(var(--navy-deep))]/70">Your investment philosophy & focus areas</p>
              </div>
              <div className="p-5 bg-white border border-[hsl(var(--cyan-glow))]/20 rounded-xl">
                <div className="text-2xl font-bold text-[hsl(var(--cyan-glow))] mb-2">CRITERIA</div>
                <p className="text-[hsl(var(--navy-deep))]/70">Stage, check size & what makes you say yes</p>
              </div>
              <div className="p-5 bg-white border border-[hsl(var(--cyan-glow))]/20 rounded-xl">
                <div className="text-2xl font-bold text-[hsl(var(--cyan-glow))] mb-2">PROCESS</div>
                <p className="text-[hsl(var(--navy-deep))]/70">How you evaluate & close deals</p>
              </div>
              <div className="p-5 bg-white border border-[hsl(var(--cyan-glow))]/20 rounded-xl">
                <div className="text-2xl font-bold text-[hsl(var(--cyan-glow))] mb-2">VALUE-ADD</div>
                <p className="text-[hsl(var(--navy-deep))]/70">How you support portfolio companies</p>
              </div>
            </div>

            <p className="text-sm text-[hsl(var(--navy-deep))]/60 text-center italic">
              Your profile will be shown to vetted founders seeking investment.
            </p>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Admin & Verification</h2>
              <p className="text-muted-foreground">Basic firm information and verification details</p>
            </div>
            
            {/* Profile & Documents (Optional) */}
            <div className="p-6 bg-muted/30 rounded-xl space-y-6">
              <h3 className="text-lg font-semibold text-[hsl(var(--navy-deep))]">Profile & Documents (Optional)</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    {profilePicturePreview ? (
                      <div className="relative">
                        <img 
                          src={profilePicturePreview} 
                          alt="Profile preview" 
                          className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProfilePicture(null);
                            setProfilePicturePreview(null);
                          }}
                          className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        id="profilePicture"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setProfilePicture(file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setProfilePicturePreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('profilePicture')?.click()}
                      >
                        {profilePicturePreview ? "Change" : "Upload"}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG, or GIF</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Thesis / Memo (Optional)</Label>
                  <p className="text-xs text-muted-foreground">Upload your investment thesis or firm memo if applicable</p>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      id="thesisMemo"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 20 * 1024 * 1024) {
                            toast({
                              title: "File Too Large",
                              description: "Please upload a file smaller than 20MB.",
                              variant: "destructive",
                            });
                            return;
                          }
                          setThesisMemo(file);
                          setThesisMemoName(file.name);
                        }
                      }}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('thesisMemo')?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {thesisMemoName ? "Change File" : "Upload File"}
                    </Button>
                    {thesisMemoName && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="truncate max-w-[150px]">{thesisMemoName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setThesisMemo(null);
                            setThesisMemoName(null);
                          }}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX (max 20MB)</p>
                </div>
              </div>
            </div>

            {/* 1.1 Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[hsl(var(--navy-deep))]">1.1 Company Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firmName">Firm / Fund Name *</Label>
                  <Input
                    id="firmName"
                    value={formData.firmName}
                    onChange={(e) => handleChange("firmName", e.target.value)}
                    placeholder="Acme Ventures"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website *</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    placeholder="https://acmeventures.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyLinkedIn">Company LinkedIn</Label>
                  <Input
                    id="companyLinkedIn"
                    type="url"
                    value={formData.companyLinkedIn}
                    onChange={(e) => handleChange("companyLinkedIn", e.target.value)}
                    placeholder="https://linkedin.com/company/acme-ventures"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hqLocation">HQ Location *</Label>
                  <Input
                    id="hqLocation"
                    value={formData.hqLocation}
                    onChange={(e) => handleChange("hqLocation", e.target.value)}
                    placeholder="Boston, MA"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Other Location Branches</Label>
                <div className="flex flex-wrap gap-2">
                  {["Boston", "New York", "San Francisco", "Los Angeles", "Chicago", "Seattle", "Austin", "Denver", "Miami", "Atlanta", "Washington DC", "Philadelphia", "Dallas", "Houston", "Phoenix", "San Diego", "Toronto", "London", "Tel Aviv", "Singapore", "Berlin", "Paris", "Mumbai", "Bangalore", "Shanghai", "Tokyo", "Sydney", "Other"].map(city => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleArrayToggle("otherLocationBranches", city)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        formData.otherLocationBranches.includes(city)
                          ? "bg-[hsl(var(--navy-deep))] text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
                {formData.otherLocationBranches.includes("Other") && (
                  <div className="mt-3">
                    <Input
                      value={formData.otherLocationBranchesText}
                      onChange={(e) => handleChange("otherLocationBranchesText", e.target.value)}
                      placeholder="Enter other location(s)..."
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 1.2 Your Information */}
            <div className="p-6 bg-muted/30 rounded-xl space-y-4">
              <h3 className="text-lg font-semibold text-[hsl(var(--navy-deep))]">1.2 Your Information</h3>
              <p className="text-sm text-muted-foreground">Primary contact for this application</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="investorName">Your Name *</Label>
                  <Input
                    id="investorName"
                    value={formData.investorName}
                    onChange={(e) => handleChange("investorName", e.target.value)}
                    placeholder="Full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investorEmail">Your Email *</Label>
                  <Input
                    id="investorEmail"
                    type="email"
                    value={formData.investorEmail}
                    onChange={(e) => handleChange("investorEmail", e.target.value)}
                    placeholder="you@company.com"
                    required
                  />
                  <p className="text-xs text-primary italic">This email will be used to log in and access your dashboard.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="investorPassword">Create Password *</Label>
                  <Input
                    id="investorPassword"
                    type="password"
                    value={formData.investorPassword}
                    onChange={(e) => handleChange("investorPassword", e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investorConfirmPassword">Confirm Password *</Label>
                  <Input
                    id="investorConfirmPassword"
                    type="password"
                    value={formData.investorConfirmPassword}
                    onChange={(e) => handleChange("investorConfirmPassword", e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Password must contain:</p>
                <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                  <li className={formData.investorPassword.length >= 8 ? "text-green-600" : ""}>At least 8 characters</li>
                  <li className={/[A-Z]/.test(formData.investorPassword) ? "text-green-600" : ""}>One uppercase letter</li>
                  <li className={/[a-z]/.test(formData.investorPassword) ? "text-green-600" : ""}>One lowercase letter</li>
                  <li className={/[0-9]/.test(formData.investorPassword) ? "text-green-600" : ""}>One number</li>
                </ul>
              </div>
            </div>

            <div className="p-6 bg-muted/30 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[hsl(var(--navy-deep))]">Team Member(s) for Founder Communication *</h3>
                  <p className="text-sm text-muted-foreground">Who from your team will be the primary contact for startups on In-Sync? You can add multiple team members.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addContact}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Member
                </Button>
              </div>
              
              {formData.contacts.map((contact, index) => (
                <div key={index} className="p-4 bg-background rounded-lg border space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Contact {index + 1}</span>
                    {formData.contacts.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContact(index)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input
                        value={contact.name}
                        onChange={(e) => updateContact(index, "name", e.target.value)}
                        placeholder="Jane Smith"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        value={contact.title}
                        onChange={(e) => updateContact(index, "title", e.target.value)}
                        placeholder="Partner"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={contact.email}
                        onChange={(e) => updateContact(index, "email", e.target.value)}
                        placeholder="jane@acmeventures.com"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Fund Overview</h2>
              <p className="text-muted-foreground">The "firm card" founders will see</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="firmDescription">Firm Description *</Label>
              <Textarea
                id="firmDescription"
                value={formData.firmDescription}
                onChange={(e) => {
                  const words = e.target.value.split(/\s+/).filter(Boolean);
                  if (words.length <= 200) {
                    handleChange("firmDescription", e.target.value);
                  }
                }}
                placeholder="We invest in early-stage B2B SaaS companies transforming enterprise workflows..."
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">{formData.firmDescription.split(/\s+/).filter(Boolean).length}/200 words</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="aum">AUM / Fund Size</Label>
                <Input
                  id="aum"
                  value={formData.aum}
                  onChange={(e) => handleChange("aum", e.target.value)}
                  placeholder="$50M - $100M"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fundVintage">Year Fund Founded</Label>
                <Input
                  id="fundVintage"
                  value={formData.fundVintage}
                  onChange={(e) => handleChange("fundVintage", e.target.value)}
                  placeholder="2020"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownershipTarget">Typical Ownership Target (%)</Label>
                <Input
                  id="ownershipTarget"
                  value={formData.ownershipTarget}
                  onChange={(e) => handleChange("ownershipTarget", e.target.value)}
                  placeholder="10-15%"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fund Type *</Label>
              <Select value={formData.fundType} onValueChange={(v) => handleChange("fundType", v)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {FUND_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkSize">Typical Check Size *</Label>
              <Input
                id="checkSize"
                value={formData.checkSizes.join(", ")}
                onChange={(e) => handleChange("checkSizes", e.target.value ? [e.target.value] : [])}
                placeholder="e.g., $250K - $500K or $1M - $3M"
              />
              <p className="text-xs text-muted-foreground">Enter your typical check size range</p>
            </div>

            <div className="space-y-3">
              <Label>Stage Focus (select all that apply) *</Label>
              <div className="flex flex-wrap gap-2">
                {STAGE_FOCUS.map(stage => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => handleArrayToggle("stageFocus", stage)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.stageFocus.includes(stage)
                        ? "bg-[hsl(var(--navy-deep))] text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Sector Tags (select all that apply)</Label>
              <div className="space-y-3">
                <Select
                  value=""
                  onValueChange={(v) => {
                    if (v && !formData.sectorTags.includes(v)) {
                      handleArrayToggle("sectorTags", v);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Search and select sectors..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {SECTOR_TAGS.filter(tag => !formData.sectorTags.includes(tag)).map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Custom sector input */}
                <div className="flex gap-2">
                  <Input
                    value={customSectorTag}
                    onChange={(e) => setCustomSectorTag(e.target.value)}
                    placeholder="Can't find your sector? Type it here..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customSectorTag.trim()) {
                        e.preventDefault();
                        if (!formData.sectorTags.includes(customSectorTag.trim())) {
                          handleArrayToggle("sectorTags", customSectorTag.trim());
                        }
                        setCustomSectorTag("");
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (customSectorTag.trim() && !formData.sectorTags.includes(customSectorTag.trim())) {
                        handleArrayToggle("sectorTags", customSectorTag.trim());
                        setCustomSectorTag("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>

                {/* Selected tags display */}
                {formData.sectorTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.sectorTags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-primary text-primary-foreground"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleArrayToggle("sectorTags", tag)}
                          className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="portfolioCount">Portfolio Count</Label>
                <Input
                  id="portfolioCount"
                  type="number"
                  value={formData.portfolioCount}
                  onChange={(e) => handleChange("portfolioCount", e.target.value)}
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topInvestments">Top 5 Representative Investments</Label>
                <Textarea
                  id="topInvestments"
                  value={formData.topInvestments}
                  onChange={(e) => handleChange("topInvestments", e.target.value)}
                  placeholder="Company A, Company B, Company C..."
                  rows={2}
                />
              </div>
            </div>

          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Investment Thesis & "Why We Say Yes"</h2>
              <p className="text-muted-foreground">Help founders understand what makes you move</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thesisStatement">Thesis Statement (max 150 words) *</Label>
              <Textarea
                id="thesisStatement"
                value={formData.thesisStatement}
                onChange={(e) => handleChange("thesisStatement", e.target.value)}
                placeholder="We believe the future of work will be powered by AI-native tools that augment human creativity..."
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">{formData.thesisStatement.split(/\s+/).filter(Boolean).length}/150 words</p>
            </div>

            <div className="space-y-3">
              <Label>Sub-themes You're Actively Prioritizing</Label>
              <Textarea
                value={formData.subThemesOther}
                onChange={(e) => handleChange("subThemesOther", e.target.value)}
                placeholder="AI infrastructure, vertical SaaS for healthcare, developer productivity tools..."
                rows={3}
              />
            </div>

            <div className="p-6 bg-muted/30 rounded-xl space-y-4">
              <Label className="font-semibold">Non-Negotiables</Label>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries({
                  category: "Category fit",
                  traction: "Minimum traction",
                  founderProfile: "Founder profile",
                  businessModel: "Business model",
                  complianceConstraints: "Compliance constraints",
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-3">
                    <Checkbox
                      id={key}
                      checked={formData.nonNegotiables[key as keyof typeof formData.nonNegotiables]}
                      onCheckedChange={(checked) => handleChange("nonNegotiables", {
                        ...formData.nonNegotiables,
                        [key]: !!checked
                      })}
                    />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Hard "No's" / Exclusions</Label>
              <div className="flex flex-wrap gap-2">
                {HARD_NOS.map(no => (
                  <button
                    key={no}
                    type="button"
                    onClick={() => handleArrayToggle("hardNos", no)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.hardNos.includes(no)
                        ? "bg-[hsl(var(--navy-deep))] text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {no}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>What Signals Make You Move Fast? *</Label>
              <div className="flex flex-wrap gap-2">
                {FAST_SIGNALS.map(signal => (
                  <button
                    key={signal}
                    type="button"
                    onClick={() => handleArrayToggle("fastSignals", signal)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.fastSignals.includes(signal)
                        ? "bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))]"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {signal}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">What You Look For</h2>
              <p className="text-muted-foreground">Founder + company criteria</p>
            </div>

            <div className="p-6 bg-muted/30 rounded-xl space-y-6">
              <h3 className="font-semibold text-lg">A) Problem & Customer Pain</h3>
              
              <div className="space-y-2">
                <Label>Pain Severity You Prefer *</Label>
                <Select value={formData.painSeverity} onValueChange={(v) => handleChange("painSeverity", v)}>
                  <SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="must-have">Must-have</SelectItem>
                    <SelectItem value="strongly-preferred">Strongly preferred</SelectItem>
                    <SelectItem value="nice-to-have">Nice-to-have</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="buyerPersona"
                    checked={formData.buyerPersonaRequired}
                    onCheckedChange={(checked) => handleChange("buyerPersonaRequired", !!checked)}
                  />
                  <Label htmlFor="buyerPersona">Buyer Persona / Budget Holder Required?</Label>
                </div>
                {formData.buyerPersonaRequired && (
                  <Input
                    value={formData.buyerPersonaWho}
                    onChange={(e) => handleChange("buyerPersonaWho", e.target.value)}
                    placeholder="Who? (e.g., CTO, VP Engineering)"
                  />
                )}
              </div>

              <div className="space-y-3">
                <Label>Customer Type *</Label>
                <div className="flex flex-wrap gap-2">
                  {CUSTOMER_TYPES.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleArrayToggle("customerTypes", type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.customerTypes.includes(type)
                          ? "bg-[hsl(var(--navy-deep))] text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Regulated Industries</Label>
                <Select value={formData.regulatedIndustries} onValueChange={(v) => handleChange("regulatedIndustries", v)}>
                  <SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="okay">Okay</SelectItem>
                    <SelectItem value="preferred">Preferred</SelectItem>
                    <SelectItem value="avoid">Avoid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-6 bg-muted/30 rounded-xl space-y-6">
              <h3 className="font-semibold text-lg">B) Business Model Preferences</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>B2B / B2C Preference *</Label>
                  <Select value={formData.b2bB2c} onValueChange={(v) => handleChange("b2bB2c", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="b2b">B2B</SelectItem>
                      <SelectItem value="b2c">B2C</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Why?</Label>
                  <Input
                    value={formData.b2bB2cWhy}
                    onChange={(e) => handleChange("b2bB2cWhy", e.target.value)}
                    placeholder="Expertise in enterprise sales..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Revenue Model *</Label>
                <div className="flex flex-wrap gap-2">
                  {REVENUE_MODELS.map(model => (
                    <button
                      key={model}
                      type="button"
                      onClick={() => handleArrayToggle("revenueModels", model)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.revenueModels.includes(model)
                          ? "bg-[hsl(var(--navy-deep))] text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Minimum Traction to Engage *</Label>
                <div className="flex flex-wrap gap-2">
                  {TRACTION_LEVELS.map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleArrayToggle("minimumTraction", level)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.minimumTraction.includes(level)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-muted/30 rounded-xl space-y-4">
              <div>
                <h3 className="font-semibold text-lg">C) Metrics You Care About Most *</h3>
                <p className="text-sm text-muted-foreground">Click to select, then use arrows to rank your top 5 in order of importance</p>
              </div>
              
              {/* Selected metrics with ranking */}
              {formData.rankedMetrics.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Your Rankings:</Label>
                  <div className="space-y-2">
                    {formData.rankedMetrics.map((metric, index) => (
                      <div
                        key={metric}
                        className="flex items-center gap-3 p-3 bg-[hsl(var(--navy-deep))] text-white rounded-lg"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full font-bold">
                          {index + 1}
                        </div>
                        <span className="flex-1 font-medium">{metric}</span>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveMetricUp(index)}
                            disabled={index === 0}
                            className="h-8 w-8 p-0 text-white hover:bg-white/20 disabled:opacity-30"
                          >
                            ↑
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveMetricDown(index)}
                            disabled={index === formData.rankedMetrics.length - 1}
                            className="h-8 w-8 p-0 text-white hover:bg-white/20 disabled:opacity-30"
                          >
                            ↓
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMetricRank(metric)}
                            className="h-8 w-8 p-0 text-white hover:bg-white/20"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Available metrics to select */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {formData.rankedMetrics.length < 5 
                    ? `Select ${5 - formData.rankedMetrics.length} more metric${5 - formData.rankedMetrics.length !== 1 ? 's' : ''}:`
                    : "All 5 metrics selected"
                  }
                </Label>
                <div className="flex flex-wrap gap-2">
                  {METRICS.filter(m => !formData.rankedMetrics.includes(m)).map(metric => (
                    <button
                      key={metric}
                      type="button"
                      onClick={() => handleMetricRank(metric)}
                      disabled={formData.rankedMetrics.length >= 5}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.rankedMetrics.length >= 5
                          ? "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {metric}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Deal Mechanics & Process</h2>
              <p className="text-muted-foreground">What founders really want to know</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Decision Process *</Label>
                <Select value={formData.decisionProcess} onValueChange={(v) => handleChange("decisionProcess", v)}>
                  <SelectTrigger><SelectValue placeholder="Select process" /></SelectTrigger>
                  <SelectContent>
                    {DECISION_PROCESS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Board Involvement *</Label>
                <Select value={formData.boardInvolvement} onValueChange={(v) => handleChange("boardInvolvement", v)}>
                  <SelectTrigger><SelectValue placeholder="Select involvement" /></SelectTrigger>
                  <SelectContent>
                    {BOARD_INVOLVEMENT.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Typical Time to First Response *</Label>
                <Select value={formData.timeToFirstResponse} onValueChange={(v) => handleChange("timeToFirstResponse", v)}>
                  <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                  <SelectContent>
                    {RESPONSE_TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Typical Time to Decision *</Label>
                <Select value={formData.timeToDecision} onValueChange={(v) => handleChange("timeToDecision", v)}>
                  <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                  <SelectContent>
                    {DECISION_TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-xl space-y-4">
              <Label className="font-semibold">Do you give "No" with feedback? *</Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleChange("givesNoWithFeedback", true)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    formData.givesNoWithFeedback === true
                      ? "border-[hsl(var(--cyan-glow))] bg-[hsl(var(--cyan-glow))]/10"
                      : "border-muted hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="font-semibold">Yes</div>
                  <div className="text-sm text-muted-foreground">We provide feedback with rejections</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleChange("givesNoWithFeedback", false);
                    handleChange("feedbackWhen", "");
                  }}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    formData.givesNoWithFeedback === false
                      ? "border-[hsl(var(--navy-deep))] bg-[hsl(var(--navy-deep))]/5"
                      : "border-muted hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="font-semibold">No</div>
                  <div className="text-sm text-muted-foreground">We don't typically provide feedback</div>
                </button>
              </div>
              {formData.givesNoWithFeedback === true && (
                <Input
                  value={formData.feedbackWhen}
                  onChange={(e) => handleChange("feedbackWhen", e.target.value)}
                  placeholder="When do you provide feedback? (e.g., After partner meeting, Always, etc.)"
                  className="mt-4"
                />
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="reserves">Follow-on Policy: Reserves (% of fund)</Label>
                <Input
                  id="reserves"
                  value={formData.followOnReserves}
                  onChange={(e) => handleChange("followOnReserves", e.target.value)}
                  placeholder="50%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followOnWhen">When Do You Follow?</Label>
                <Input
                  id="followOnWhen"
                  value={formData.followOnWhen}
                  onChange={(e) => handleChange("followOnWhen", e.target.value)}
                  placeholder="Series A if hitting milestones"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Value-Add Menu</h2>
              <p className="text-muted-foreground">What founders are hoping you'll do after "yes"</p>
            </div>

            <div className="p-6 bg-muted/30 rounded-xl space-y-4">
              <h3 className="font-semibold text-lg">A) Operating Support You Actively Provide *</h3>
              <div className="flex flex-wrap gap-2">
                {OPERATING_SUPPORT.map(support => (
                  <button
                    key={support}
                    type="button"
                    onClick={() => handleArrayToggle("operatingSupport", support)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.operatingSupport.includes(support)
                        ? "bg-[hsl(var(--navy-deep))] text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {support}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-muted/30 rounded-xl space-y-6">
              <h3 className="font-semibold text-lg">B) Network Strengths</h3>
              
              <div className="space-y-2">
                <Label htmlFor="customerVerticals">Top 5 Customer Verticals You Can Introduce Into</Label>
                <Textarea
                  id="customerVerticals"
                  value={formData.customerVerticals}
                  onChange={(e) => handleChange("customerVerticals", e.target.value)}
                  placeholder="Healthcare systems, Financial services, Manufacturing..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnerCategories">Top 5 Strategic Partner Categories You Can Unlock</Label>
                <Textarea
                  id="partnerCategories"
                  value={formData.partnerCategories}
                  onChange={(e) => handleChange("partnerCategories", e.target.value)}
                  placeholder="Cloud providers, System integrators, Channel partners..."
                  rows={2}
                />
              </div>

              <div className="space-y-3">
                <Label>Talent Networks</Label>
                <div className="flex flex-wrap gap-2">
                  {TALENT_NETWORKS.map(network => (
                    <button
                      key={network}
                      type="button"
                      onClick={() => handleArrayToggle("talentNetworks", network)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.talentNetworks.includes(network)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {network}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>C) Founder Support Style *</Label>
              <Select value={formData.supportStyle} onValueChange={(v) => handleChange("supportStyle", v)}>
                <SelectTrigger><SelectValue placeholder="Select your style" /></SelectTrigger>
                <SelectContent>
                  {SUPPORT_STYLE.map(style => <SelectItem key={style} value={style}>{style}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Portfolio & Conflicts</h2>
              <p className="text-muted-foreground">Protect founders + protect the fund</p>
            </div>

            <div className="space-y-2">
              <Label>Lead vs Follow Preference *</Label>
              <Select value={formData.leadFollow} onValueChange={(v) => handleChange("leadFollow", v)}>
                <SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger>
                <SelectContent>
                  {LEAD_FOLLOW.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Current Portfolio List</Label>
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center space-y-4 hover:border-primary/50 transition-colors">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold">Upload CSV or paste portfolio list</p>
                  <p className="text-xs text-muted-foreground">CSV up to 5MB</p>
                </div>
                <Button type="button" variant="outline" size="sm">Choose File</Button>
              </div>
              <Textarea
                value={formData.portfolioList}
                onChange={(e) => handleChange("portfolioList", e.target.value)}
                placeholder="Or paste company names here..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Conflicts Policy *</Label>
              <Select value={formData.conflictsPolicy} onValueChange={(v) => handleChange("conflictsPolicy", v)}>
                <SelectTrigger><SelectValue placeholder="Select policy" /></SelectTrigger>
                <SelectContent>
                  {CONFLICTS_POLICY.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <Label htmlFor="competitors" className="font-semibold">Do You Invest in Direct Competitors?</Label>
              </div>
              <Switch
                id="competitors"
                checked={formData.investsInCompetitors}
                onCheckedChange={(checked) => handleChange("investsInCompetitors", checked)}
              />
            </div>

            <div className="p-4 bg-muted/30 rounded-xl space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="signsNDAs"
                  checked={formData.signsNDAs}
                  onCheckedChange={(checked) => handleChange("signsNDAs", !!checked)}
                />
                <Label htmlFor="signsNDAs">Do You Sign NDAs?</Label>
              </div>
              {formData.signsNDAs && (
                <Input
                  value={formData.ndaConditions}
                  onChange={(e) => handleChange("ndaConditions", e.target.value)}
                  placeholder="Under what conditions? (e.g., After term sheet)"
                />
              )}
            </div>

            <div className="p-6 bg-gradient-to-r from-[hsl(var(--navy-deep))]/10 to-primary/10 rounded-xl border border-primary/20">
              <p className="text-sm text-muted-foreground text-center">
                By submitting, you agree to our Terms of Service and Privacy Policy. Your information will be shared with matched founders through the In-Sync platform.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--gradient-navy-teal)' }}>
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] border border-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] border border-white/15 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="pt-20 pb-16 relative z-10">
        <div className="container max-w-4xl mx-auto px-4 md:px-6">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/30 rounded-full text-sm font-medium text-[hsl(var(--cyan-glow))]">
                IN-SYNC | INVESTOR APPLICATION
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                VC Thesis
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Join the In-Sync Ecosystem
              </p>
            </div>

            {/* Progress Steps */}
            <div className="hidden md:flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = isStepComplete(step.id) && (completedSteps.includes(step.id) || currentStep > step.id);
                const isCurrent = currentStep === step.id;
                const canAccess = step.id <= currentStep || completedSteps.includes(step.id - 1) || isStepComplete(step.id - 1);
                
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
                    disabled={!canAccess && step.id > currentStep}
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
              <span className="text-white font-medium">Step {currentStep + 1} of 8</span>
              <span className="text-white/70 text-sm">{STEPS[currentStep].title}</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8 md:p-10 shadow-2xl">
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-8 mt-8 border-t">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                )}
                
                <div className="flex-1" />
                
                {currentStep < 7 ? (
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
                    className="gap-2 bg-gradient-to-r from-[hsl(var(--navy-deep))] to-primary hover:opacity-90"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
