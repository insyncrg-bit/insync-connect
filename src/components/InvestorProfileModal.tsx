import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
  Loader2,
  ArrowLeft,
  FileText,
  Eye,
  ChevronRight,
  Maximize2,
  Minimize2
} from "lucide-react";
import insyncInfinity from "@/assets/insync-infinity.png";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface InvestorApplication {
  id: string;
  user_id: string;
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

interface Analyst {
  id: string;
  name: string;
  location: string;
  vertical: string;
  oneLiner: string;
}

interface InvestorProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investor: InvestorApplication | null;
  loading: boolean;
  onSync: (investorUserId: string, note: string) => Promise<void>;
  isSyncing: boolean;
  alreadySynced: boolean;
}

export function InvestorProfileModal({ 
  open, 
  onOpenChange, 
  investor, 
  loading, 
  onSync,
  isSyncing,
  alreadySynced
}: InvestorProfileModalProps) {
  const [syncNote, setSyncNote] = useState("");
  const [showSyncForm, setShowSyncForm] = useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = useState<Analyst | null>(null);
  const [viewMode, setViewMode] = useState<"condensed" | "full">("condensed");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock analysts data - in production this would come from the database
  const getAnalystsForFirm = (): Analyst[] => {
    // This is placeholder data - will be replaced with real data when analysts table is created
    return [
      { id: "1", name: "Anna", location: "Boston, MA", vertical: "AI/ML", oneLiner: "Passionate about deep tech and founder-first investing." },
      { id: "2", name: "John", location: "New York, NY", vertical: "FinTech", oneLiner: "Former founder, now helping the next generation scale." },
      { id: "3", name: "Sarah", location: "San Francisco, CA", vertical: "HealthTech", oneLiner: "Healthcare operator turned investor." },
    ];
  };

  const analysts = investor ? getAnalystsForFirm() : [];

  const wordCount = syncNote.trim().split(/\s+/).filter(Boolean).length;
  const isOverLimit = wordCount > 60;

  const handleSync = async (analyst: Analyst) => {
    if (investor && !isOverLimit) {
      // In the future, we'd pass the analyst ID to associate the sync with specific analyst
      await onSync(investor.user_id, `[Sync with ${analyst.name}] ${syncNote}`);
      setSyncNote("");
      setShowSyncForm(false);
      setSelectedAnalyst(null);
    }
  };

  const handleAnalystClick = (analyst: Analyst) => {
    setSelectedAnalyst(analyst);
    setShowSyncForm(true);
  };

  const handleClose = () => {
    setViewMode("condensed");
    setIsFullscreen(false);
    onOpenChange(false);
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-5xl max-h-[95vh] bg-[hsl(var(--navy-deep))] border-white/10 p-0">
          <div className="flex items-center justify-center py-12">
            <div className="text-white/60">Loading investor profile...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!investor) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`bg-[hsl(var(--navy-deep))] border-[hsl(var(--cyan-glow))]/20 p-0 overflow-hidden transition-all duration-300 ${
        isFullscreen 
          ? 'max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none' 
          : 'max-w-5xl max-h-[95vh]'
      }`}>
        <ScrollArea className={isFullscreen ? "h-[100vh]" : "max-h-[95vh]"}>
          <div className="p-6 space-y-6">
            {/* Back Button */}
            <Button
              onClick={handleClose}
              className="bg-[hsl(var(--cyan-glow))] text-[#151a24] hover:bg-[hsl(var(--cyan-bright))] shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-300 font-semibold"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Investment Thesis</h2>
                <p className="text-white/60">Investor profile and investment criteria</p>
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
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="border-white/20 text-white/70 hover:text-white hover:bg-white/10"
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
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
                          <h1 className="text-3xl font-bold text-white mb-2">{investor.firm_name}</h1>
                          <div className="flex flex-wrap gap-2">
                            {investor.sector_tags.slice(0, 1).map((sector, i) => (
                              <Badge key={i} className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/30 text-sm">
                                {sector}
                              </Badge>
                            ))}
                            {investor.stage_focus.slice(0, 1).map((stage, i) => (
                              <Badge key={i} className="bg-white/10 text-white/80 border-white/20 text-sm">
                                {stage}
                              </Badge>
                            ))}
                            {investor.hq_location && (
                              <Badge className="bg-[hsl(var(--cyan-bright))]/20 text-[hsl(var(--cyan-bright))] border-[hsl(var(--cyan-bright))]/30 text-sm">
                                📍 {investor.hq_location}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Thesis Statement */}
                    <div className="bg-white/5 rounded-xl p-4 mb-6">
                      <p className="text-lg text-white/90 italic">
                        {investor.thesis_statement ? `"${investor.thesis_statement.slice(0, 200)}${investor.thesis_statement.length > 200 ? '...' : ''}"` : "Investment thesis will appear here."}
                      </p>
                    </div>

                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                        <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Check Size</p>
                        <p className="text-xl font-bold text-white">{investor.check_sizes?.[0] || "—"}</p>
                        <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                          View details <ChevronRight className="h-3 w-3" />
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                        <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Stage Focus</p>
                        <p className="text-xl font-bold text-white">{investor.stage_focus?.[0] || "—"}</p>
                        <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                          View details <ChevronRight className="h-3 w-3" />
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                        <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Decision Time</p>
                        <p className="text-xl font-bold text-white">{investor.time_to_decision || "—"}</p>
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
                        <p className="text-white font-semibold">{investor.aum || "—"}</p>
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
                        <p className="text-white font-semibold">{investor.fund_type || "—"}</p>
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
                        <p className="text-white font-semibold">{investor.lead_follow || "—"}</p>
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
                        <p className="text-white font-semibold">{investor.support_style || "—"}</p>
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
                      {investor.fast_signals.length > 0 
                        ? investor.fast_signals.slice(0, 2).join(", ") + (investor.fast_signals.length > 2 ? "..." : "")
                        : "What makes this investor move quickly."}
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
                      {investor.hard_nos.length > 0 
                        ? investor.hard_nos.slice(0, 2).join(", ") + (investor.hard_nos.length > 2 ? "..." : "")
                        : "Dealbreakers for this investor."}
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
                    <h1 className="text-4xl font-bold text-white mb-2">{investor.firm_name}</h1>
                    <p className="text-xl text-white/70 mb-4">{investor.fund_type} • {investor.lead_follow}</p>
                    <div className="flex justify-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {investor.hq_location || "Location not specified"}</span>
                      {investor.aum && <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> {investor.aum}</span>}
                    </div>
                  </div>

                  <div className="max-w-3xl mx-auto">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-sm font-semibold text-[hsl(var(--cyan-glow))] uppercase tracking-wider mb-3">Investment Thesis</h3>
                      <p className="text-lg text-white/90 leading-relaxed">
                        {investor.thesis_statement || "Investment thesis will appear here."}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Firm Description */}
                {investor.firm_description && (
                  <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-[hsl(var(--cyan-glow))]/70" />
                      </div>
                      <h2 className="text-xl font-bold text-white">About the Firm</h2>
                    </div>
                    <p className="text-white/70 leading-relaxed">
                      {investor.firm_description}
                    </p>
                  </Card>
                )}

                {/* Focus Areas */}
                {investor.sub_themes.length > 0 && (
                  <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <Target className="h-5 w-5 text-purple-400/70" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Focus Areas</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {investor.sub_themes.map((theme, i) => (
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
                        <p className="text-white/40 text-sm">What makes them move quickly</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {investor.fast_signals.length > 0 ? (
                        investor.fast_signals.map((signal, i) => (
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
                      {investor.hard_nos.length > 0 ? (
                        investor.hard_nos.map((no, i) => (
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
                        {investor.check_sizes.length > 0 ? (
                          investor.check_sizes.map((size, i) => (
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
                        {investor.stage_focus.length > 0 ? (
                          investor.stage_focus.map((stage, i) => (
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
                      <span className="text-white">{investor.time_to_decision || "Not specified"}</span>
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
                      {investor.sector_tags.length > 0 ? (
                        investor.sector_tags.map((sector, i) => (
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
                      {investor.customer_types.length > 0 ? (
                        investor.customer_types.map((type, i) => (
                          <Badge key={i} className="bg-cyan-500/20 border-cyan-500/40 text-cyan-300">
                            {type}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-white/40 italic">Not specified</span>
                      )}
                    </div>
                    {investor.b2b_b2c && (
                      <p className="text-white/60 text-sm mt-4">
                        <span className="text-white/40">Focus:</span> {investor.b2b_b2c}
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
                      <h2 className="text-xl font-bold text-white">How They Add Value</h2>
                      {investor.support_style && (
                        <p className="text-white/40 text-sm">{investor.support_style} engagement</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {investor.operating_support.length > 0 ? (
                      investor.operating_support.map((support, i) => (
                        <Badge key={i} className="bg-amber-500/20 border-amber-500/40 text-amber-300">
                          {support}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-white/40 italic">Not specified</span>
                    )}
                  </div>

                  {investor.board_involvement && (
                    <p className="text-white/60 text-sm">
                      <span className="text-white/40">Board involvement:</span> {investor.board_involvement}
                    </p>
                  )}
                </Card>
              </div>
            )}

            {/* Analysts Section */}
            <div className="border-t border-white/10 pt-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Team Members at {investor.firm_name}</h3>
                <p className="text-white/60 text-sm">Connect directly with an analyst sourcing in your area</p>
              </div>

              {alreadySynced ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                  <p className="text-green-400 font-medium">Sync request sent! Waiting for response.</p>
                </div>
              ) : showSyncForm && selectedAnalyst ? (
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-[hsl(var(--cyan-glow))]/30">
                    <p className="text-white/80 text-sm mb-1">
                      Syncing with <span className="text-[hsl(var(--cyan-glow))] font-semibold">{selectedAnalyst.name}</span> from {investor.firm_name}
                    </p>
                    <p className="text-white/50 text-xs">{selectedAnalyst.vertical} • {selectedAnalyst.location}</p>
                  </div>
                  <div>
                    <label className="text-white/80 text-sm font-medium mb-2 block">
                      Add a note to your sync request (optional, max 60 words)
                    </label>
                    <Textarea
                      value={syncNote}
                      onChange={(e) => setSyncNote(e.target.value)}
                      placeholder="Tell them why you'd be a great fit for their portfolio..."
                      className="bg-white/5 border-white/20 text-white min-h-[100px]"
                    />
                    <p className={`text-xs mt-1 ${isOverLimit ? 'text-red-400' : 'text-white/40'}`}>
                      {wordCount}/60 words
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowSyncForm(false);
                        setSelectedAnalyst(null);
                      }}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleSync(selectedAnalyst)}
                      disabled={isSyncing || isOverLimit}
                      className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-glow))]/90 flex-1"
                    >
                      {isSyncing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <img src={insyncInfinity} alt="Sync" className="mr-2 h-6 w-10 object-contain brightness-125 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                          Send Sync Request
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {analysts.map((analyst) => (
                    <Card 
                      key={analyst.id} 
                      className="bg-navy-card border-white/10 p-5 hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Analyst Avatar */}
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(var(--cyan-glow))]/30 to-[hsl(var(--primary))]/30 flex items-center justify-center border border-[hsl(var(--cyan-glow))]/20 flex-shrink-0">
                            <Users className="h-7 w-7 text-[hsl(var(--cyan-glow))]/80" />
                          </div>
                          
                          {/* Analyst Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-semibold text-white mb-1">{analyst.name}</h4>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/30 text-xs">
                                <MapPin className="h-3 w-3 mr-1" />
                                {analyst.location}
                              </Badge>
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                                <Target className="h-3 w-3 mr-1" />
                                {analyst.vertical}
                              </Badge>
                            </div>
                            <p className="text-white/60 text-sm italic">"{analyst.oneLiner}"</p>
                          </div>
                        </div>
                        
                        {/* Sync Button */}
                        <Button
                          onClick={() => handleAnalystClick(analyst)}
                          className="bg-[hsl(220,60%,8%)] text-[hsl(var(--cyan-glow))] hover:bg-[hsl(220,60%,12%)] border border-[hsl(var(--cyan-glow))]/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] flex-shrink-0 h-auto py-3 px-4"
                        >
                          <img 
                            src={insyncInfinity} 
                            alt="Sync" 
                            className="mr-3 h-12 w-20 object-contain brightness-125 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" 
                          />
                          <span className="text-sm whitespace-nowrap">
                            Sync with {analyst.name}
                          </span>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
