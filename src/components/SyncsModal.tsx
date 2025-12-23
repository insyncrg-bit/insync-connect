import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Calendar, MessageSquare, Maximize2, Minimize2, Video, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import syncsLogo from "@/assets/syncs-logo.png";

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
  // Scheduling
  calendly_link?: string;
}

interface SyncsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  syncs: SyncItem[];
  loading: boolean;
  userType: "founder" | "investor";
  onViewProfile?: (userId: string, sync: SyncItem) => void;
  onMessage?: (userId: string) => void;
}

export function SyncsModal({ 
  open, 
  onOpenChange, 
  syncs, 
  loading,
  userType,
  onViewProfile,
  onMessage
}: SyncsModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleNameClick = (sync: SyncItem) => {
    if (onViewProfile) {
      onViewProfile(sync.other_user_id, sync);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`bg-[hsl(var(--navy-deep))] border-white/10 text-white p-0 overflow-hidden transition-all duration-300 ${
        isFullscreen 
          ? "max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none" 
          : "max-w-2xl max-h-[80vh]"
      }`}>
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <img src={syncsLogo} alt="Syncs" className="h-6 w-10 object-contain" />
              Active Syncs
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className={`p-6 pt-4 ${isFullscreen ? "h-[calc(100vh-100px)]" : "max-h-[60vh]"}`}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-[hsl(var(--cyan-glow))] border-t-transparent rounded-full" />
            </div>
          ) : syncs.length === 0 ? (
            <div className="text-center py-12">
              <img src={syncsLogo} alt="Syncs" className="h-16 w-24 object-contain mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-semibold mb-2">No active syncs yet</h3>
              <p className="text-white/60 text-sm">
                {userType === "founder" 
                  ? "When investors accept your requests or you accept theirs, they'll appear here."
                  : "When founders accept your requests or you accept theirs, they'll appear here."}
              </p>
            </div>
          ) : (
            <div className={`${isFullscreen ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}`}>
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
                        <h4 
                          className={`font-semibold text-white ${onViewProfile ? 'cursor-pointer hover:text-[hsl(var(--cyan-glow))] transition-colors' : ''}`}
                          onClick={() => handleNameClick(sync)}
                        >
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
                        <div className="flex gap-2">
                          {sync.calendly_link && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                              onClick={() => window.open(sync.calendly_link, '_blank')}
                            >
                              <Video className="mr-1 h-3 w-3" />
                              Schedule
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[hsl(var(--cyan-glow))]/30 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10"
                            onClick={() => onMessage?.(sync.other_user_id)}
                          >
                            <MessageSquare className="mr-1 h-3 w-3" />
                            Message
                          </Button>
                        </div>
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
