import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, Eye, MapPin, Calendar, Clock, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PendingItem {
  id: string;
  target_user_id: string;
  sync_note: string | null;
  created_at: string;
  // Founder fields (when investor is viewing)
  company_name?: string;
  founder_name?: string;
  vertical?: string;
  stage?: string;
  location?: string;
  // Investor fields (when founder is viewing)
  firm_name?: string;
  hq_location?: string;
  stage_focus?: string[];
  sector_tags?: string[];
}

interface PendingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pending: PendingItem[];
  loading: boolean;
  onCancel?: (requestId: string) => void;
  cancellingId?: string | null;
  userType: "founder" | "investor";
}

export function PendingModal({ 
  open, 
  onOpenChange, 
  pending, 
  loading,
  onCancel,
  cancellingId,
  userType 
}: PendingModalProps) {
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
            <Eye className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
            Pending Requests
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-[hsl(var(--cyan-glow))] border-t-transparent rounded-full" />
          </div>
        ) : pending.length === 0 ? (
          <div className="text-center py-12">
            <Eye className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
            <p className="text-white/60 text-sm">
              {userType === "founder" 
                ? "Your sync requests to investors will appear here while awaiting response."
                : "Your sync requests to founders will appear here while awaiting response."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/50 to-orange-500/50 flex items-center justify-center shrink-0">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white">
                        {userType === "founder" ? item.firm_name : item.company_name}
                      </h4>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                        Pending
                      </Badge>
                    </div>
                    
                    {userType === "founder" ? (
                      <>
                        {item.hq_location && (
                          <p className="text-sm text-white/60 flex items-center gap-1 mb-2">
                            <MapPin className="h-3 w-3" />
                            {item.hq_location}
                          </p>
                        )}
                        {item.stage_focus && item.stage_focus.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.stage_focus.slice(0, 3).map((stage, i) => (
                              <Badge key={i} className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/20 text-xs">
                                {stage}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {item.founder_name && (
                          <p className="text-sm text-white/70 mb-1">{item.founder_name}</p>
                        )}
                        {item.location && (
                          <p className="text-sm text-white/60 flex items-center gap-1 mb-2">
                            <MapPin className="h-3 w-3" />
                            {item.location}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {item.vertical && (
                            <Badge className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/20 text-xs">
                              {item.vertical}
                            </Badge>
                          )}
                          {item.stage && (
                            <Badge className="bg-white/10 text-white/80 border-white/20 text-xs">
                              {item.stage}
                            </Badge>
                          )}
                        </div>
                      </>
                    )}

                    {item.sync_note && (
                      <div className="bg-white/5 rounded-md p-2 mb-2">
                        <p className="text-sm text-white/70 italic">"{item.sync_note}"</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-white/50 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Sent {formatDate(item.created_at)}
                      </p>
                      {onCancel && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          onClick={() => onCancel(item.id)}
                          disabled={cancellingId === item.id}
                        >
                          {cancellingId === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <X className="mr-1 h-3 w-3" />
                              Cancel
                            </>
                          )}
                        </Button>
                      )}
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
