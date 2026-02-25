import { Card } from "@/components/ui/card";
import { ArrowRight, LucideIcon } from "lucide-react";

interface DashboardQuickAccessCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: React.ReactNode;
  onClick: () => void;
  logoUrl?: string | null;
}

export function DashboardQuickAccessCard({ icon: Icon, title, subtitle, onClick, logoUrl }: DashboardQuickAccessCardProps) {
  return (
    <Card
      className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="Company Logo" className="w-full h-full object-contain p-1" />
            ) : (
              <Icon className="h-7 w-7 text-[hsl(var(--cyan-glow))]" />
            )}
          </div>
          <div>
            <p className="text-xl font-semibold text-white">{title}</p>
            <p className="text-sm text-white/60">{subtitle}</p>
          </div>
        </div>
        <ArrowRight className="h-6 w-6 text-white/60" />
      </div>
    </Card>
  );
}
