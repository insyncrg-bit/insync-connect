import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Edit2
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
}

interface InvestorThesisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: InvestorApplication | null;
  loading: boolean;
}

export function InvestorThesisModal({ open, onOpenChange, application, loading }: InvestorThesisModalProps) {
  const navigate = useNavigate();
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
  };

  const displayData = application || sampleData;
  const isPreview = !application;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] bg-[hsl(var(--navy-deep))] border-[hsl(var(--cyan-glow))]/20 p-0 overflow-hidden">
        <ScrollArea className="max-h-[95vh]">
          <div className="p-6 space-y-6">
            {/* Back Button */}
            <Button
              onClick={handleClose}
              className="bg-[hsl(var(--cyan-glow))] text-[#151a24] hover:bg-[hsl(var(--cyan-bright))] shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-300 font-semibold"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Your Dashboard
            </Button>

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
                <Button
                  onClick={() => navigate("/vc-onboarding")}
                  className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/30 border border-[hsl(var(--cyan-glow))]/30"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
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
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shadow-lg shadow-[hsl(var(--cyan-glow))]/20">
                          <Building2 className="h-10 w-10 text-white" />
                        </div>
                        <div>
                          <h1 className="text-3xl font-bold text-white mb-2">{displayData.firm_name}</h1>
                          <div className="flex flex-wrap gap-2">
                            {displayData.sector_tags.slice(0, 1).map((sector, i) => (
                              <Badge key={i} className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/30 text-sm">
                                {sector}
                              </Badge>
                            ))}
                            {displayData.stage_focus.slice(0, 1).map((stage, i) => (
                              <Badge key={i} className="bg-white/10 text-white/80 border-white/20 text-sm">
                                {stage}
                              </Badge>
                            ))}
                            {displayData.hq_location && (
                              <Badge className="bg-[hsl(var(--cyan-bright))]/20 text-[hsl(var(--cyan-bright))] border-[hsl(var(--cyan-bright))]/30 text-sm">
                                📍 {displayData.hq_location}
                              </Badge>
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

                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                        <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Check Size</p>
                        <p className="text-xl font-bold text-white">{displayData.check_sizes?.[0] || "—"}</p>
                        <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                          View details <ChevronRight className="h-3 w-3" />
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                        <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Stage Focus</p>
                        <p className="text-xl font-bold text-white">{displayData.stage_focus?.[0] || "—"}</p>
                        <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                          View details <ChevronRight className="h-3 w-3" />
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                        <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Decision Time</p>
                        <p className="text-xl font-bold text-white">{displayData.time_to_decision || "—"}</p>
                        <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                          View details <ChevronRight className="h-3 w-3" />
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-[hsl(var(--cyan-glow))]/70" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs font-medium">AUM</p>
                        <p className="text-white font-semibold">{displayData.aum || "—"}</p>
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
                  <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Handshake className="h-5 w-5 text-amber-400/70" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs font-medium">Support Style</p>
                        <p className="text-white font-semibold">{displayData.support_style || "—"}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Fast Signals & Hard Nos */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-emerald-400/70" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Fast Signals</h3>
                    </div>
                    <p className="text-white/70 leading-relaxed">
                      {displayData.fast_signals.length > 0 
                        ? displayData.fast_signals.slice(0, 2).join(", ") + (displayData.fast_signals.length > 2 ? "..." : "")
                        : "What makes you move quickly on deals."}
                    </p>
                  </Card>

                  <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                        <XCircle className="h-4 w-4 text-rose-400/70" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Hard Nos</h3>
                    </div>
                    <p className="text-white/70 leading-relaxed">
                      {displayData.hard_nos.length > 0 
                        ? displayData.hard_nos.slice(0, 2).join(", ") + (displayData.hard_nos.length > 2 ? "..." : "")
                        : "Your dealbreakers."}
                    </p>
                  </Card>
                </div>
              </div>
            )}

            {/* Full Thesis View */}
            {viewMode === "full" && (
              <div className="space-y-8">
                {/* Header Section */}
                <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-8 shadow-[0_0_15px_rgba(6,182,212,0.08)]">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shadow-lg shadow-[hsl(var(--cyan-glow))]/20 mb-4">
                      <Building2 className="h-12 w-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">{displayData.firm_name}</h1>
                    <p className="text-xl text-white/70 mb-4">{displayData.fund_type} • {displayData.lead_follow}</p>
                    <div className="flex justify-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {displayData.hq_location || "Location not specified"}</span>
                      {displayData.aum && <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> {displayData.aum}</span>}
                    </div>
                  </div>

                  <div className="max-w-3xl mx-auto">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-sm font-semibold text-[hsl(var(--cyan-glow))] uppercase tracking-wider mb-3">Investment Thesis</h3>
                      <p className="text-lg text-white/90 leading-relaxed">
                        {displayData.thesis_statement || "Investment thesis will appear here."}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Firm Description */}
                {displayData.firm_description && (
                  <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-[hsl(var(--cyan-glow))]/70" />
                      </div>
                      <h2 className="text-xl font-bold text-white">About the Firm</h2>
                    </div>
                    <p className="text-white/70 leading-relaxed">
                      {displayData.firm_description}
                    </p>
                  </Card>
                )}

                {/* Focus Areas */}
                {displayData.sub_themes.length > 0 && (
                  <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <Target className="h-5 w-5 text-purple-400/70" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Focus Areas</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {displayData.sub_themes.map((theme, i) => (
                        <Badge key={i} className="bg-purple-500/20 border-purple-500/40 text-purple-300 px-3 py-1.5">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Fast Signals & Hard Nos */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-navy-card border-green-500/20 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-green-400/70" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Fast Signals</h2>
                        <p className="text-white/40 text-sm">What makes you move quickly</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {displayData.fast_signals.length > 0 ? (
                        displayData.fast_signals.map((signal, i) => (
                          <div key={i} className="flex items-start gap-3 text-white/80">
                            <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                            <span>{signal}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-white/40 italic">Not specified</p>
                      )}
                    </div>
                  </Card>

                  <Card className="bg-navy-card border-red-500/20 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <XCircle className="h-5 w-5 text-red-400/70" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Hard Nos</h2>
                        <p className="text-white/40 text-sm">Dealbreakers</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {displayData.hard_nos.length > 0 ? (
                        displayData.hard_nos.map((no, i) => (
                          <div key={i} className="flex items-start gap-3 text-white/80">
                            <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                            <span>{no}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-white/40 italic">Not specified</p>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Investment Parameters */}
                <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-emerald-400/70" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Investment Parameters</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
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
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Decision Timeline</p>
                      <span className="text-white">{displayData.time_to_decision || "Not specified"}</span>
                    </div>
                  </div>
                </Card>

                {/* Sectors & Target Customers */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-blue-400/70" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Sectors</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {displayData.sector_tags.length > 0 ? (
                        displayData.sector_tags.map((sector, i) => (
                          <Badge key={i} className="bg-blue-500/20 border-blue-500/40 text-blue-300">
                            {sector}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-white/40 italic">Sector agnostic</span>
                      )}
                    </div>
                  </Card>

                  <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-cyan-400/70" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Target Customers</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {displayData.customer_types.length > 0 ? (
                        displayData.customer_types.map((type, i) => (
                          <Badge key={i} className="bg-cyan-500/20 border-cyan-500/40 text-cyan-300">
                            {type}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-white/40 italic">Not specified</span>
                      )}
                    </div>
                    {displayData.b2b_b2c && (
                      <p className="text-white/60 text-sm mt-4">
                        <span className="text-white/40">Focus:</span> {displayData.b2b_b2c}
                      </p>
                    )}
                  </Card>
                </div>

                {/* Value-Add */}
                <Card className="bg-navy-card border-amber-500/20 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Handshake className="h-5 w-5 text-amber-400/70" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">How You Add Value</h2>
                      {displayData.support_style && (
                        <p className="text-white/40 text-sm">{displayData.support_style} engagement</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {displayData.operating_support.length > 0 ? (
                      displayData.operating_support.map((support, i) => (
                        <Badge key={i} className="bg-amber-500/20 border-amber-500/40 text-amber-300">
                          {support}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-white/40 italic">Not specified</span>
                    )}
                  </div>

                  {displayData.board_involvement && (
                    <p className="text-white/60 text-sm">
                      <span className="text-white/40">Board involvement:</span> {displayData.board_involvement}
                    </p>
                  )}
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
