import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  MapPin, 
  Globe, 
  DollarSign, 
  TrendingUp,
  Users,
  Target,
  Loader2,
  ArrowLeft,
  FileText,
  Eye,
  ChevronRight,
  Maximize2,
  Minimize2,
  Zap,
  Rocket,
  BarChart3,
  Shield,
  Calculator,
  Linkedin,
  ExternalLink,
  PencilLine,
  X
} from "lucide-react";
import insyncInfinity from "@/landing/assets/infinity-logo-transparent.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FounderApplication {
  id: string;
  founder_name: string;
  company_name: string;
  vertical: string;
  stage: string;
  location: string;
  website: string | null;
  business_model: string;
  funding_goal: string;
  traction: string;
  current_ask?: string;
  user_id?: string | null;
  logo_url?: string | null;
  pitchdeck_url?: string | null;
  pitchdeck_name?: string | null;
  calendly_link?: string | null;
  application_sections?: any;
  updated_at?: string;
}

interface MemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startup: FounderApplication | null;
  onRequestSync?: (userId: string, companyName: string) => void;
  isRequested?: boolean;
  isRequesting?: boolean;
  onEdit?: () => void;
}

type MarketMetric = "tam" | "sam" | "som" | null;

export function MemoModal({ 
  open, 
  onOpenChange, 
  startup, 
  onRequestSync,
  isRequested = false,
  isRequesting = false,
  onEdit
}: MemoModalProps) {
  const [viewMode, setViewMode] = useState<"condensed" | "full">("condensed");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [syncNote, setSyncNote] = useState("");
  const [showSyncForm, setShowSyncForm] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MarketMetric>(null);
  const [enriched, setEnriched] = useState<Partial<FounderApplication> | null>(null);
  const [enriching, setEnriching] = useState(false);

  const baseUrl = useMemo(() => {
    const apiUrl = import.meta.env.VITE_FIREBASE_API as string | undefined;
    return apiUrl ? apiUrl.replace(/\/$/, "") : "";
  }, []);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!open) return;
      if (!startup?.user_id) return;
      // Only fetch if we're missing key assets
      if (startup.pitchdeck_url || startup.logo_url) return;
      if (!baseUrl) return;

      try {
        setEnriching(true);
        const { getAuth } = await import("firebase/auth");
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();

        // Logo and pitch deck live in memo; profile is lean
        const memoRes = await fetch(`${baseUrl}/startups/${startup.user_id}/memo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!memoRes.ok) return;
        const memoJson = await memoRes.json();
        const s = (memoJson.memo || {}) as Record<string, unknown>;

        const pitchdeckUrl =
          (typeof s.pitchdeckUrl === "string" && s.pitchdeckUrl) ||
          (typeof s.pitchdeck_url === "string" && s.pitchdeck_url) ||
          null;
        const pitchdeckName =
          (typeof s.pitchdeckName === "string" && s.pitchdeckName) ||
          (typeof s.pitchdeck_name === "string" && s.pitchdeck_name) ||
          null;
        const logoUrl =
          (typeof s.startupLogoUrl === "string" && s.startupLogoUrl) ||
          (typeof s.companyLogoUrl === "string" && s.companyLogoUrl) ||
          (typeof s.logo_url === "string" && s.logo_url) ||
          null;

        if (mounted) {
          setEnriched({
            pitchdeck_url: pitchdeckUrl,
            pitchdeck_name: pitchdeckName,
            logo_url: logoUrl,
          });
        }
      } finally {
        if (mounted) setEnriching(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [open, startup?.user_id, startup?.pitchdeck_url, startup?.logo_url, baseUrl]);

  const wordCount = syncNote.trim().split(/\s+/).filter(Boolean).length;
  const isOverLimit = wordCount > 60;

  const handleClose = () => {
    setViewMode("condensed");
    setIsFullscreen(false);
    setShowSyncForm(false);
    setSyncNote("");
    setSelectedMetric(null);
    onOpenChange(false);
  };

  const handleSync = () => {
    if (startup?.user_id && !isOverLimit && onRequestSync) {
      onRequestSync(startup.user_id, startup.company_name);
      setSyncNote("");
      setShowSyncForm(false);
    }
  };

  if (!startup) return null;

  const pitchdeckUrl = enriched?.pitchdeck_url ?? startup.pitchdeck_url ?? null;
  const pitchdeckName = enriched?.pitchdeck_name ?? startup.pitchdeck_name ?? null;
  const logoUrl = enriched?.logo_url ?? startup.logo_url ?? null;

  const sections = startup.application_sections || {};

  // Value driver labels
  const valueDriverLabels: Record<string, string> = {
    "scalability": "True Scalability",
    "severity": "Severity & Urgency",
    "unique-tech": "Unique Technology",
    "emotional": "Emotional Value",
    "adaptability": "Adaptability",
    "other": "Other"
  };

  // Pricing strategy labels
  const pricingStrategyLabels: Record<string, string> = {
    "subscription": "Subscription",
    "transaction": "Transaction-based",
    "licensing": "One-time / Licensing",
    "advertising": "Advertising-driven",
    "services": "Services",
    "other": "Other"
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`bg-[hsl(var(--navy-deep))] border-[hsl(var(--cyan-glow))]/20 p-0 overflow-hidden transition-all duration-300 ${
        isFullscreen 
          ? 'max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none' 
          : 'max-w-5xl max-h-[95vh]'
      }`}>
        <ScrollArea className="h-full max-h-[90vh]">
          <div className="p-8 space-y-8">
            {/* Back Button */}


            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Startup Memo</h2>
                <p className="text-white/60">Investor-ready company memo</p>
              </div>
              <div className="flex items-center gap-3">
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "condensed" | "full")}>
                  <TabsList className="bg-white/10">
                    <TabsTrigger value="condensed" className="data-[state=active]:bg-[hsl(var(--cyan-glow))] data-[state=active]:text-[hsl(var(--navy-deep))]">
                      <FileText className="h-4 w-4 mr-2" />
                      Condensed
                    </TabsTrigger>
                    <TabsTrigger value="full" className="data-[state=active]:bg-[hsl(var(--cyan-glow))] data-[state=active]:text-[hsl(var(--navy-deep))]">
                      <Eye className="h-4 w-4 mr-2" />
                      Full Memo
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                {pitchdeckUrl && (
                  <a
                    href={pitchdeckUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[hsl(var(--cyan-glow))]/30 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10 font-semibold px-4"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Pitch Deck
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  </a>
                )}
                {onEdit && (
                  <Button
                    onClick={onEdit}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white/80 hover:text-white hover:bg-white/10 font-semibold px-4"
                  >
                    <PencilLine className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </div>

            {/* Condensed View */}
            {viewMode === "condensed" && (
              <div className="space-y-6">
                {/* Executive Summary Card */}
                <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-8 relative overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.08)]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--cyan-glow))]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-6 mb-6">
                      <div className="flex items-center gap-4">
                        {logoUrl ? (
                          <img 
                            src={logoUrl} 
                            alt={`${startup.company_name} logo`}
                            className="w-20 h-20 rounded-2xl object-cover shadow-lg shadow-[hsl(var(--cyan-glow))]/20"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shadow-lg shadow-[hsl(var(--cyan-glow))]/20">
                            <Building2 className="h-10 w-10 text-white" />
                          </div>
                        )}
                        <div>
                          <h1 className="text-3xl font-bold text-white mb-2">{startup.company_name}</h1>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/30 text-sm">
                              {startup.vertical}
                            </Badge>
                            <Badge className="bg-white/10 text-white/80 border-white/20 text-sm">
                              {startup.stage}
                            </Badge>
                            <Badge className="bg-[hsl(var(--cyan-bright))]/20 text-[hsl(var(--cyan-bright))] border-[hsl(var(--cyan-bright))]/30 text-sm">
                              📍 {startup.location}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* One-liner */}
                    <div className="bg-white/5 rounded-xl p-4 mb-6">
                      <p className="text-lg text-white/90 italic">
                        "{startup.business_model.slice(0, 150)}{startup.business_model.length > 150 ? '...' : ''}"
                      </p>
                    </div>

                    {/* Key Metrics Row - Clickable TAM/SAM/SOM */}
                    <div className="grid grid-cols-3 gap-4">
                      <button 
                        onClick={() => setSelectedMetric("tam")}
                        className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all cursor-pointer group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30"
                      >
                        <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">TAM</p>
                        <p className="text-2xl font-bold text-white">{sections.section5?.tamValue || "—"}</p>
                        <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                          View breakdown <ChevronRight className="h-3 w-3" />
                        </p>
                      </button>
                      <button 
                        onClick={() => setSelectedMetric("sam")}
                        className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all cursor-pointer group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30"
                      >
                        <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">SAM</p>
                        <p className="text-2xl font-bold text-white">{sections.section5?.samValue || "—"}</p>
                        <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                          View breakdown <ChevronRight className="h-3 w-3" />
                        </p>
                      </button>
                      <button 
                        onClick={() => setSelectedMetric("som")}
                        className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all cursor-pointer group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30"
                      >
                        <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">SOM</p>
                        <p className="text-2xl font-bold text-white">{sections.section5?.somValue || "—"}</p>
                        <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                          View breakdown <ChevronRight className="h-3 w-3" />
                        </p>
                      </button>
                    </div>
                  </div>
                </Card>

                {/* Quick Stats Grid */}
                <div className="flex flex-wrap items-stretch justify-center gap-4">
                  <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)] w-full md:w-[280px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Target className="h-5 w-5 text-purple-400/70" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs font-medium">Customer</p>
                        <p className="text-white font-semibold">{sections.section3?.customerType?.join("/") || "—"}</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)] w-full md:w-[280px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-emerald-400/70" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs font-medium">Revenue Model</p>
                        <p className="text-white font-semibold text-sm">{sections.section3?.pricingStrategies?.[0] || "—"}</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)] w-full md:w-[280px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-amber-400/70" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs font-medium">Value Drivers</p>
                        <p className="text-white font-semibold">{sections.section2?.valueDrivers?.length || 0}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Problem & Solution */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                        <Target className="h-4 w-4 text-rose-400/70" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">The Problem</h3>
                    </div>
                    <p className="text-white/70 leading-relaxed">
                      {sections.section2?.currentPainPoint || "Problem statement will appear here based on the application."}
                    </p>
                  </Card>

                  <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Rocket className="h-4 w-4 text-emerald-400/70" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">The Solution</h3>
                    </div>
                    <p className="text-white/70 leading-relaxed">
                      {startup.business_model}
                    </p>
                  </Card>
                </div>
              </div>
            )}

            {/* Full Memo View */}
            {viewMode === "full" && (
              <div className="space-y-8">
                {/* Header Section */}
                <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-8 shadow-[0_0_15px_rgba(6,182,212,0.08)]">
                  <div className="text-center mb-8">
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt={`${startup.company_name} logo`}
                        className="w-24 h-24 mx-auto rounded-2xl object-cover shadow-lg shadow-[hsl(var(--cyan-glow))]/20 mb-4"
                      />
                    ) : (
                      <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shadow-lg shadow-[hsl(var(--cyan-glow))]/20 mb-4">
                        <Building2 className="h-12 w-12 text-white" />
                      </div>
                    )}
                    <h1 className="text-4xl font-bold text-white mb-2">{startup.company_name}</h1>
                    <p className="text-xl text-white/70 mb-4">{startup.vertical} • {startup.stage}</p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {startup.location}</span>
                      {startup.website && (
                        <a href={startup.website.startsWith('http') ? startup.website : `https://${startup.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[hsl(var(--cyan-glow))] transition-colors">
                          <Globe className="h-4 w-4" /> {startup.website}
                        </a>
                      )}
                      {sections.linkedIn && (
                        <a href={sections.linkedIn.startsWith('http') ? sections.linkedIn : `https://${sections.linkedIn}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[hsl(var(--cyan-glow))] transition-colors">
                          <Linkedin className="h-4 w-4" /> LinkedIn
                        </a>
                      )}
                      {(pitchdeckUrl || enriching) && (
                        <a
                          href={pitchdeckUrl || undefined}
                          target={pitchdeckUrl ? "_blank" : undefined}
                          rel={pitchdeckUrl ? "noopener noreferrer" : undefined}
                          className={`flex items-center gap-1 transition-colors ${
                            pitchdeckUrl ? "hover:text-[hsl(var(--cyan-glow))]" : "text-white/40 pointer-events-none"
                          }`}
                        >
                          <FileText className="h-4 w-4" />{" "}
                          {enriching ? "Loading pitch deck..." : (pitchdeckName ? `Pitch Deck (${pitchdeckName})` : "Pitch Deck")}
                          {pitchdeckUrl && <ExternalLink className="h-3 w-3" />}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="max-w-3xl mx-auto">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-sm font-semibold text-[hsl(var(--cyan-glow))] uppercase tracking-wider mb-3">Executive Summary</h3>
                      <p className="text-lg text-white/90 leading-relaxed">
                        {startup.business_model}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Section 1: Problem & Value Proposition */}
                <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-rose-400/70" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Problem & Value Proposition</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">The Problem</h4>
                      <p className="text-white/80 leading-relaxed text-lg">
                        {sections.section2?.currentPainPoint || "No problem statement provided."}
                      </p>
                    </div>

                    <Separator className="bg-white/10" />

                    <div>
                      <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Value Drivers</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {sections.section2?.valueDrivers?.map((driver: string, i: number) => (
                          <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="h-4 w-4 text-amber-400/70" />
                              <span className="font-semibold text-white">{valueDriverLabels[driver] || driver}</span>
                            </div>
                            <p className="text-white/60 text-sm">
                              {sections.section2?.valueDriverExplanations?.[driver] || "No explanation provided."}
                            </p>
                          </div>
                        )) || <p className="text-white/50">No value drivers specified.</p>}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Section 2: Business Model */}
                <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-emerald-400/70" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Business Model</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Customer Type</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {sections.section3?.customerType?.map((type: string, i: number) => (
                          <Badge key={i} className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))]/80 border-[hsl(var(--cyan-glow))]/20 text-sm px-3 py-1">
                            {type}
                          </Badge>
                        )) || <span className="text-white/50">Not specified</span>}
                      </div>
                      {sections.section3?.customerTypeExplanation && (
                        <p className="text-white/60 text-sm">{sections.section3.customerTypeExplanation}</p>
                      )}
                      {sections.section3?.businessStructure && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">Business Structure</h4>
                          <p className="text-white/60 text-sm">{sections.section3.businessStructure}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Revenue Streams</h4>
                      <div className="space-y-2">
                        {sections.section3?.pricingStrategies?.map((strategy: string, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))]/60" />
                            <span className="text-white/80">{pricingStrategyLabels[strategy] || strategy}</span>
                          </div>
                        )) || <span className="text-white/50">Not specified</span>}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Details */}
                  {(sections.section3?.subscriptionType || sections.section3?.transactionFeeType || 
                    sections.section3?.licensingModel || sections.section3?.adRevenueModel || 
                    sections.section3?.serviceType) && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Pricing Details</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {sections.section3?.subscriptionType && (
                          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <p className="text-xs text-white/40 mb-1">Subscription Type</p>
                            <p className="text-white/80 capitalize">{sections.section3.subscriptionType}</p>
                            {sections.section3?.subscriptionBillingCycle && (
                              <p className="text-white/60 text-sm mt-1">Billing: {sections.section3.subscriptionBillingCycle}</p>
                            )}
                            {sections.section3?.subscriptionTiers && (
                              <p className="text-white/60 text-sm mt-1">Tiers: {sections.section3.subscriptionTiers}</p>
                            )}
                          </div>
                        )}
                        {sections.section3?.transactionFeeType && (
                          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <p className="text-xs text-white/40 mb-1">Transaction Fee</p>
                            <p className="text-white/80 capitalize">{sections.section3.transactionFeeType}</p>
                            {sections.section3?.transactionFeePercentage && (
                              <p className="text-white/60 text-sm mt-1">Rate: {sections.section3.transactionFeePercentage}</p>
                            )}
                          </div>
                        )}
                        {sections.section3?.licensingModel && (
                          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <p className="text-xs text-white/40 mb-1">Licensing Model</p>
                            <p className="text-white/80">{sections.section3.licensingModel}</p>
                          </div>
                        )}
                        {sections.section3?.adRevenueModel && (
                          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <p className="text-xs text-white/40 mb-1">Ad Revenue Model</p>
                            <p className="text-white/80">{sections.section3.adRevenueModel}</p>
                          </div>
                        )}
                        {sections.section3?.serviceType && (
                          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <p className="text-xs text-white/40 mb-1">Service Type</p>
                            <p className="text-white/80">{sections.section3.serviceType}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Key Metrics */}
                  {sections.section3?.revenueMetrics && sections.section3.revenueMetrics.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Key Metrics Tracked</h4>
                      <div className="flex flex-wrap gap-2">
                        {sections.section3.revenueMetrics.map((metric: string, i: number) => (
                          <Badge key={i} className="bg-emerald-500/10 text-emerald-400/80 border-emerald-500/20">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                      {sections.section3?.revenueMetricsValues && (
                        <p className="text-white/60 text-sm mt-3">{sections.section3.revenueMetricsValues}</p>
                      )}
                    </div>
                  )}
                </Card>

                {/* Section 3: Go-to-Market */}
                <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Rocket className="h-5 w-5 text-purple-400/70" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Go-to-Market Strategy</h2>
                  </div>

                  <div className="space-y-6">
                    {sections.section4?.gtmAcquisition && (
                      <div>
                        <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Customer Acquisition</h4>
                        <p className="text-white/80 leading-relaxed">{sections.section4.gtmAcquisition}</p>
                      </div>
                    )}
                    {sections.section4?.gtmTimeline && (
                      <div>
                        <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Timeline</h4>
                        <p className="text-white/80 leading-relaxed">{sections.section4.gtmTimeline}</p>
                      </div>
                    )}
                    {!sections.section4?.gtmAcquisition && !sections.section4?.gtmTimeline && (
                      <p className="text-white/50">No GTM strategy provided.</p>
                    )}
                  </div>
                </Card>

                {/* Section 4: Market Opportunity */}
                <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-amber-400/70" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Market Opportunity</h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <button 
                      onClick={() => setSelectedMetric("tam")}
                      className="bg-white/5 rounded-xl p-6 border border-white/10 text-center hover:border-[hsl(var(--cyan-glow))]/30 transition-all cursor-pointer group"
                    >
                      <p className="text-sm text-white/50 font-semibold mb-2">Total Addressable Market</p>
                      <p className="text-3xl font-bold text-white mb-2">{sections.section5?.tamValue || "—"}</p>
                      <p className="text-xs text-white/30 group-hover:text-[hsl(var(--cyan-glow))]/60 flex items-center justify-center gap-1">
                        <Calculator className="h-3 w-3" /> View calculation
                      </p>
                    </button>
                    <button 
                      onClick={() => setSelectedMetric("sam")}
                      className="bg-white/5 rounded-xl p-6 border border-white/10 text-center hover:border-[hsl(var(--cyan-glow))]/30 transition-all cursor-pointer group"
                    >
                      <p className="text-sm text-white/50 font-semibold mb-2">Serviceable Addressable Market</p>
                      <p className="text-3xl font-bold text-white mb-2">{sections.section5?.samValue || "—"}</p>
                      <p className="text-xs text-white/30 group-hover:text-[hsl(var(--cyan-glow))]/60 flex items-center justify-center gap-1">
                        <Calculator className="h-3 w-3" /> View calculation
                      </p>
                    </button>
                    <button 
                      onClick={() => setSelectedMetric("som")}
                      className="bg-white/5 rounded-xl p-6 border border-white/10 text-center hover:border-[hsl(var(--cyan-glow))]/30 transition-all cursor-pointer group"
                    >
                      <p className="text-sm text-white/50 font-semibold mb-2">Serviceable Obtainable Market</p>
                      <p className="text-3xl font-bold text-white mb-2">{sections.section5?.somValue || "—"}</p>
                      <p className="text-xs text-white/30 group-hover:text-[hsl(var(--cyan-glow))]/60 flex items-center justify-center gap-1">
                        <Calculator className="h-3 w-3" /> View calculation
                      </p>
                    </button>
                  </div>

                  {/* Target Geography */}
                  {sections.section5?.targetGeography && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Target Geography</h4>
                      <Badge className="bg-purple-500/10 text-purple-400/80 border-purple-500/20 text-sm px-3 py-1">
                        {sections.section5.targetGeography}
                      </Badge>
                    </div>
                  )}

                  {sections.section5?.targetCustomerDescription && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Target Customer</h4>
                      <p className="text-white/80 leading-relaxed">{sections.section5.targetCustomerDescription}</p>
                    </div>
                  )}

                  {/* SOM Timeframe */}
                  {sections.section5?.somTimeframe && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">SOM Timeframe</h4>
                      <p className="text-white/80">{sections.section5.somTimeframe}</p>
                    </div>
                  )}
                </Card>

                {/* Section 5: Competitive Landscape */}
                <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-cyan-400/70" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Competitive Landscape</h2>
                  </div>

                  {sections.section6?.competitors && sections.section6.competitors.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      {sections.section6.competitors.filter((c: any) => c.name).map((competitor: any, i: number) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <h4 className="font-semibold text-white mb-2">{competitor.name}</h4>
                          {competitor.description && <p className="text-white/50 text-sm mb-2">{competitor.description}</p>}
                          {competitor.howYouDiffer && (
                            <div className="flex items-start gap-2">
                              <Badge className="bg-emerald-500/10 text-emerald-400/80 border-emerald-500/20 text-xs shrink-0">Differentiation</Badge>
                              <p className="text-white/60 text-sm">{competitor.howYouDiffer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/50 mb-6">No competitors listed.</p>
                  )}

                  {sections.section6?.competitiveMoat && (
                    <div className="bg-white/5 rounded-xl p-6 border-l-4 border-[hsl(var(--cyan-glow))]/50">
                      <h4 className="text-sm font-semibold text-[hsl(var(--cyan-glow))]/70 uppercase tracking-wider mb-2">Competitive Moat</h4>
                      <p className="text-white/80 leading-relaxed">{sections.section6.competitiveMoat}</p>
                    </div>
                  )}
                </Card>



                {/* Current Ask / Fundraising */}
                {startup.current_ask && (
                  <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-8 shadow-[0_0_15px_rgba(6,182,212,0.08)]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-[hsl(var(--cyan-glow))]/70" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Current Ask</h2>
                        <p className="text-white/40 text-sm">Fundraising goals and use of funds</p>
                      </div>
                    </div>
                    <p className="text-white/80 leading-relaxed">
                      {startup.current_ask}
                    </p>
                  </Card>
                )}


              </div>
            )}


          </div>
        </ScrollArea>
      </DialogContent>

      {/* Market Sizing Dialog */}
      <Dialog open={selectedMetric !== null} onOpenChange={() => setSelectedMetric(null)}>
        <DialogContent className="bg-navy-card border-white/20 text-white max-w-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedMetric === "tam" ? "bg-blue-500/20" :
                selectedMetric === "sam" ? "bg-purple-500/20" : "bg-green-500/20"
              }`}>
                <BarChart3 className={`h-5 w-5 ${
                  selectedMetric === "tam" ? "text-blue-400" :
                  selectedMetric === "sam" ? "text-purple-400" : "text-green-400"
                }`} />
              </div>
              {selectedMetric === "tam" && "Total Addressable Market (TAM)"}
              {selectedMetric === "sam" && "Serviceable Addressable Market (SAM)"}
              {selectedMetric === "som" && "Serviceable Obtainable Market (SOM)"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Value Display */}
            <div className={`rounded-xl p-6 text-center border ${
              selectedMetric === "tam" ? "bg-blue-500/10 border-blue-500/30" :
              selectedMetric === "sam" ? "bg-purple-500/10 border-purple-500/30" : "bg-green-500/10 border-green-500/30"
            }`}>
              <p className="text-sm text-white/50 mb-1">Market Value</p>
              <p className="text-5xl font-bold text-white">
                {selectedMetric === "tam" && (sections.section5?.tamValue || "—")}
                {selectedMetric === "sam" && (sections.section5?.samValue || "—")}
                {selectedMetric === "som" && (sections.section5?.somValue || "—")}
              </p>
            </div>

            {/* Definition */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Definition
              </h4>
              <p className="text-white/80 leading-relaxed">
                {selectedMetric === "tam" && "The total market demand for a product or service, representing the maximum potential revenue opportunity if 100% market share were achieved."}
                {selectedMetric === "sam" && "The segment of the TAM targeted by your products/services that is within your geographical reach and target demographics."}
                {selectedMetric === "som" && "The realistic portion of SAM that you can capture, considering competition, resources, and current capabilities."}
              </p>
            </div>

            {/* Calculation Method (TAM only) */}
            {selectedMetric === "tam" && sections.section5?.tamCalculationMethod && (
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" /> Calculation Method
                </h4>
                <p className="text-white/80 leading-relaxed capitalize">{sections.section5.tamCalculationMethod}</p>
              </div>
            )}

            {/* Calculation Breakdown */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Calculator className="h-4 w-4" /> Calculation Breakdown
              </h4>
              <div className="text-white/80 leading-relaxed">
                {selectedMetric === "tam" && (
                  sections.section5?.tamBreakdown ? (
                    <p>{sections.section5.tamBreakdown}</p>
                  ) : (
                    <p className="text-white/50 italic">No calculation breakdown provided in the application.</p>
                  )
                )}
                {selectedMetric === "sam" && (
                  sections.section5?.samBreakdown ? (
                    <p>{sections.section5.samBreakdown}</p>
                  ) : (
                    <p className="text-white/50 italic">No calculation breakdown provided in the application.</p>
                  )
                )}
                {selectedMetric === "som" && (
                  sections.section5?.somBreakdown ? (
                    <p>{sections.section5.somBreakdown}</p>
                  ) : (
                    <p className="text-white/50 italic">No calculation breakdown provided in the application.</p>
                  )
                )}
              </div>
            </div>

            {/* Market Relationship Visual */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Market Hierarchy</h4>
              <div className="flex items-center justify-center gap-2">
                <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedMetric === "tam" 
                    ? "bg-blue-500/30 text-blue-300 ring-2 ring-blue-400" 
                    : "bg-blue-500/10 text-blue-400/70"
                }`}>
                  TAM: {sections.section5?.tamValue || "—"}
                </div>
                <ChevronRight className="h-4 w-4 text-white/30" />
                <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedMetric === "sam" 
                    ? "bg-purple-500/30 text-purple-300 ring-2 ring-purple-400" 
                    : "bg-purple-500/10 text-purple-400/70"
                }`}>
                  SAM: {sections.section5?.samValue || "—"}
                </div>
                <ChevronRight className="h-4 w-4 text-white/30" />
                <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedMetric === "som" 
                    ? "bg-green-500/30 text-green-300 ring-2 ring-green-400" 
                    : "bg-green-500/10 text-green-400/70"
                }`}>
                  SOM: {sections.section5?.somValue || "—"}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
