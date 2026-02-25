import { Eye, Heart, MessageSquare, FileText, Sparkles, MapPin, Globe, Linkedin } from "lucide-react";
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

        <DashboardStatsGrid
          stats={[
            { label: "Interests", value: stats.interests, icon: Heart, onClick: onInterestsClick },
            {
              label: "Syncs",
              value: stats.syncs,
              image: <span className="text-[hsl(var(--cyan-glow))] font-bold text-lg">∞</span>,
              onClick: onSyncsClick,
            },
            { label: "Pending", value: stats.pending, icon: Eye, onClick: onPendingClick },
            { label: "Messages", value: stats.messages, icon: MessageSquare, onClick: onMessagesClick },
          ]}
        />

        <div className="pt-10 pb-20 text-center">
            <h3 className="text-xl font-bold text-white">Curated Startups Coming Soon</h3>
        </div>
      </div>
  );
}
