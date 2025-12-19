import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, MapPin, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SyncItem {
  id: string;
  other_user_id: string;
  other_user_type: string;
  created_at: string;
  // Founder fields
  company_name?: string;
  founder_name?: string;
  vertical?: string;
  stage?: string;
  location?: string;
  // Investor fields
  firm_name?: string;
  hq_location?: string;
  stage_focus?: string[];
  sector_tags?: string[];
}

interface SyncsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  syncs: SyncItem[];
  loading: boolean;
  userType: "founder" | "investor";
}

export function SyncsModal({ 
  open, 
  onOpenChange, 
  syncs, 
  loading,
  userType 
}: SyncsModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[hsl(var(--navy-deep))] border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
            Active Syncs
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-[hsl(var(--cyan-glow))] border-t-transparent rounded-full" />
          </div>
        ) : syncs.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No active syncs yet</h3>
            <p className="text-white/60 text-sm">
              {userType === "founder" 
                ? "When investors accept your requests or you accept theirs, they'll appear here."
                : "When founders accept your requests or you accept theirs, they'll appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {syncs.map((sync) => (
              <div
                key={sync.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white">
                        {userType === "founder" ? sync.firm_name : sync.company_name}
                      </h4>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        Synced
                      </Badge>
                    </div>
                    
                    {userType === "founder" ? (
                      <>
                        {sync.hq_location && (
                          <p className="text-sm text-white/60 flex items-center gap-1 mb-2">
                            <MapPin className="h-3 w-3" />
                            {sync.hq_location}
                          </p>
                        )}
                        {sync.stage_focus && sync.stage_focus.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {sync.stage_focus.slice(0, 3).map((stage, i) => (
                              <Badge key={i} className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/20 text-xs">
                                {stage}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {sync.founder_name && (
                          <p className="text-sm text-white/70 mb-1">{sync.founder_name}</p>
                        )}
                        {sync.location && (
                          <p className="text-sm text-white/60 flex items-center gap-1 mb-2">
                            <MapPin className="h-3 w-3" />
                            {sync.location}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {sync.vertical && (
                            <Badge className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/20 text-xs">
                              {sync.vertical}
                            </Badge>
                          )}
                          {sync.stage && (
                            <Badge className="bg-white/10 text-white/80 border-white/20 text-xs">
                              {sync.stage}
                            </Badge>
                          )}
                        </div>
                      </>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-white/50 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Synced {formatDate(sync.created_at)}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[hsl(var(--cyan-glow))]/30 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10"
                      >
                        <MessageSquare className="mr-2 h-3 w-3" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
