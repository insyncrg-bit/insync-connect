import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MatchScoreBadgeProps {
  score: number;
  label: string;
  showScore?: boolean;
  className?: string;
}

export function MatchScoreBadge({ score, label, showScore = true, className }: MatchScoreBadgeProps) {
  const getScoreColor = () => {
    if (score >= 85) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (score >= 70) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (score >= 55) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium px-2 py-0.5",
        getScoreColor(),
        className
      )}
    >
      {showScore && <span className="mr-1">{score}</span>}
      {label}
    </Badge>
  );
}
