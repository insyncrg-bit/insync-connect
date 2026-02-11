import { Eye, Heart, MessageSquare, FileText } from "lucide-react";
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
  thesisSubtitle?: string;
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
}: InvestorDashboardContentProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
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

        <CuratedSection title="Curated Startups" onViewAll={onViewAll}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {startups.slice(0, 3).map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                onViewMemo={() => onViewStartup(startup)}
                isSyncRequested={startup.user_id ? pendingRequestIds.has(startup.user_id) : false}
              />
            ))}
          </div>
        </CuratedSection>
      </div>
  );
}
