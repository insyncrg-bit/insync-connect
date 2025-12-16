import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
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

export default function FounderApplication() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

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
  const [valueProposition, setValueProposition] = useState("");
  const [valueDrivers, setValueDrivers] = useState<string[]>([]);
  const [severityUrgency, setSeverityUrgency] = useState("");
  const [necessityType, setNecessityType] = useState("");
  const [necessityExplanation, setNecessityExplanation] = useState("");
  const [uniqueValue, setUniqueValue] = useState("");
  const [emotionalValue, setEmotionalValue] = useState("");
  const [adaptability, setAdaptability] = useState("");
  const [marketContext, setMarketContext] = useState("");
  const [buyerVsUser, setBuyerVsUser] = useState("");

  // Section 3 - Business Model
  const [customerType, setCustomerType] = useState<string[]>([]);
  const [customerTypeExplanation, setCustomerTypeExplanation] = useState("");
  const [goToMarketFit, setGoToMarketFit] = useState("");
  const [pricingStrategies, setPricingStrategies] = useState<string[]>([]);
  const [pricingExplanation, setPricingExplanation] = useState("");
  const [revenueMetrics, setRevenueMetrics] = useState("");

  // Section 4 - Market & GTM
  const [tam, setTam] = useState("");
  const [sam, setSam] = useState("");
  const [som, setSom] = useState("");
  const [targetPersonas, setTargetPersonas] = useState("");
  const [gtmStrategy, setGtmStrategy] = useState("");
  const [competitors, setCompetitors] = useState("");
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
    "Subscription (flat / tiered / usage-based)",
    "Transaction-based (take rate or % fee)",
    "One-time / licensing",
    "Advertising-driven",
    "Services",
  ];

  const sections = [
    "Welcome",
    "Company Info",
    "Team & Overview",
    "The Problem",
    "Business Model",
    "Market & GTM",
  ];

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

  const toggleCheckbox = (value: string, currentArray: string[], setter: (arr: string[]) => void) => {
    if (currentArray.includes(value)) {
      setter(currentArray.filter((v) => v !== value));
    } else {
      setter([...currentArray, value]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          valueProposition,
          valueDrivers,
          severityUrgency,
          necessityType,
          necessityExplanation,
          uniqueValue,
          emotionalValue,
          adaptability,
          marketContext,
          buyerVsUser,
        },
        section3: {
          customerType,
          customerTypeExplanation,
          goToMarketFit,
          pricingStrategies,
          pricingExplanation,
          revenueMetrics,
        },
        section4: {
          tam,
          sam,
          som,
          targetPersonas,
          gtmStrategy,
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
          traction: revenueMetrics || "N/A",
          current_ask: gtmStrategy || "N/A",
          application_sections: {
            ...applicationSections,
            linkedIn: basicInfo.linkedIn,
          } as unknown as Record<string, unknown>,
          team_members: teamMembers as unknown as Record<string, unknown>[],
          status: "pending",
        } as any);

      if (insertError) throw insertError;

      toast({
        title: "Application Submitted!",
        description: "Welcome to the ecosystem! Explore your dashboard.",
      });

      navigate("/founder-dashboard");
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
              Please respect the minimum and maximum word limits — they are intentional.
            </p>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Company Information</h2>
              <p className="text-[hsl(var(--navy-deep))]/70">Tell us about your company</p>
            </div>

            {/* Company Logo */}
            <div className="space-y-3">
              <Label>Company Logo</Label>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 border-2 border-dashed border-[hsl(var(--cyan-glow))]/30 rounded-xl flex items-center justify-center overflow-hidden bg-white">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                  ) : (
                    <Upload className="h-8 w-8 text-[hsl(var(--navy-deep))]/40" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Label
                    htmlFor="logo-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-[hsl(var(--navy-deep))]/10 hover:bg-[hsl(var(--navy-deep))]/20 rounded-lg text-sm font-medium transition-colors"
                  >
                    Upload Logo
                  </Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/50 mt-1">PNG, JPG up to 2MB</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={basicInfo.companyName}
                  onChange={(e) => setBasicInfo({ ...basicInfo, companyName: e.target.value })}
                  placeholder="Your Startup Inc."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={basicInfo.website}
                  onChange={(e) => setBasicInfo({ ...basicInfo, website: e.target.value })}
                  placeholder="https://yourstartup.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedIn">Company LinkedIn</Label>
              <Input
                id="linkedIn"
                type="url"
                value={basicInfo.linkedIn}
                onChange={(e) => setBasicInfo({ ...basicInfo, linkedIn: e.target.value })}
                placeholder="https://linkedin.com/company/yourstartup"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vertical">Vertical *</Label>
                <Select value={basicInfo.vertical} onValueChange={(value) => setBasicInfo({ ...basicInfo, vertical: value })}>
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
                <Select value={basicInfo.stage} onValueChange={(value) => setBasicInfo({ ...basicInfo, stage: value })}>
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
                  value={basicInfo.location}
                  onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })}
                  placeholder="Boston, MA"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Section 1 — Company Overview & Team</h2>
              <p className="text-[hsl(var(--navy-deep))]/70">Help us understand your company and the people behind it</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">1.1 Problem Statement</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  Describe the existing problem your company is trying to solve. What pain point are you addressing?
                </p>
                <Textarea
                  value={companyOverview}
                  onChange={(e) => setCompanyOverview(e.target.value)}
                  placeholder="The problem we're solving is... Our target customers struggle with..."
                  rows={4}
                />
                <WordCounter current={companyOverview} min={30} max={50} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">1.2 Team & Expertise</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  List key team members relevant to understanding the credibility of who is running the company. Focus on founders and critical hires.
                </p>
              </div>

              {/* Primary Contact / First Founder */}
              <div className="p-4 border-2 border-[hsl(var(--cyan-glow))]/30 rounded-lg space-y-4 bg-[hsl(var(--cyan-glow))]/5">
                <span className="font-medium text-[hsl(var(--navy-deep))]">Primary Contact (You)</span>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Your Name *"
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Your Role *"
                    value={teamMembers[0]?.role || ""}
                    onChange={(e) => updateTeamMember(0, "role", e.target.value)}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    type="email"
                    placeholder="Your Email *"
                    value={founderEmail}
                    onChange={(e) => setFounderEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="url"
                    placeholder="LinkedIn Profile"
                    value={teamMembers[0]?.linkedin || ""}
                    onChange={(e) => updateTeamMember(0, "linkedin", e.target.value)}
                  />
                </div>
                <Textarea
                  placeholder="Your relevant experience, domain expertise, or execution strength..."
                  value={teamMembers[0]?.background || ""}
                  onChange={(e) => updateTeamMember(0, "background", e.target.value)}
                  rows={2}
                />
                <WordCounter current={teamMembers[0]?.background || ""} min={20} max={50} />
              </div>

              {/* Additional Key Team Members */}
              {teamMembers.slice(1).map((member, index) => (
                <div key={index + 1} className="p-4 border border-[hsl(var(--cyan-glow))]/20 rounded-lg space-y-4 bg-white/50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[hsl(var(--navy-deep))]">Key Team Member</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTeamMember(index + 1)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) => updateTeamMember(index + 1, "name", e.target.value)}
                    />
                    <Input
                      placeholder="Role"
                      value={member.role}
                      onChange={(e) => updateTeamMember(index + 1, "role", e.target.value)}
                    />
                  </div>
                  <Input
                    type="url"
                    placeholder="LinkedIn Profile"
                    value={member.linkedin}
                    onChange={(e) => updateTeamMember(index + 1, "linkedin", e.target.value)}
                  />
                  <Textarea
                    placeholder="Relevant experience, domain expertise, or execution strength..."
                    value={member.background}
                    onChange={(e) => updateTeamMember(index + 1, "background", e.target.value)}
                    rows={2}
                  />
                  <WordCounter current={member.background} min={20} max={50} />
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addTeamMember}
                className="w-full border-dashed border-[hsl(var(--cyan-glow))]/40"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Key Team Member
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Section 2 — Value & Impact</h2>
              <p className="text-[hsl(var(--navy-deep))]/70">Select all value types that apply to your solution, then describe each</p>
            </div>

            {/* Value Type Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">What types of value does your solution provide?</Label>
              <p className="text-sm text-[hsl(var(--navy-deep))]/60">Select all that apply — you'll describe each one below</p>
              
              <div className="grid gap-3">
                {[
                  { id: "scalability", label: "True Scalability", desc: "Makes life easier, more efficient, or intuitive" },
                  { id: "severity", label: "Severity / Urgency", desc: "Solves an urgent or costly problem" },
                  { id: "unique-tech", label: "Unique Value / Technology", desc: "Has tech or approach that's uniquely attractive" },
                  { id: "emotional", label: "Emotional / Social Value", desc: "Creates status, trust, or peace of mind" },
                  { id: "adaptability", label: "Adaptability", desc: "Works across regions, geographies, or customer groups" },
                ].map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      valueDrivers.includes(item.id)
                        ? "border-[hsl(var(--cyan-glow))] bg-[hsl(var(--cyan-glow))]/10"
                        : "border-[hsl(var(--navy-deep))]/20 hover:border-[hsl(var(--cyan-glow))]/50"
                    }`}
                    onClick={() => toggleCheckbox(item.id, valueDrivers, setValueDrivers)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={valueDrivers.includes(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        onCheckedChange={() => toggleCheckbox(item.id, valueDrivers, setValueDrivers)}
                      />
                      <div>
                        <p className="font-medium text-[hsl(var(--navy-deep))]">{item.label}</p>
                        <p className="text-sm text-[hsl(var(--navy-deep))]/60">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditional Text Areas based on selection */}
            {valueDrivers.includes("scalability") && (
              <div className="space-y-3 p-4 bg-[hsl(var(--cyan-glow))]/5 border border-[hsl(var(--cyan-glow))]/20 rounded-lg">
                <Label className="text-base font-semibold">True Scalability</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  Describe how your solution makes life easier, more efficient, or intuitive. What processes does it simplify? How much time/effort does it save?
                </p>
                <Textarea
                  value={valueProposition}
                  onChange={(e) => setValueProposition(e.target.value)}
                  placeholder="Our solution saves [X hours/dollars] by... It simplifies... Users can now..."
                  rows={3}
                />
                <WordCounter current={valueProposition} min={40} max={75} />
              </div>
            )}

            {valueDrivers.includes("severity") && (
              <div className="space-y-3 p-4 bg-[hsl(var(--cyan-glow))]/5 border border-[hsl(var(--cyan-glow))]/20 rounded-lg">
                <Label className="text-base font-semibold">Severity / Urgency</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  How urgent or costly is this problem? What's the financial/operational impact if left unsolved? What triggers customers to seek a solution NOW?
                </p>
                <Textarea
                  value={severityUrgency}
                  onChange={(e) => setSeverityUrgency(e.target.value)}
                  placeholder="This problem costs customers [X] per year... Without a solution, they face... The urgency comes from..."
                  rows={3}
                />
                <WordCounter current={severityUrgency} min={40} max={75} />
              </div>
            )}

            {valueDrivers.includes("unique-tech") && (
              <div className="space-y-3 p-4 bg-[hsl(var(--cyan-glow))]/5 border border-[hsl(var(--cyan-glow))]/20 rounded-lg">
                <Label className="text-base font-semibold">Unique Value / Technology</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  What makes your approach uniquely attractive? Is it proprietary tech, data advantage, workflow design, or something else? Why can't competitors easily replicate it?
                </p>
                <Textarea
                  value={uniqueValue}
                  onChange={(e) => setUniqueValue(e.target.value)}
                  placeholder="Our unique advantage is... Competitors can't replicate this because... This matters to customers because..."
                  rows={3}
                />
                <WordCounter current={uniqueValue} min={40} max={75} />
              </div>
            )}

            {valueDrivers.includes("emotional") && (
              <div className="space-y-3 p-4 bg-[hsl(var(--cyan-glow))]/5 border border-[hsl(var(--cyan-glow))]/20 rounded-lg">
                <Label className="text-base font-semibold">Emotional / Social Value</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  How does your product create status, trust, confidence, or peace of mind? What emotional benefit do users get? How does it make them feel?
                </p>
                <Textarea
                  value={emotionalValue}
                  onChange={(e) => setEmotionalValue(e.target.value)}
                  placeholder="Users feel [confident/secure/proud] because... It creates trust by... The peace of mind comes from..."
                  rows={3}
                />
                <WordCounter current={emotionalValue} min={40} max={75} />
              </div>
            )}

            {valueDrivers.includes("adaptability") && (
              <div className="space-y-3 p-4 bg-[hsl(var(--cyan-glow))]/5 border border-[hsl(var(--cyan-glow))]/20 rounded-lg">
                <Label className="text-base font-semibold">Adaptability</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  How does your solution work across different regions, geographies, industries, or customer segments? What makes it adaptable?
                </p>
                <Textarea
                  value={adaptability}
                  onChange={(e) => setAdaptability(e.target.value)}
                  placeholder="Our solution works across [regions/industries] because... We can adapt to different markets by... The core value translates because..."
                  rows={3}
                />
                <WordCounter current={adaptability} min={40} max={75} />
              </div>
            )}

            {valueDrivers.length === 0 && (
              <div className="p-6 border-2 border-dashed border-[hsl(var(--navy-deep))]/20 rounded-lg text-center">
                <p className="text-[hsl(var(--navy-deep))]/60">Select at least one value type above to continue</p>
              </div>
            )}

            {/* Market Context */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Broader Market Context</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  How does your product fit into the broader market or industry landscape?
                </p>
              </div>
              <Textarea
                value={marketContext}
                onChange={(e) => setMarketContext(e.target.value)}
                placeholder="Reference known pain points such as inefficiencies, cost overruns, or compliance gaps..."
                rows={4}
              />
              <WordCounter current={marketContext} min={75} max={100} />
            </div>

            {/* Buyer vs User */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Buyer vs. User</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  Who feels the pain most, and who has the budget authority to pay for the solution?
                </p>
              </div>
              <Textarea
                value={buyerVsUser}
                onChange={(e) => setBuyerVsUser(e.target.value)}
                placeholder="Explain whether these are the same or different stakeholders..."
                rows={3}
              />
              <WordCounter current={buyerVsUser} min={50} max={75} />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Section 3 — Business Model & Profitability</h2>
              <p className="text-[hsl(var(--navy-deep))]/70">How you make money and scale</p>
            </div>

            {/* 3.1 Customer Type */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">3.1 Customer Type</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">Who do you primarily sell to?</p>
              </div>
              <div className="flex gap-6">
                {CUSTOMER_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`customer-${type}`}
                      checked={customerType.includes(type)}
                      onCheckedChange={() => toggleCheckbox(type, customerType, setCustomerType)}
                    />
                    <Label htmlFor={`customer-${type}`} className="cursor-pointer">{type}</Label>
                  </div>
                ))}
              </div>
              <Textarea
                value={customerTypeExplanation}
                onChange={(e) => setCustomerTypeExplanation(e.target.value)}
                placeholder="Explain why this aligns with the value you deliver..."
                rows={3}
              />
              <WordCounter current={customerTypeExplanation} min={50} max={75} />
            </div>

            {/* 3.2 Go-to-Market Fit */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">3.2 Go-to-Market Fit</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  How does your go-to-market strategy match the type of value you provide?
                </p>
              </div>
              <Textarea
                value={goToMarketFit}
                onChange={(e) => setGoToMarketFit(e.target.value)}
                placeholder="For example: operational efficiency → enterprise sales; lifestyle convenience → consumer distribution..."
                rows={4}
              />
              <WordCounter current={goToMarketFit} min={75} max={100} />
            </div>

            {/* 3.3 Pricing Strategy */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">3.3 Pricing Strategy</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">How do you charge customers? Select all that apply.</p>
              </div>
              <div className="space-y-3">
                {PRICING_STRATEGIES.map((strategy) => (
                  <div key={strategy} className="flex items-center space-x-2">
                    <Checkbox
                      id={`pricing-${strategy}`}
                      checked={pricingStrategies.includes(strategy)}
                      onCheckedChange={() => toggleCheckbox(strategy, pricingStrategies, setPricingStrategies)}
                    />
                    <Label htmlFor={`pricing-${strategy}`} className="cursor-pointer">{strategy}</Label>
                  </div>
                ))}
              </div>
              <Textarea
                value={pricingExplanation}
                onChange={(e) => setPricingExplanation(e.target.value)}
                placeholder="Explain your rationale..."
                rows={3}
              />
              <WordCounter current={pricingExplanation} min={50} max={75} />
            </div>

            {/* 3.4 Revenue & Metrics */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">3.4 Revenue & Metrics</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  What are your primary sources of revenue today? Include metrics if available.
                </p>
              </div>
              <Textarea
                value={revenueMetrics}
                onChange={(e) => setRevenueMetrics(e.target.value)}
                placeholder="ARR, MRR, ARPU, customer count, or growth rate..."
                rows={4}
              />
              <WordCounter current={revenueMetrics} min={60} max={100} />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Section 4 — Market & Go-to-Market</h2>
              <p className="text-[hsl(var(--navy-deep))]/70">Market opportunity and competitive positioning</p>
            </div>

            {/* 4.1 TAM/SAM/SOM */}
            <div className="space-y-6">
              <Label className="text-base font-semibold">4.1 Market Opportunity (TAM → SAM → SOM)</Label>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-medium">TAM — Total Addressable Market</Label>
                  <p className="text-sm text-[hsl(var(--navy-deep))]/60">How did you calculate it (top-down or bottom-up)?</p>
                  <Textarea
                    value={tam}
                    onChange={(e) => setTam(e.target.value)}
                    placeholder="The total market for your solution..."
                    rows={3}
                  />
                  <WordCounter current={tam} min={50} max={75} />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">SAM — Serviceable Addressable Market</Label>
                  <p className="text-sm text-[hsl(var(--navy-deep))]/60">What portion can you realistically serve today?</p>
                  <Textarea
                    value={sam}
                    onChange={(e) => setSam(e.target.value)}
                    placeholder="The segment you can reach..."
                    rows={3}
                  />
                  <WordCounter current={sam} min={50} max={75} />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">SOM — Serviceable Obtainable Market</Label>
                  <p className="text-sm text-[hsl(var(--navy-deep))]/60">What share is achievable in the near-to-medium term?</p>
                  <Textarea
                    value={som}
                    onChange={(e) => setSom(e.target.value)}
                    placeholder="Your realistic target..."
                    rows={3}
                  />
                  <WordCounter current={som} min={50} max={75} />
                </div>
              </div>
            </div>

            {/* 4.2 Target Personas */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">4.2 Target Customer Personas</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  Describe your ideal customer as specifically as possible.
                </p>
              </div>
              <Textarea
                value={targetPersonas}
                onChange={(e) => setTargetPersonas(e.target.value)}
                placeholder="Include size, industry, geography, and behavior..."
                rows={4}
              />
              <WordCounter current={targetPersonas} min={75} max={100} />
            </div>

            {/* 4.3 GTM Strategy */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">4.3 Go-to-Market Strategy</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  How do customers discover, adopt, and purchase your product today?
                </p>
              </div>
              <Textarea
                value={gtmStrategy}
                onChange={(e) => setGtmStrategy(e.target.value)}
                placeholder="Include sales motion, marketing channels, and partnerships..."
                rows={4}
              />
              <WordCounter current={gtmStrategy} min={75} max={100} />
            </div>

            {/* 4.4 Competitive Landscape */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">4.4 Competitive Landscape</Label>
                <p className="text-sm text-[hsl(var(--navy-deep))]/60">
                  List up to 5 comparable companies and how you differ.
                </p>
              </div>
              <Textarea
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                placeholder="Company 1, Company 2... and how you differentiate..."
                rows={3}
              />
              <WordCounter current={competitors} min={40} max={50} />
            </div>

            {/* 4.5 Competitive Moat */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">4.5 Competitive Moat</Label>
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
            <div className="flex justify-center gap-2">
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
                      onClick={() => setCurrentSection(currentSection + 1)}
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
