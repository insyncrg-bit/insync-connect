import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Target, 
  Zap, 
  XCircle, 
  DollarSign, 
  Briefcase, 
  Users, 
  Handshake, 
  Building2, 
  MapPin, 
  TrendingUp,
  ArrowLeft,
  FileText,
  Eye,
  ChevronRight,
  Edit2,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export interface InvestorApplication {
  id: string;
  firm_name: string;
  firm_description: string | null;
  thesis_statement: string | null;
  sub_themes: string[];
  fast_signals: string[];
  hard_nos: string[];
  check_sizes: string[];
  stage_focus: string[];
  sector_tags: string[];
  customer_types: string[];
  lead_follow: string | null;
  operating_support: string[];
  support_style: string | null;
  hq_location: string | null;
  aum: string | null;
  fund_type: string | null;
  geographic_focus: string | null;
  b2b_b2c: string | null;
  revenue_models: string[];
  minimum_traction: string[];
  board_involvement: string | null;
  decision_process: string | null;
  time_to_decision: string | null;
  website: string | null;
  company_linkedin: string | null;
  ownership_target: string | null;
  company_logo: string | null;
  top_investments: { name: string; website: string }[];
  sub_themes_other: string | null;
  non_negotiables: string | null;
  business_models: string[];
  key_metrics: string[];
  operating_support_other: string | null;
  time_to_first_response: string | null;
  gives_no_with_feedback: boolean | null;
  feedback_when: string | null;
  follow_on_reserves: string | null;
  follow_on_when: string | null;
}

interface InvestorThesisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: InvestorApplication | null;
  loading: boolean;
  onEditMemo?: () => void;
}

