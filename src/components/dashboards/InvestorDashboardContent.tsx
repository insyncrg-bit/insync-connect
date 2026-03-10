import { Eye, Heart, MessageSquare, FileText, Sparkles, MapPin, Globe, Linkedin, Rocket, Users, ArrowRight } from "lucide-react";
import {
  DashboardQuickAccessCard,
  DashboardStatsGrid,
  CuratedSection,
  StartupCard,
} from "./index";
import type { StartupCardData } from "./StartupCard";

interface InvestorDashboardContentProps {
  adminName: string;
  firmName: string;
  adminTitle: string;
  thesisSubtitle?: React.ReactNode;
  onViewAll?: () => void;
  stats: {
    interests: number;
    syncs: number;
    pending: number;
    messages: number;
  };
  startups: StartupCardData[];
  pendingRequestIds: Set<string>;
  onThesisClick: () => void;
  onInterestsClick: () => void;
  onSyncsClick: () => void;
  onPendingClick: () => void;
  onMessagesClick: () => void;
  onViewStartup: (startup: StartupCardData) => void;
  companyLogoUrl?: string | null;
  showProfileBanner?: boolean;
  onProfileBannerClick?: () => void;
  onManageTeam?: () => void;
}

export function InvestorDashboardContent({
  adminName,
  firmName,
  adminTitle,
  thesisSubtitle = "Seed • AI/ML",
  onViewAll,
  stats,
  startups,
  pendingRequestIds,
  onThesisClick,
  onInterestsClick,
  onSyncsClick,
  onPendingClick,
  onMessagesClick,
  onViewStartup,
  companyLogoUrl,
  showProfileBanner,
  onProfileBannerClick,
  onManageTeam,
}: InvestorDashboardContentProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
        {showProfileBanner && (
          <div className="bg-gradient-to-r from-[hsl(var(--cyan-glow))]/20 to-transparent border border-[hsl(var(--cyan-glow))]/30 rounded-xl p-4 flex items-center justify-between group cursor-pointer hover:bg-[hsl(var(--cyan-glow))]/30 transition-all duration-300" onClick={onProfileBannerClick}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--cyan-glow))]/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
              </div>
              <div>
                <p className="text-white font-medium">Complete your analyst profile</p>
                <p className="text-white/60 text-sm">Help founders understand your specific sourcing focus and background</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[hsl(var(--cyan-glow))] group-hover:gap-3 transition-all">
              <span className="text-sm font-semibold uppercase tracking-wider">Complete Profile</span>
              <FileText className="h-4 w-4" />
            </div>
          </div>
        )}
        
        <div>
          <h1 className="text-4xl font-bold text-white">
            Welcome {adminName} from {firmName}!
          </h1>
          <p className="text-white/60 mt-2">{adminTitle}</p>
        </div>

        <DashboardQuickAccessCard
          icon={FileText}
          title={`${firmName}'s Thesis`}
          subtitle={thesisSubtitle}
          onClick={onThesisClick}
          logoUrl={companyLogoUrl}
        />

        <div className="flex flex-col sm:flex-row items-stretch gap-6 pt-2">
          <div className="flex-1 bg-navy-card/40 border border-white/5 rounded-2xl p-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-glow/10 text-cyan-glow/60">
              <Rocket className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white/80 mb-1">Curated Dashboard Coming Soon</h3>
              <p className="text-white/50 text-sm">
                Recommendations, syncs, and messages are currently under construction.
              </p>
            </div>
          </div>

          <div 
            className="flex-1 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 group cursor-pointer hover:bg-purple-500/15 transition-all duration-300"
            onClick={onManageTeam}
          >
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white/90 mb-1">Enroll your Partners</h3>
              <p className="text-white/40 text-sm mb-2">
                In the mean time have your investment partners join your org!
              </p>
              <div className="flex items-center justify-center gap-1 text-purple-400 text-sm font-semibold group-hover:gap-2 transition-all">
                Manage Team <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* <div className="pt-10 pb-20 text-center">
            <h3 className="text-xl font-bold text-white">Curated Startups Coming Soon</h3>
        </div> */}
      </div>
  );
}
