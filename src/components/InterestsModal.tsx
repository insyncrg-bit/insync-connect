import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Building2, Check, X, Loader2, MapPin, DollarSign, Clock, Maximize2, Minimize2 } from "lucide-react";

interface InterestItem {
  id: string;
  requester_user_id: string;
  sync_note: string | null;
  created_at: string;
  company_name?: string;
  founder_name?: string;
  vertical?: string;
  stage?: string;
  location?: string;
  funding_goal?: string;
  // For investors viewing founders
  firm_name?: string;
  // For founders viewing analysts/investors
  analyst_name?: string;
  analyst_title?: string;
  analyst_profile_picture_url?: string;
}

interface InterestsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interests: InterestItem[];
  loading: boolean;
  onAccept: (requestId: string) => Promise<void>;
  onDecline: (requestId: string) => Promise<void>;
  processingId: string | null;
  userType: 'founder' | 'investor';
  onViewProfile?: (userId: string, interest: InterestItem) => void;
}

export function InterestsModal({ 
  open, 
  onOpenChange, 
  interests, 
  loading, 
  onAccept,
  onDecline,
  processingId,
  userType,
  onViewProfile
}: InterestsModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleNameClick = (interest: InterestItem) => {
    if (onViewProfile) {
      onViewProfile(interest.requester_user_id, interest);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`bg-[hsl(var(--navy-deep))] border-[hsl(var(--cyan-glow))]/20 p-0 overflow-hidden transition-all duration-300 [&>button]:hidden ${
        isFullscreen 
          ? "max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none" 
          : "max-w-4xl max-h-[80vh]"
      }`}>
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <Building2 className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                Incoming Interests
              </DialogTitle>
              <p className="text-white/60 text-sm mt-1">
                {userType === 'investor' 
                  ? 'Startups that want to connect with you' 
                  : 'VC analysts that want to connect with you'}
              </p>
            </div>
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
        </DialogHeader>

        <ScrollArea className={`p-6 pt-4 ${isFullscreen ? "h-[calc(100vh-100px)]" : "max-h-[60vh]"}`}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--cyan-glow))]" />
            </div>
          ) : interests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-white/20" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No incoming interests yet</h3>
              <p className="text-white/60 text-sm">
                {userType === 'investor'
                  ? 'When startups are interested in connecting, they will appear here.'
                  : 'When VC analysts are interested in connecting, they will appear here.'}
              </p>
            </div>
          ) : (
            <div className={`${isFullscreen ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}`}>
              {interests.map((interest) => (
                <Card key={interest.id} className="bg-white/5 border-white/10 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar - show analyst profile picture if available */}
                      {interest.analyst_profile_picture_url ? (
                        <Avatar className="w-12 h-12 shrink-0 border border-[hsl(var(--cyan-glow))]/30">
                          <AvatarImage src={interest.analyst_profile_picture_url} alt={interest.analyst_name || "Analyst"} />
                          <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] text-white">
                            {interest.analyst_name ? interest.analyst_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'VC'}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 
                          className={`font-semibold text-white mb-1 ${onViewProfile ? 'cursor-pointer hover:text-[hsl(var(--cyan-glow))] transition-colors' : ''}`}
                          onClick={() => handleNameClick(interest)}
                        >
                          {userType === 'investor' ? interest.company_name : interest.analyst_name || 'VC Analyst'}
                        </h4>
                        <p className="text-sm text-white/60 mb-2">
                          {userType === 'investor' 
                            ? interest.founder_name 
                            : interest.firm_name 
                              ? `${interest.analyst_title ? `${interest.analyst_title} at ` : ''}${interest.firm_name}`
                              : interest.analyst_title || ''
                          }
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {interest.vertical && (
                            <Badge className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/20 text-xs">
                              {interest.vertical}
                            </Badge>
                          )}
                          {interest.stage && (
                            <Badge className="bg-white/10 text-white/80 border-white/20 text-xs">
                              {interest.stage}
                            </Badge>
                          )}
                        </div>

                        {interest.sync_note && (
                          <div className="bg-white/5 rounded-lg p-3 border border-white/10 mb-3">
                            <p className="text-white/70 text-sm italic">"{interest.sync_note}"</p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-3 text-xs text-white/50">
                          {interest.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {interest.location}
                            </span>
                          )}
                          {interest.funding_goal && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              Raising {interest.funding_goal}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(interest.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => onAccept(interest.id)}
                        disabled={processingId === interest.id}
                        className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                      >
                        {processingId === interest.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDecline(interest.id)}
                        disabled={processingId === interest.id}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