export function InvestorThesisModal({ open, onOpenChange, application, loading, onEditMemo }: InvestorThesisModalProps) {
  const [viewMode, setViewMode] = useState<"condensed" | "full">("condensed");

  const handleClose = () => {
    setViewMode("condensed");
    onOpenChange(false);
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-5xl max-h-[95vh] bg-[hsl(var(--navy-deep))] border-white/10 p-0">
          <div className="flex items-center justify-center py-12">
            <div className="text-white/60">Loading your thesis...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Sample data for preview when no application exists
  const sampleData: InvestorApplication = {
    id: "sample",
    firm_name: "Horizon Ventures",
    firm_description: "Horizon Ventures is an early-stage venture capital firm focused on backing exceptional founders building category-defining companies in enterprise software and deep tech. We partner closely with our portfolio companies from inception through scale.",
    thesis_statement: "We invest in technical founders building software that becomes critical infrastructure for enterprises. We look for companies solving hard problems with elegant solutions that create lasting competitive moats.",
    sub_themes: ["Developer Tools", "AI/ML Infrastructure", "Data Engineering", "Cloud Security", "API-First Products"],
    fast_signals: ["Technical founder with deep domain expertise", "Clear wedge into large market", "Early signs of product-led growth", "Customers willing to pay before product is built"],
    hard_nos: ["No clear path to $100M+ revenue", "Crowded market without differentiation", "Founder-market fit concerns", "Regulatory-dependent business models"],
    check_sizes: ["$500K - $1M", "$1M - $3M"],
    stage_focus: ["Pre-seed", "Seed"],
    sector_tags: ["Enterprise SaaS", "Developer Tools", "AI/ML", "Cybersecurity", "Fintech Infrastructure"],
    customer_types: ["SMB", "Mid-Market", "Enterprise"],
    lead_follow: "Lead",
    operating_support: ["Go-to-Market Strategy", "Hiring Key Executives", "Fundraising Prep", "Technical Architecture Review", "Customer Introductions"],
    support_style: "Hands-on",
    hq_location: "San Francisco, CA",
    aum: "$75M",
    fund_type: "Venture Capital",
    geographic_focus: "US, with selective international",
    b2b_b2c: "B2B",
    revenue_models: ["SaaS", "Usage-based", "Platform/Marketplace"],
    minimum_traction: ["$10K+ MRR", "Design partners actively using product"],
    board_involvement: "Take board seats on lead investments",
    decision_process: "Partner meetings weekly, term sheets within 2 weeks of first meeting",
    time_to_decision: "1-2 weeks",
    website: "https://horizonventures.vc",
    company_linkedin: null,
    ownership_target: "10-15%",
    company_logo: null,
    top_investments: [
      { name: "Stripe", website: "https://stripe.com" },
      { name: "Airbnb", website: "https://airbnb.com" },
      { name: "SpaceX", website: "https://spacex.com" }
    ],
    sub_themes_other: null,
    non_negotiables: "Must have a technical co-founder.",
    business_models: ["SaaS", "Marketplace"],
    key_metrics: ["NPS > 50", "30% MoM growth"],
    operating_support_other: null,
    time_to_first_response: "24-48 hours",
    gives_no_with_feedback: true,
    feedback_when: "Within 48 hours of meeting",
    follow_on_reserves: "Pro-rata is reserved for all investments",
    follow_on_when: "Series A and B",
  };

  const displayData = application || sampleData;
  const isPreview = !application;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] bg-[hsl(var(--navy-deep))] border-[hsl(var(--cyan-glow))]/20 p-0 overflow-hidden [&>button]:hidden">
        <ScrollArea className="max-h-[95vh]">
          <div className="p-6 space-y-6">
            {/* Preview Banner */}
            {isPreview && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-amber-400 text-sm text-center">
                  📋 This is a preview with sample data. Complete your investor application to see your personalized thesis.
                </p>
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">My Thesis</h2>
                <p className="text-white/60">Your investment thesis and criteria</p>
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
                      Full Thesis
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      handleClose();
                      onEditMemo?.();
                    }}
                    className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/30 border border-[hsl(var(--cyan-glow))]/30 h-10 px-4"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="text-white/60 hover:text-white hover:bg-white/10 h-10 w-10"
                    title="Close"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
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
                        {/* Logo or fallback building icon */}
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg shadow-[hsl(var(--cyan-glow))]/20">
                          {displayData.company_logo ? (
                            <img src={displayData.company_logo} alt={displayData.firm_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center">
                              <Building2 className="h-10 w-10 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          {/* Firm name — hyperlinked to website if available */}
                          {displayData.website ? (
                            <a
                              href={displayData.website.startsWith("http") ? displayData.website : `https://${displayData.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-3xl font-bold text-white hover:text-[hsl(var(--cyan-glow))] transition-colors"
                            >
                              {displayData.firm_name}
                            </a>
                          ) : (
                            <h1 className="text-3xl font-bold text-white">{displayData.firm_name}</h1>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {/* HQ location only */}
                            {displayData.hq_location && (
                              <Badge className="bg-[hsl(var(--cyan-bright))]/20 text-[hsl(var(--cyan-bright))] border-[hsl(var(--cyan-bright))]/30 text-sm">
                                📍 {displayData.hq_location}
                              </Badge>
                            )}
                            {displayData.company_linkedin && (
                              <a
                                href={displayData.company_linkedin.startsWith("http") ? displayData.company_linkedin : `https://${displayData.company_linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-7 h-7 rounded bg-[#0A66C2]/20 hover:bg-[#0A66C2]/40 transition-colors"
                                title="LinkedIn"
                              >
                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#0A66C2]">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Thesis Statement */}
                    <div className="bg-white/5 rounded-xl p-4 mb-6">
                      <p className="text-lg text-white/90 italic">
                        {displayData.thesis_statement ? `"${displayData.thesis_statement.slice(0, 200)}${displayData.thesis_statement.length > 200 ? '...' : ''}"` : "Investment thesis will appear here."}
                      </p>
                    </div>

                    {/* Key Metrics Row: Check Size | Stage Focus | AUM */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                        <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Check Size</p>
                        <p className="text-xl font-bold text-white">{displayData.check_sizes?.[0] || "—"}</p>
                        <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                          View details <ChevronRight className="h-3 w-3" />
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                        <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Stage Focus</p>
                        <p className="text-xl font-bold text-white text-center">{displayData.stage_focus?.[0] || "—"}</p>
                        <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                          View details <ChevronRight className="h-3 w-3" />
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Quick Stats Row: Ownership Target | Fund Type | Lead/Follow */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                        <Target className="h-5 w-5 text-[hsl(var(--cyan-glow))]/70" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs font-medium">Ownership Target</p>
                        <p className="text-white font-semibold">{displayData.ownership_target || "—"}</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-purple-400/70" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs font-medium">Fund Type</p>
                        <p className="text-white font-semibold">{displayData.fund_type || "—"}</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-emerald-400/70" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs font-medium">Lead/Follow</p>
                        <p className="text-white font-semibold">{displayData.lead_follow || "—"}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Full-width Support Style */}
                <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Handshake className="h-4 w-4 text-amber-400/70" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Support Style</h3>
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    {displayData.support_style || "How the firm supports its portfolio companies."}
                  </p>
                </Card>
              </div>
            )}

            {/* Full Thesis View */}
            {viewMode === "full" && (
              <div className="space-y-8">
                {/* Header Section */}
                <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-8 shadow-[0_0_15px_rgba(6,182,212,0.08)]">
                  <div className="text-center mb-8">
                    {/* Logo or fallback building icon */}
                    <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-lg shadow-[hsl(var(--cyan-glow))]/20 mb-4">
                      {displayData.company_logo ? (
                        <img src={displayData.company_logo} alt={displayData.firm_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center">
                          <Building2 className="h-12 w-12 text-white" />
                        </div>
                      )}
                    </div>
                    {/* Firm name — hyperlinked to website if available */}
                    {displayData.website ? (
                      <a
                        href={displayData.website.startsWith("http") ? displayData.website : `https://${displayData.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-4xl font-bold text-white hover:text-[hsl(var(--cyan-glow))] transition-colors mb-2 block"
                      >
                        {displayData.firm_name}
                      </a>
                    ) : (
                      <h1 className="text-4xl font-bold text-white mb-2">{displayData.firm_name}</h1>
                    )}
                    <p className="text-xl text-white/70 mb-4">{displayData.fund_type} • {displayData.lead_follow}</p>
                    <div className="flex justify-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {displayData.hq_location || "Location not specified"}</span>
                    </div>
                  </div>

                  <div className="max-w-3xl mx-auto">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-sm font-semibold text-[hsl(var(--cyan-glow))] uppercase tracking-wider mb-3">Investment Thesis</h3>
                      <p className="text-lg text-white/90 leading-relaxed italic">
                        {displayData.thesis_statement ? `"${displayData.thesis_statement}"` : "Investment thesis will appear here."}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Investment Strategy & Parameters */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strategy Fields */}
                  <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <Target className="h-5 w-5 text-purple-400/70" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Investment Strategy</h2>
                    </div>
                    
                    <div className="space-y-6">
                      {displayData.sub_themes.length > 0 && (
                        <div>
                          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Focus Areas</p>
                          <div className="flex flex-wrap gap-2">
                            {displayData.sub_themes.map((theme, i) => (
                              <Badge key={i} className="bg-purple-500/20 border-purple-500/40 text-purple-300">
                                {theme}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {displayData.sector_tags.length > 0 && (
                        <div>
                          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Sector Focus</p>
                          <div className="flex flex-wrap gap-2">
                            {displayData.sector_tags.map((tag, i) => (
                              <Badge key={i} className="bg-emerald-500/20 border-emerald-500/40 text-emerald-300">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {displayData.business_models.length > 0 && (
                        <div>
                          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Target Business Models</p>
                          <div className="flex flex-wrap gap-2">
                            {displayData.business_models.map((model, i) => (
                              <Badge key={i} className="bg-blue-500/20 border-blue-500/40 text-blue-300">
                                {model}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {displayData.key_metrics.length > 0 && (
                        <div>
                          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Key Metrics Tracked</p>
                          <div className="space-y-2">
                            {displayData.key_metrics.map((metric, i) => (
                              <div key={i} className="flex items-start gap-3 text-white/80 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                                <span>{metric}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {displayData.non_negotiables && (
                        <div>
                          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Non-Negotiables</p>
                          <p className="text-white/70 text-sm leading-relaxed">{displayData.non_negotiables}</p>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Fund Parameters */}
                  <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)] h-fit">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-emerald-400/70" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Fund Parameters</h2>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Check Size</p>
                        <div className="flex flex-wrap gap-2">
                          {displayData.check_sizes.length > 0 ? (
                            displayData.check_sizes.map((size, i) => (
                              <Badge key={i} className="bg-white/10 border-white/20 text-white">
                                {size}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-white/40 italic">Not specified</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Stage Focus</p>
                        <div className="flex flex-wrap gap-2">
                          {displayData.stage_focus.length > 0 ? (
                            displayData.stage_focus.map((stage, i) => (
                              <Badge key={i} className="bg-white/10 border-white/20 text-white">
                                {stage}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-white/40 italic">Not specified</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Ownership Target</p>
                        <span className="text-white font-medium">{displayData.ownership_target || "Not specified"}</span>
                      </div>

                      {displayData.geographic_focus && (
                        <div>
                          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Geographic Focus</p>
                          <span className="text-white font-medium">{displayData.geographic_focus}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Top Investments */}
                {displayData.top_investments.length > 0 && (
                  <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-amber-400/70" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Top Investments</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {displayData.top_investments.map((inv, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center hover:bg-white/10 transition-all group">
                          <p className="text-white font-medium mb-2">{inv.name}</p>
                          {inv.website && (
                            <a 
                              href={inv.website.startsWith("http") ? inv.website : `https://${inv.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[hsl(var(--cyan-glow))] hover:underline flex items-center justify-center gap-1"
                            >
                              Website <ChevronRight className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Value Add & Engagement */}
                <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                      <Handshake className="h-5 w-5 text-[hsl(var(--cyan-glow))]/70" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Value Add & Engagement</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-4">Post-Investment Support</p>
                        <div className="flex flex-wrap gap-2">
                          {displayData.operating_support.length > 0 ? (
                            displayData.operating_support.map((support, i) => (
                              <Badge key={i} className="bg-[hsl(var(--cyan-glow))]/10 border-[hsl(var(--cyan-glow))]/30 text-[hsl(var(--cyan-glow))]">
                                {support}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-white/40 italic">Not specified</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Board Involvement</p>
                        <p className="text-white/70 text-sm leading-relaxed">{displayData.board_involvement || "Not specified"}</p>
                      </div>

                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Decision Process</p>
                        <p className="text-white/70 text-sm leading-relaxed">{displayData.decision_process || "Not specified"}</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Engagement Style</p>
                        <span className="text-white font-medium">
                          {displayData.support_style || "Standard"}
                        </span>
                      </div>

                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-3">First Response Timeline</p>
                        <span className="text-white font-medium">{displayData.time_to_first_response || "Not specified"}</span>
                      </div>

                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Feedback Policy</p>
                        <p className="text-white/70 text-sm italic">
                          {displayData.gives_no_with_feedback 
                            ? `Provide constructive feedback ${displayData.feedback_when ? ' ' + displayData.feedback_when : 'on all deals'}.`
                            : "Standard rejection process."}
                        </p>
                      </div>

                      {(displayData.follow_on_reserves || displayData.follow_on_when) && (
                        <div>
                          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Follow-on Reserves</p>
                          <p className="text-white/70 text-sm leading-relaxed">
                            {displayData.follow_on_reserves} {displayData.follow_on_when && `(${displayData.follow_on_when})`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Firm Description (Move to bottom as more of a "Bio" section) */}
                {displayData.firm_description && (
                  <Card className="bg-navy-card border-white/5 p-8 opacity-80">
                    <h2 className="text-sm font-semibold text-[hsl(var(--cyan-glow))] uppercase tracking-wider mb-4">About {displayData.firm_name}</h2>
                    <p className="text-white/60 leading-relaxed text-sm">
                      {displayData.firm_description}
                    </p>
                  </Card>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
