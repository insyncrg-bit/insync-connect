import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export interface StatItem {
  label: string;
  value: number;
  icon?: LucideIcon;
  image?: React.ReactNode;
  onClick: () => void;
}

interface DashboardStatsGridProps {
  stats: StatItem[];
}

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300 cursor-pointer"
          onClick={stat.onClick}
        >
          <div className="flex items-center gap-4">
            {stat.icon ? (
              <stat.icon className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
            ) : stat.image ? (
              <div className="h-12 w-20 flex items-center justify-center bg-[hsl(var(--cyan-glow))]/10 rounded">
                {stat.image}
              </div>
            ) : null}
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-base text-white/60">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
