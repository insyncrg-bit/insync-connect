import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Target, Zap, XCircle, DollarSign, Briefcase, Users, Handshake, Building2, MapPin, TrendingUp } from "lucide-react";

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
  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-[hsl(var(--navy-deep))] border-white/10">
          <div className="flex items-center justify-center py-12">
            <div className="text-white/60">Loading your thesis...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!application) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl bg-[hsl(var(--navy-deep))] border-white/10">
          <div className="text-center py-12">
            <p className="text-white/60">No investment profile found. Complete your investor application to see your thesis here.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-[hsl(var(--navy-deep))] border-[hsl(var(--cyan-glow))]/20 p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-8">
            {/* Header */}
            <DialogHeader className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-[hsl(var(--cyan-glow))]/20 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                    Investment Thesis
                  </DialogTitle>
                  <p className="text-white/60 text-sm">{application.firm_name}</p>
                </div>
              </div>
              {application.firm_description && (
                <p className="text-white/70 text-sm mt-4 leading-relaxed">
                  {application.firm_description}
                </p>
              )}
            </DialogHeader>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {application.hq_location && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                    <MapPin className="h-3 w-3" />
                    Location
                  </div>
                  <p className="text-white text-sm font-medium">{application.hq_location}</p>
                </div>
              )}
              {application.fund_type && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                    <Briefcase className="h-3 w-3" />
                    Fund Type
                  </div>
                  <p className="text-white text-sm font-medium">{application.fund_type}</p>
                </div>
              )}
              {application.aum && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                    <DollarSign className="h-3 w-3" />
                    AUM
                  </div>
                  <p className="text-white text-sm font-medium">{application.aum}</p>
                </div>
              )}
              {application.lead_follow && (
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                    <TrendingUp className="h-3 w-3" />
                    Role
                  </div>
                  <p className="text-white text-sm font-medium">{application.lead_follow}</p>
                </div>
              )}
            </div>

            {/* Core Thesis */}
            <div className="bg-gradient-to-br from-[hsl(var(--cyan-glow))]/10 to-transparent rounded-xl p-6 border border-[hsl(var(--cyan-glow))]/30 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                </div>
                <h3 className="text-lg font-semibold text-white">Core Thesis</h3>
              </div>
              <p className="text-white/90 leading-relaxed text-lg">
                {application.thesis_statement || "No thesis statement provided."}
              </p>
              
              {application.sub_themes.length > 0 && (
                <div className="mt-5 pt-5 border-t border-white/10">
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Focus Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {application.sub_themes.map((theme, i) => (
                      <Badge key={i} className="bg-[hsl(var(--cyan-glow))]/20 border-[hsl(var(--cyan-glow))]/40 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/30">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Investment Criteria Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
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
                  {application.fast_signals.length > 0 ? (
                    application.fast_signals.map((signal, i) => (
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
                  {application.hard_nos.length > 0 ? (
                    application.hard_nos.map((no, i) => (
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

            {/* Investment Parameters */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 mb-6">
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
                    {application.check_sizes.length > 0 ? (
                      application.check_sizes.map((size, i) => (
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
                    {application.stage_focus.length > 0 ? (
                      application.stage_focus.map((stage, i) => (
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
                  <span className="text-white/80 text-sm">{application.time_to_decision || "Not specified"}</span>
                </div>
              </div>
            </div>

            {/* Sectors & Target Customers */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-purple-500/5 rounded-xl p-5 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-white">Sectors</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {application.sector_tags.length > 0 ? (
                    application.sector_tags.map((sector, i) => (
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
                  {application.customer_types.length > 0 ? (
                    application.customer_types.map((type, i) => (
                      <Badge key={i} className="bg-blue-500/20 border-blue-500/40 text-blue-300 text-xs">
                        {type}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-white/40 text-sm italic">Not specified</span>
                  )}
                </div>
                {application.b2b_b2c && (
                  <p className="text-white/60 text-sm mt-3">
                    <span className="text-white/40">Focus:</span> {application.b2b_b2c}
                  </p>
                )}
              </div>
            </div>

            {/* Value-Add */}
            <div className="bg-amber-500/5 rounded-xl p-5 border border-amber-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Handshake className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">How We Add Value</h4>
                  {application.support_style && (
                    <p className="text-white/40 text-xs">{application.support_style} engagement</p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {application.operating_support.length > 0 ? (
                  application.operating_support.map((support, i) => (
                    <Badge key={i} className="bg-amber-500/20 border-amber-500/40 text-amber-300 text-xs">
                      {support}
                    </Badge>
                  ))
                ) : (
                  <span className="text-white/40 text-sm italic">Not specified</span>
                )}
              </div>

              {application.board_involvement && (
                <p className="text-white/60 text-sm mt-4">
                  <span className="text-white/40">Board involvement:</span> {application.board_involvement}
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
