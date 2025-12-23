import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
  ArrowLeft,
  FileText,
  Eye,
  ChevronRight,
  Maximize2,
  Minimize2,
  ExternalLink,
  Briefcase
} from "lucide-react";
import insyncInfinity from "@/assets/insync-infinity.png";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

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
  const [viewMode, setViewMode] = useState<"condensed" | "full">("condensed");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [syncNote, setSyncNote] = useState("");
  const [showSyncForm, setShowSyncForm] = useState(false);

  const wordCount = syncNote.trim().split(/\s+/).filter(Boolean).length;
  const isOverLimit = wordCount > 60;

  const handleClose = () => {
    setViewMode("condensed");
    setIsFullscreen(false);
    setShowSyncForm(false);
    setSyncNote("");
    onOpenChange(false);
  };

  const handleSync = () => {
    if (startup?.user_id && !isOverLimit) {
      onRequestSync(startup.user_id, startup.company_name);
      setSyncNote("");
      setShowSyncForm(false);
    }
  };

  if (!startup) return null;

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
                <h2 className="text-2xl font-bold text-white">Startup Memo</h2>
                <p className="text-white/60">Company profile and investment opportunity</p>
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
                      Full Memo
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
                          <h1 className="text-3xl font-bold text-white mb-2">{startup.company_name}</h1>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getStageColor(startup.stage)}>
                              {startup.stage}
                            </Badge>
                            <Badge className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/30 text-sm">
                              {startup.vertical}
                            </Badge>
                            <Badge className="bg-[hsl(var(--cyan-bright))]/20 text-[hsl(var(--cyan-bright))] border-[hsl(var(--cyan-bright))]/30 text-sm">
                              📍 {startup.location}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Business Model Summary */}
                    <div className="bg-white/5 rounded-xl p-4 mb-6">
                      <p className="text-lg text-white/90 italic">
                        "{startup.business_model.slice(0, 200)}{startup.business_model.length > 200 ? '...' : ''}"
                      </p>
                    </div>

                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                        <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Raising</p>
                        <p className="text-xl font-bold text-white">{startup.funding_goal}</p>
                        <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                          View details <ChevronRight className="h-3 w-3" />
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                        <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Stage</p>
                        <p className="text-xl font-bold text-white">{startup.stage}</p>
                        <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                          View details <ChevronRight className="h-3 w-3" />
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                        <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Vertical</p>
                        <p className="text-xl font-bold text-white">{startup.vertical}</p>
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
                        <p className="text-white/40 text-xs font-medium">Raising</p>
                        <p className="text-white font-semibold">{startup.funding_goal}</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-purple-400/70" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs font-medium">Vertical</p>
                        <p className="text-white font-semibold">{startup.vertical}</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-emerald-400/70" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs font-medium">Stage</p>
                        <p className="text-white font-semibold">{startup.stage}</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-amber-400/70" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs font-medium">Location</p>
                        <p className="text-white font-semibold">{startup.location}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Founder & Traction */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-[hsl(var(--cyan-glow))]/70" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Founder</h3>
                    </div>
                    <p className="text-white/70 leading-relaxed">
                      {startup.founder_name}
                    </p>
                  </Card>

                  <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-emerald-400/70" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">Traction</h3>
                    </div>
                    <p className="text-white/70 leading-relaxed">
                      {startup.traction.slice(0, 150)}{startup.traction.length > 150 ? "..." : ""}
                    </p>
                  </Card>
                </div>
              </div>
            )}

            {/* Full Memo View */}
            {viewMode === "full" && (
              <div className="space-y-8">
                {/* Header Section */}
                <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-8 shadow-[0_0_15px_rgba(6,182,212,0.08)]">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shadow-lg shadow-[hsl(var(--cyan-glow))]/20 mb-4">
                      <Building2 className="h-12 w-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">{startup.company_name}</h1>
                    <p className="text-xl text-white/70 mb-4">{startup.stage} • {startup.vertical}</p>
                    <div className="flex justify-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {startup.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> Raising {startup.funding_goal}</span>
                    </div>
                  </div>

                  <div className="max-w-3xl mx-auto">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-sm font-semibold text-[hsl(var(--cyan-glow))] uppercase tracking-wider mb-3">Business Model</h3>
                      <p className="text-lg text-white/90 leading-relaxed">
                        {startup.business_model}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Founder Section */}
                <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-[hsl(var(--cyan-glow))]/70" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Founder</h2>
                  </div>
                  <p className="text-white/70 leading-relaxed text-lg">
                    {startup.founder_name}
                  </p>
                </Card>

                {/* Traction Section */}
                <Card className="bg-navy-card border-emerald-500/20 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-emerald-400/70" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Traction & Progress</h2>
                      <p className="text-white/40 text-sm">Key metrics and milestones</p>
                    </div>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    {startup.traction}
                  </p>
                </Card>

                {/* Investment Details */}
                <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-[hsl(var(--cyan-glow))]/70" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Investment Opportunity</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Raising</p>
                      <Badge className="bg-[hsl(var(--cyan-glow))]/20 border-[hsl(var(--cyan-glow))]/40 text-[hsl(var(--cyan-glow))] px-3 py-1.5">
                        {startup.funding_goal}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Stage</p>
                      <Badge className={`${getStageColor(startup.stage)} px-3 py-1.5`}>
                        {startup.stage}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Vertical</p>
                      <Badge className="bg-purple-500/20 border-purple-500/40 text-purple-300 px-3 py-1.5">
                        {startup.vertical}
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Company Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-amber-400/70" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Location</h2>
                    </div>
                    <p className="text-white/80">{startup.location}</p>
                  </Card>

                  {startup.website && (
                    <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-blue-400/70" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Website</h2>
                      </div>
                      <a 
                        href={startup.website.startsWith('http') ? startup.website : `https://${startup.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[hsl(var(--cyan-glow))] hover:underline flex items-center gap-2"
                      >
                        {startup.website}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Sync Section */}
            <div className="border-t border-white/10 pt-6">
              {isRequested ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                  <p className="text-green-400 font-medium">Sync request sent! Waiting for response.</p>
                </div>
              ) : showSyncForm ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-white/80 text-sm font-medium mb-2 block">
                      Add a note to your sync request (optional, max 60 words)
                    </label>
                    <Textarea
                      value={syncNote}
                      onChange={(e) => setSyncNote(e.target.value)}
                      placeholder="Tell them why you're interested in their company..."
                      className="bg-white/5 border-white/20 text-white min-h-[100px]"
                    />
                    <p className={`text-xs mt-1 ${isOverLimit ? 'text-red-400' : 'text-white/40'}`}>
                      {wordCount}/60 words
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setShowSyncForm(false)}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSync}
                      disabled={isRequesting || isOverLimit || !startup.user_id}
                      className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-glow))]/90 flex-1"
                    >
                      {isRequesting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Sync Request"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setShowSyncForm(true)}
                  className="w-full bg-[hsl(220,60%,8%)] text-[hsl(var(--cyan-glow))] hover:bg-[hsl(220,60%,12%)] border border-[hsl(var(--cyan-glow))]/40 h-14 text-lg shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                >
                  <img src={insyncInfinity} alt="Sync" className="mr-3 h-10 w-16 object-contain brightness-125 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  Request to Sync
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
