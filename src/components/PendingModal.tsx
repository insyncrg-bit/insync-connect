import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Building2, Eye, MapPin, Calendar, Clock, X, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  // Analyst fields
  analyst_name?: string;
  analyst_title?: string;
  analyst_profile_picture_url?: string;
}

interface PendingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pending: PendingItem[];
  loading: boolean;
  onCancel?: (requestId: string) => void;
  cancellingId?: string | null;
  userType: "founder" | "investor";
  onViewProfile?: (userId: string, item: PendingItem) => void;
}

export function PendingModal({ 
  open, 
  onOpenChange, 
  pending, 
  loading,
  onCancel,
  cancellingId,
  userType,
  onViewProfile
}: PendingModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleNameClick = (item: PendingItem) => {
    if (onViewProfile) {
      onViewProfile(item.target_user_id, item);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`bg-[hsl(var(--navy-deep))] border-white/10 text-white p-0 overflow-hidden transition-all duration-300 [&>button]:hidden ${
        isFullscreen 
          ? "max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none" 
          : "max-w-2xl max-h-[80vh]"
      }`}>
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Eye className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
              Pending Requests
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-white/60 hover:text-white hover:bg-white/10 h-10 w-10"
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-white/60 hover:text-white hover:bg-white/10 h-10 w-10"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-1">
            {userType === "founder" 
              ? "Your sync requests awaiting response"
              : "Sync requests you've sent to founders"}
          </p>
        </DialogHeader>

        <ScrollArea className={`p-6 pt-4 ${isFullscreen ? "h-[calc(100vh-100px)]" : "max-h-[60vh]"}`}>
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
                  ? "Your sync requests to analysts will appear here while awaiting response."
                  : "Your sync requests to founders will appear here while awaiting response."}
              </p>
            </div>
          ) : (
            <div className={`${isFullscreen ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}`}>
              {pending.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar - show analyst profile picture if available for founders */}
                    {userType === "founder" && item.analyst_profile_picture_url ? (
                      <Avatar className="w-12 h-12 shrink-0 border border-yellow-500/30">
                        <AvatarImage src={item.analyst_profile_picture_url} alt={item.analyst_name || "Analyst"} />
                        <AvatarFallback className="bg-gradient-to-br from-yellow-500/50 to-orange-500/50 text-white">
                          {item.analyst_name ? item.analyst_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'VC'}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/50 to-orange-500/50 flex items-center justify-center shrink-0">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 
                          className={`font-semibold text-white ${onViewProfile ? 'cursor-pointer hover:text-[hsl(var(--cyan-glow))] transition-colors' : ''}`}
                          onClick={() => handleNameClick(item)}
                        >
                          {userType === "founder" ? (item.analyst_name || 'VC Analyst') : item.company_name}
                        </h4>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                          Pending
                        </Badge>
                      </div>
                      
                      {userType === "founder" ? (
                        <>
                          {/* Show firm name underneath analyst name */}
                          <p className="text-sm text-white/70 mb-1">
                            {item.analyst_title ? `${item.analyst_title} at ` : ''}{item.firm_name}
                          </p>
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
