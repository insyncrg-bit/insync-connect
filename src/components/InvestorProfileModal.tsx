import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, XCircle, DollarSign, Briefcase, Users, Handshake, Building2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

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
  const [isExpanded, setIsExpanded] = useState(false);

  const wordCount = syncNote.trim().split(/\s+/).filter(Boolean).length;
  const isOverLimit = wordCount > 60;

  const handleSync = async () => {
    if (investor && !isOverLimit) {
      await onSync(investor.user_id, syncNote);
      setSyncNote("");
      setShowSyncForm(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsExpanded(false);
      setShowSyncForm(false);
      setSyncNote("");
    }
    onOpenChange(newOpen);
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[85vh] bg-[hsl(var(--navy-deep))] border-white/10">
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] bg-[hsl(var(--navy-deep))] border-white/10 p-0 overflow-hidden">
        <ScrollArea className="max-h-[85vh]">
          <div className="p-6">
            {/* Header */}
            <DialogHeader className="mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white/70" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white">
                    {investor.firm_name}
                  </DialogTitle>
                  <p className="text-white/50 text-sm">
                    {investor.hq_location && `${investor.hq_location}`}
                    {investor.hq_location && investor.fund_type && " • "}
                    {investor.fund_type}
                  </p>
                </div>
              </div>
            </DialogHeader>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-2 mb-4">
              {investor.check_sizes.slice(0, 1).map((size, i) => (
                <Badge key={i} className="bg-white/5 border-white/10 text-white/80 text-xs">
                  <DollarSign className="h-3 w-3 mr-1" />{size}
                </Badge>
              ))}
              {investor.stage_focus.slice(0, 2).map((stage, i) => (
                <Badge key={i} className="bg-white/5 border-white/10 text-white/80 text-xs">
                  {stage}
                </Badge>
              ))}
              {investor.lead_follow && (
                <Badge className="bg-[hsl(var(--cyan-glow))]/10 border-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] text-xs">
                  {investor.lead_follow}
                </Badge>
              )}
            </div>

            {/* Condensed Thesis */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-3">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Investment Thesis</p>
              <p className="text-white/90 text-sm leading-relaxed">
                {investor.thesis_statement || investor.firm_description || "No thesis provided."}
              </p>
              
              {investor.sub_themes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {investor.sub_themes.slice(0, 3).map((theme, i) => (
                    <Badge key={i} variant="outline" className="bg-transparent border-white/20 text-white/60 text-xs">
                      {theme}
                    </Badge>
                  ))}
                  {investor.sub_themes.length > 3 && (
                    <Badge variant="outline" className="bg-transparent border-white/20 text-white/60 text-xs">
                      +{investor.sub_themes.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Expand Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center gap-1 w-full text-[hsl(var(--cyan-glow))] text-xs hover:underline mb-4 py-1"
            >
              {isExpanded ? (
                <>Show less <ChevronUp className="h-3 w-3" /></>
              ) : (
                <>View full thesis <ChevronDown className="h-3 w-3" /></>
              )}
            </button>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="space-y-3 mb-4 animate-in fade-in duration-200">
                {/* Fast Signals & Hard Nos */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-3.5 w-3.5 text-green-400" />
                      <h4 className="font-medium text-white text-sm">Fast Signals</h4>
                    </div>
                    <div className="space-y-1">
                      {investor.fast_signals.slice(0, 3).map((signal, i) => (
                        <p key={i} className="text-white/70 text-xs flex items-start gap-1.5">
                          <span className="text-green-400 mt-0.5">•</span>
                          {signal}
                        </p>
                      ))}
                      {investor.fast_signals.length === 0 && (
                        <p className="text-white/40 text-xs italic">Not specified</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-3.5 w-3.5 text-red-400" />
                      <h4 className="font-medium text-white text-sm">Hard Nos</h4>
                    </div>
                    <div className="space-y-1">
                      {investor.hard_nos.slice(0, 3).map((no, i) => (
                        <p key={i} className="text-white/70 text-xs flex items-start gap-1.5">
                          <span className="text-red-400 mt-0.5">•</span>
                          {no}
                        </p>
                      ))}
                      {investor.hard_nos.length === 0 && (
                        <p className="text-white/40 text-xs italic">Not specified</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sectors */}
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-3.5 w-3.5 text-white/60" />
                    <h4 className="font-medium text-white text-sm">Sectors</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {investor.sector_tags.map((sector, i) => (
                      <Badge key={i} variant="outline" className="bg-transparent border-white/20 text-white/60 text-xs">
                        {sector}
                      </Badge>
                    ))}
                    {investor.sector_tags.length === 0 && (
                      <span className="text-white/40 text-xs italic">Sector agnostic</span>
                    )}
                  </div>
                </div>

                {/* Value Add */}
                {investor.operating_support.length > 0 && (
                  <div className="bg-amber-500/5 rounded-lg p-3 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Handshake className="h-3.5 w-3.5 text-amber-400" />
                      <h4 className="font-medium text-white text-sm">How They Help</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {investor.operating_support.map((support, i) => (
                        <Badge key={i} className="bg-amber-500/10 border-amber-500/30 text-amber-300 text-xs">
                          {support}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sync Section */}
            <div className="pt-4 border-t border-white/10">
              {alreadySynced ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-full py-2 px-4 text-center">
                  <p className="text-green-400 text-sm">Sync request sent</p>
                </div>
              ) : showSyncForm ? (
                <div className="space-y-3">
                  <Textarea
                    value={syncNote}
                    onChange={(e) => setSyncNote(e.target.value)}
                    placeholder="Add a note (optional, max 60 words)..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 text-sm min-h-[80px]"
                  />
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${isOverLimit ? 'text-red-400' : 'text-white/40'}`}>
                      {wordCount}/60 words
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setShowSyncForm(false); setSyncNote(""); }}
                        className="text-white/60 hover:text-white hover:bg-white/5 text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSync}
                        disabled={isSyncing || isOverLimit}
                        className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-bright))] rounded-full px-5 text-xs"
                      >
                        {isSyncing ? <Loader2 className="h-3 w-3 animate-spin" /> : "Send"}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Button
                    onClick={() => setShowSyncForm(true)}
                    className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-bright))] rounded-full px-8 py-2 text-sm font-medium"
                  >
                    Sync
                  </Button>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}