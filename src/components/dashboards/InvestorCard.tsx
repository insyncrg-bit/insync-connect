import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Eye, MapPin } from "lucide-react";
import { getStageColor } from "@/lib/utils";

export interface InvestorCardData {
  id: string;
  user_id: string;
  firm_name: string;
  hq_location: string;
  stage_focus: string[];
  sector_tags: string[];
  check_sizes: string[];
  thesis_statement?: string;
  firm_description?: string;
}

interface InvestorCardProps {
  investor: InvestorCardData;
  onViewProfile: () => void;
}

export function InvestorCard({ investor, onViewProfile }: InvestorCardProps) {
  return (
    <Card className="bg-navy-card border-white/10 p-5 hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
          </div>
          <div>
            <h4 className="font-medium text-white group-hover:text-[hsl(var(--cyan-glow))] transition-colors">
              {investor.firm_name}
            </h4>
            <p className="text-xs text-white/60 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {investor.hq_location}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {investor.stage_focus.slice(0, 1).map((stage, i) => (
          <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${getStageColor(stage)}`}>
            {stage}
          </span>
        ))}
        {investor.sector_tags.slice(0, 1).map((sector, i) => (
          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))]">
            {sector}
          </span>
        ))}
        {investor.check_sizes.length > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
            {investor.check_sizes[0]}
          </span>
        )}
      </div>
      <p className="text-sm text-white/60 mb-4 line-clamp-2">
        {investor.thesis_statement || investor.firm_description || "Investment thesis available"}
      </p>
      <div className="pt-3 border-t border-white/10">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10"
          onClick={onViewProfile}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Profile
        </Button>
      </div>
    </Card>
  );
}
