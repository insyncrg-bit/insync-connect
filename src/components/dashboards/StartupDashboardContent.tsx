import { Building2, Eye, Heart, MessageSquare } from "lucide-react";
import syncsLogo from "@/landing/assets/infinity-logo-transparent.png";
import {
  DashboardLayout,
  DashboardQuickAccessCard,
  DashboardStatsGrid,
  CuratedSection,
  InvestorCard,
} from "./index";
import type { InvestorCardData } from "./InvestorCard";

interface StartupDashboardContentProps {
  loading?: boolean;
  companyName: string;
  vertical: string;
  stage: string;
  stats: {
    interests: number;
    syncs: number;
    pending: number;
    messages: number;
  };
  investors: InvestorCardData[];
  onMemoClick: () => void;
  onInterestsClick: () => void;
  onSyncsClick: () => void;
  onPendingClick: () => void;
  onMessagesClick: () => void;
  onViewInvestor: (investor: InvestorCardData) => void;
}

export function StartupDashboardContent({
  loading,
  companyName,
  vertical,
  stage,
  stats,
  investors,
  onMemoClick,
  onInterestsClick,
  onSyncsClick,
  onPendingClick,
  onMessagesClick,
  onViewInvestor,
}: StartupDashboardContentProps) {
  return (
    <DashboardLayout loading={loading}>
      <div className="container mx-auto max-w-6xl space-y-10">
        <div>
          <h1 className="text-4xl font-bold text-white">Welcome, {companyName}!</h1>
        </div>

        <DashboardQuickAccessCard
          icon={Building2}
          title={`${companyName}'s Memo`}
          subtitle={`${vertical} • ${stage}`}
          onClick={onMemoClick}
        />

        <DashboardStatsGrid
          stats={[
            { label: "Interests", value: stats.interests, icon: Heart, onClick: onInterestsClick },
            {
              label: "Syncs",
              value: stats.syncs,
              image: <img src={syncsLogo} alt="Syncs" className="h-12 w-20 object-contain" />,
              onClick: onSyncsClick,
            },
            { label: "Pending", value: stats.pending, icon: Eye, onClick: onPendingClick },
            { label: "Messages", value: stats.messages, icon: MessageSquare, onClick: onMessagesClick },
          ]}
        />

        <CuratedSection title="Curated Investors">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investors.map((investor) => (
              <InvestorCard
                key={investor.id}
                investor={investor}
                onViewProfile={() => onViewInvestor(investor)}
              />
            ))}
          </div>
        </CuratedSection>
      </div>
    </DashboardLayout>
  );
}
