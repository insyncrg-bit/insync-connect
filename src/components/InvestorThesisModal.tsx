import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Maximize2,
  Minimize2
} from "lucide-react";

interface InvestorApplication {
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullThesis, setShowFullThesis] = useState(false);

  const handleClose = () => {
    setIsFullscreen(false);
    setShowFullThesis(false);
    onOpenChange(false);
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-[hsl(220,60%,8%)] border-white/10">
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
      <DialogContent className={`bg-[hsl(220,60%,8%)] border-[hsl(var(--cyan-glow))]/30 text-white p-0 overflow-hidden transition-all duration-300 ${
        isFullscreen 
          ? 'max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none' 
          : 'max-w-4xl max-h-[90vh]'
      }`}>
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[hsl(220,60%,8%)]">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="text-white/70 hover:text-white hover:bg-white/10 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFullThesis(!showFullThesis)}
              className="border-[hsl(var(--cyan-glow))]/30 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10 gap-2"
            >
              <FileText className="h-4 w-4" />
              {showFullThesis ? "Condensed View" : "Full Thesis"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="border-white/20 text-white/70 hover:text-white hover:bg-white/10"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <ScrollArea className={isFullscreen ? "h-[calc(100vh-65px)]" : "max-h-[calc(90vh-65px)]"}>
          <div className="p-6">
            {/* Preview Banner */}
            {isPreview && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
                <p className="text-amber-400 text-sm text-center">
                  📋 This is a preview with sample data. Complete your investor application to see your personalized thesis.
                </p>
              </div>
            )}

            {/* Header */}
            <DialogHeader className="mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold text-white mb-1">
                    {displayData.firm_name}
                  </DialogTitle>
                  <DialogDescription className="text-white/60 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {displayData.hq_location || "Location not specified"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Quick Stats Row */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 ${!showFullThesis && 'hidden md:grid'}`}>
              {displayData.hq_location && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                    <MapPin className="h-3 w-3" />
                    Location
                  </div>
                  <p className={`text-white text-sm font-medium ${!showFullThesis && 'line-clamp-1'}`}>{displayData.hq_location}</p>
                </div>
              )}
              {displayData.fund_type && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                    <Briefcase className="h-3 w-3" />
                    Fund Type
                  </div>
                  <p className={`text-white text-sm font-medium ${!showFullThesis && 'line-clamp-1'}`}>{displayData.fund_type}</p>
                </div>
              )}
              {displayData.aum && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                    <DollarSign className="h-3 w-3" />
                    AUM
                  </div>
                  <p className={`text-white text-sm font-medium ${!showFullThesis && 'line-clamp-1'}`}>{displayData.aum}</p>
                </div>
              )}
              {displayData.lead_follow && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                    <TrendingUp className="h-3 w-3" />
                    Role
                  </div>
                  <p className={`text-white text-sm font-medium ${!showFullThesis && 'line-clamp-1'}`}>{displayData.lead_follow}</p>
                </div>
              )}
            </div>

            {/* Firm Description */}
            {displayData.firm_description && (
              <div className="mb-6">
                <p className={`text-white/70 text-sm leading-relaxed ${!showFullThesis && 'line-clamp-2'}`}>
                  {displayData.firm_description}
                </p>
              </div>
            )}

            {/* Core Thesis */}
            <div className="bg-gradient-to-br from-[hsl(var(--cyan-glow))]/10 to-transparent rounded-xl p-6 border border-[hsl(var(--cyan-glow))]/30 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                </div>
                <h3 className="text-lg font-semibold text-white">Core Thesis</h3>
              </div>
              <p className={`text-white/90 leading-relaxed text-lg ${!showFullThesis && 'line-clamp-3'}`}>
                {displayData.thesis_statement || "No thesis statement provided."}
              </p>
              
              {displayData.sub_themes.length > 0 && (
                <div className={`mt-5 pt-5 border-t border-white/10 ${!showFullThesis && 'hidden'}`}>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Focus Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {displayData.sub_themes.map((theme, i) => (
                      <Badge key={i} className="bg-[hsl(var(--cyan-glow))]/20 border-[hsl(var(--cyan-glow))]/40 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/30">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Investment Criteria Grid - Only show in full thesis mode */}
            <div className={`grid md:grid-cols-2 gap-4 mb-6 ${!showFullThesis && 'hidden'}`}>
              {/* Fast Signals */}
              <div className="bg-green-500/5 rounded-xl p-5 border border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Fast Signals</h4>
                    <p className="text-white/40 text-xs">What makes us move quickly</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {displayData.fast_signals.length > 0 ? (
                    displayData.fast_signals.map((signal, i) => (
                      <div key={i} className="flex items-start gap-2 text-white/80 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                        <span>{signal}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/40 text-sm italic">Not specified</p>
                  )}
                </div>
              </div>

              {/* Hard Nos */}
              <div className="bg-red-500/5 rounded-xl p-5 border border-red-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <XCircle className="h-4 w-4 text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Hard Nos</h4>
                    <p className="text-white/40 text-xs">Dealbreakers</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {displayData.hard_nos.length > 0 ? (
                    displayData.hard_nos.map((no, i) => (
                      <div key={i} className="flex items-start gap-2 text-white/80 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                        <span>{no}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/40 text-sm italic">Not specified</p>
                  )}
                </div>
              </div>
            </div>

            {/* Investment Parameters - Only show in full thesis mode */}
            <div className={`bg-white/5 rounded-xl p-5 border border-white/10 mb-6 ${!showFullThesis && 'hidden'}`}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-white/80" />
                </div>
                <h4 className="font-semibold text-white">Investment Parameters</h4>
              </div>
              
              <div className="grid md:grid-cols-3 gap-5">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Check Size</p>
                  <div className="flex flex-wrap gap-1.5">
                    {displayData.check_sizes.length > 0 ? (
                      displayData.check_sizes.map((size, i) => (
                        <Badge key={i} variant="outline" className="bg-white/5 border-white/20 text-white text-xs">
                          {size}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-white/40 text-sm italic">Not specified</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Stage Focus</p>
                  <div className="flex flex-wrap gap-1.5">
                    {displayData.stage_focus.length > 0 ? (
                      displayData.stage_focus.map((stage, i) => (
                        <Badge key={i} variant="outline" className="bg-white/5 border-white/20 text-white text-xs">
                          {stage}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-white/40 text-sm italic">Not specified</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Decision Timeline</p>
                  <span className="text-white/80 text-sm">{displayData.time_to_decision || "Not specified"}</span>
                </div>
              </div>
            </div>

            {/* Sectors & Target Customers - Only show in full thesis mode */}
            <div className={`grid md:grid-cols-2 gap-4 mb-6 ${!showFullThesis && 'hidden'}`}>
              <div className="bg-purple-500/5 rounded-xl p-5 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-white">Sectors</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {displayData.sector_tags.length > 0 ? (
                    displayData.sector_tags.map((sector, i) => (
                      <Badge key={i} className="bg-purple-500/20 border-purple-500/40 text-purple-300 text-xs">
                        {sector}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-white/40 text-sm italic">Sector agnostic</span>
                  )}
                </div>
              </div>

              <div className="bg-blue-500/5 rounded-xl p-5 border border-blue-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-white">Target Customers</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {displayData.customer_types.length > 0 ? (
                    displayData.customer_types.map((type, i) => (
                      <Badge key={i} className="bg-blue-500/20 border-blue-500/40 text-blue-300 text-xs">
                        {type}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-white/40 text-sm italic">Not specified</span>
                  )}
                </div>
                {displayData.b2b_b2c && (
                  <p className="text-white/60 text-sm mt-3">
                    <span className="text-white/40">Focus:</span> {displayData.b2b_b2c}
                  </p>
                )}
              </div>
            </div>

            {/* Value-Add - Only show in full thesis mode */}
            <div className={`bg-amber-500/5 rounded-xl p-5 border border-amber-500/20 ${!showFullThesis && 'hidden'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Handshake className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">How We Add Value</h4>
                  {displayData.support_style && (
                    <p className="text-white/40 text-xs">{displayData.support_style} engagement</p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {displayData.operating_support.length > 0 ? (
                  displayData.operating_support.map((support, i) => (
                    <Badge key={i} className="bg-amber-500/20 border-amber-500/40 text-amber-300 text-xs">
                      {support}
                    </Badge>
                  ))
                ) : (
                  <span className="text-white/40 text-sm italic">Not specified</span>
                )}
              </div>

              {displayData.board_involvement && (
                <p className="text-white/60 text-sm mt-4">
                  <span className="text-white/40">Board involvement:</span> {displayData.board_involvement}
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
