import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, FileText, MapPin } from "lucide-react";
import { getStageColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface StartupCardData {
  id: string;
  user_id?: string | null;
  founder_name: string;
  company_name: string;
  vertical: string;
  stage: string;
  location: string;
  business_model: string;
  funding_goal?: string;
}

interface StartupCardProps {
  startup: StartupCardData;
  onViewMemo: () => void;
  isSyncRequested?: boolean;
}

export function StartupCard({ startup, onViewMemo, isSyncRequested }: StartupCardProps) {
  return (
    <Card className="bg-navy-card border-white/10 p-5 shadow-[0_0_15px_rgba(6,182,212,0.08)] hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
          </div>
          <div>
            <h4 className="font-medium text-white group-hover:text-[hsl(var(--cyan-glow))] transition-colors">
              {startup.company_name}
            </h4>
            <p className="text-xs text-white/60 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {startup.location}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className={cn("text-xs px-2 py-0.5 rounded-full", getStageColor(startup.stage))}>
          {startup.stage}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))]">
          {startup.vertical}
        </span>
      </div>
      <p className="text-sm text-white/60 mb-4 line-clamp-2">{startup.business_model}</p>
      <div className="pt-3 border-t border-white/10">
        {isSyncRequested ? (
          <span className="text-sm text-green-400">Sync Requested</span>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10"
            onClick={onViewMemo}
          >
            <FileText className="mr-2 h-4 w-4" />
            View Memo
          </Button>
        )}
      </div>
    </Card>
  );
}
