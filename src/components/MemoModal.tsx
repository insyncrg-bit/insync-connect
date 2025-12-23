import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Building2, 
  MapPin, 
  Globe, 
  DollarSign, 
  TrendingUp,
  Users,
  Target,
  Loader2,
  Check,
  ExternalLink,
  ArrowLeft,
  FileText,
  Maximize2,
  Minimize2
} from "lucide-react";

interface FounderApplication {
  id: string;
  founder_name: string;
  company_name: string;
  vertical: string;
  stage: string;
  location: string;
  website: string | null;
  business_model: string;
  funding_goal: string;
  traction: string;
  current_ask?: string;
  user_id?: string | null;
}

interface MemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startup: FounderApplication | null;
  onRequestSync: (userId: string, companyName: string) => void;
  isRequested: boolean;
  isRequesting: boolean;
}

export function MemoModal({ 
  open, 
  onOpenChange, 
  startup, 
  onRequestSync,
  isRequested,
  isRequesting 
}: MemoModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullMemo, setShowFullMemo] = useState(false);

  if (!startup) return null;

  const handleClose = () => {
    setIsFullscreen(false);
    setShowFullMemo(false);
    onOpenChange(false);
  };

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'pre-seed':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'seed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'series a':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'series b':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`bg-[hsl(220,60%,8%)] border-[hsl(var(--cyan-glow))]/30 text-white p-0 overflow-hidden transition-all duration-300 ${
        isFullscreen 
          ? 'max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none' 
          : 'max-w-2xl max-h-[85vh]'
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
              onClick={() => setShowFullMemo(!showFullMemo)}
              className="border-[hsl(var(--cyan-glow))]/30 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10 gap-2"
            >
              <FileText className="h-4 w-4" />
              {showFullMemo ? "Condensed View" : "Full Memo"}
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

        <ScrollArea className={isFullscreen ? "h-[calc(100vh-65px)]" : "max-h-[calc(85vh-65px)]"}>
          <div className="p-6">
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold text-white mb-1">
                    {startup.company_name}
                  </DialogTitle>
                  <DialogDescription className="text-white/60 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {startup.location}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Stage & Vertical */}
              <div className="flex flex-wrap gap-2">
                <Badge className={getStageColor(startup.stage)}>
                  {startup.stage}
                </Badge>
                <Badge className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/20">
                  {startup.vertical}
                </Badge>
              </div>

              {/* Funding Goal */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 text-[hsl(var(--cyan-glow))] mb-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-semibold">Raising</span>
                </div>
                <p className="text-2xl font-bold text-white">{startup.funding_goal}</p>
              </div>

              {/* Founder */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/80">
                  <Users className="h-4 w-4 text-[hsl(var(--cyan-glow))]" />
                  <span className="font-medium">Founder</span>
                </div>
                <p className={`text-white/70 pl-6 ${!showFullMemo && 'line-clamp-2'}`}>{startup.founder_name}</p>
              </div>

              {/* Business Model */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/80">
                  <Target className="h-4 w-4 text-[hsl(var(--cyan-glow))]" />
                  <span className="font-medium">Business Model</span>
                </div>
                <p className={`text-white/70 pl-6 ${!showFullMemo && 'line-clamp-3'}`}>{startup.business_model}</p>
              </div>

              {/* Traction */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/80">
                  <TrendingUp className="h-4 w-4 text-[hsl(var(--cyan-glow))]" />
                  <span className="font-medium">Traction</span>
                </div>
                <p className={`text-white/70 pl-6 ${!showFullMemo && 'line-clamp-3'}`}>{startup.traction}</p>
              </div>

              {/* Website */}
              {startup.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[hsl(var(--cyan-glow))]" />
                  <a 
                    href={startup.website.startsWith('http') ? startup.website : `https://${startup.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[hsl(var(--cyan-glow))] hover:underline flex items-center gap-1"
                  >
                    Visit Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4 border-t border-white/10">
                {isRequested ? (
                  <div className="flex items-center justify-center gap-2 py-3 bg-green-500/10 rounded-lg border border-green-500/30">
                    <Check className="h-5 w-5 text-green-400" />
                    <span className="text-green-400 font-medium">Sync Request Sent</span>
                  </div>
                ) : (
                  <Button 
                    className="w-full bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/30 border border-[hsl(var(--cyan-glow))]/30 h-12 text-lg"
                    onClick={() => {
                      if (startup.user_id) {
                        onRequestSync(startup.user_id, startup.company_name);
                      }
                    }}
                    disabled={isRequesting || !startup.user_id}
                  >
                    {isRequesting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Requesting...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-5 w-5" />
                        Request In Sync
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
