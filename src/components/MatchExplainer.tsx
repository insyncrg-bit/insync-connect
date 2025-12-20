import { CheckCircle2, AlertCircle, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MatchExplainerProps {
  whyThisMatch: string[];
  potentialConcerns: string[];
  improvementSuggestions?: string[];
  fitBreakdown?: {
    sector_fit: number;
    stage_fit: number;
    geo_fit: number;
    business_model_fit: number;
    thesis_fit: number;
    why_yes_fit: number;
    valueadd_fit: number;
  };
  compact?: boolean;
}

export function MatchExplainer({ 
  whyThisMatch, 
  potentialConcerns, 
  improvementSuggestions,
  fitBreakdown,
  compact = false 
}: MatchExplainerProps) {
  const [expanded, setExpanded] = useState(false);

  if (compact && !expanded) {
    return (
      <div className="space-y-2">
        {whyThisMatch.slice(0, 2).map((reason, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">{reason}</span>
          </div>
        ))}
        {(whyThisMatch.length > 2 || potentialConcerns.length > 0 || fitBreakdown) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-primary/70 hover:text-primary p-0 h-auto"
            onClick={() => setExpanded(true)}
          >
            <ChevronDown className="h-3 w-3 mr-1" />
            Show more
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Why this match */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          Why this match
        </h4>
        <ul className="space-y-1.5">
          {whyThisMatch.map((reason, i) => (
            <li key={i} className="text-sm text-muted-foreground pl-5">
              • {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Potential concerns */}
      {potentialConcerns.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            Potential concerns
          </h4>
          <ul className="space-y-1.5">
            {potentialConcerns.map((concern, i) => (
              <li key={i} className="text-sm text-muted-foreground pl-5">
                • {concern}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvement suggestions */}
      {improvementSuggestions && improvementSuggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4 text-blue-400" />
            Improve your matches
          </h4>
          <ul className="space-y-1.5">
            {improvementSuggestions.map((suggestion, i) => (
              <li key={i} className="text-sm text-muted-foreground pl-5">
                • {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fit breakdown */}
      {fitBreakdown && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Fit breakdown</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <FitBar label="Sector" value={fitBreakdown.sector_fit} />
            <FitBar label="Stage" value={fitBreakdown.stage_fit} />
            <FitBar label="Geography" value={fitBreakdown.geo_fit} />
            <FitBar label="Business Model" value={fitBreakdown.business_model_fit} />
            <FitBar label="Thesis" value={fitBreakdown.thesis_fit} />
            <FitBar label="Value-Add" value={fitBreakdown.valueadd_fit} />
          </div>
        </div>
      )}

      {compact && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-primary/70 hover:text-primary p-0 h-auto"
          onClick={() => setExpanded(false)}
        >
          <ChevronUp className="h-3 w-3 mr-1" />
          Show less
        </Button>
      )}
    </div>
  );
}

function FitBar({ label, value }: { label: string; value: number }) {
  const percentage = Math.round(value * 100);
  const getColor = () => {
    if (percentage >= 80) return "bg-emerald-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-muted-foreground">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor()} rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
