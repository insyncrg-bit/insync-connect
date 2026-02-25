import { useState, useEffect, lazy, Suspense } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Calendar,
  Search,
  Filter,
  Loader2,
  Sparkles,
  MapPin,
  Globe,
  Linkedin,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { VCOrganisation, VCSettings } from "@/components/vc";
import { InvestorDashboardContent, StartupCard } from "@/components/dashboards";
import type { StartupCardData } from "@/components/dashboards";
import { InvestorThesisModal } from "@/components/InvestorThesisModal";
import { InterestsModal } from "@/components/InterestsModal";
import { SyncsModal } from "@/components/SyncsModal";
import { PendingModal } from "@/components/PendingModal";
import { MessagesModal } from "@/components/MessagesModal";
import { MemoModal } from "@/components/MemoModal";
import { sessionManager } from "@/lib/session";
import { VCProfileSettings } from "./VCProfileSettings";
import type { InvestorApplication } from "@/components/InvestorThesisModal";
import type { VCOnboardingData } from "./vc-onboarding/hooks/vcMemoTypes";

const VCMemoEditView = lazy(() => import("./VCMemoEditView").then((m) => ({ default: m.VCMemoEditView })));


interface MemoApiResponse {
  id: string;
  firmName: string;
  firmDescription: string | null;
  thesisStatement: string | null;
  subThemes: string[];
  fastSignals: string[];
  hardNos: string[];
  checkSizes: string[];
  stageFocus: string[];
  sectorTags: string[];
  leadFollow: string | null;
  operatingSupport: string[];
  firmInvolvement: string | null;
  hqLocation: string | null;
  aum: string | null;
  fundType: string | null;
  geographicFocus: string | null;
  geographicFocusDetail: string | null;
  boardInvolvement: string | null;
  decisionProcess: string | null;
  timeToDecision: string | null;
  companyLogo: string | null;
  website: string | null;
  companyLinkedIn: string | null;
  ownershipTarget: string | null;
  topInvestments: { name: string; website: string }[] | null;
  subThemesOther: string | null;
  nonNegotiables: string | null;
  businessModels: string[] | null;
  keyMetrics: string[] | null;
  operatingSupportOther: string | null;
  timeToFirstResponse: string | null;
  givesNoWithFeedback: boolean | null;
  feedbackWhen: string | null;
  followOnReserves: string | null;
  followOnWhen: string | null;
  [key: string]: unknown; // allow extra fields for prefill
}

interface DashboardData {
  firm?: { name: string };
  memo?: MemoApiResponse;
}

interface FounderApplication {
  id: string;
  founder_name: string;
  company_name: string;
  vertical: string;
  stage: string;
  location: string;
  website: string | null;
  business_model: string;
  funding_goal: string;
  traction: string;
  created_at: string;
  user_id?: string | null;
}

interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  location: string;
  event_date: string;
  max_attendees: number;
}

interface ConnectionStats {
  interests: number;
  syncs: number;
  pending: number;
}

export const VCDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [applications, setApplications] = useState<FounderApplication[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const [connectionStats, setConnectionStats] = useState<ConnectionStats>({ interests: 0, syncs: 0, pending: 0 });
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());

  const [adminName, setAdminName] = useState<string>("VC Admin");
  const [firmName, setFirmName] = useState<string>("Your VC Firm");
  const [adminTitle, setAdminTitle] = useState<string>("Admin");
  const [adminProfile, setAdminProfile] = useState<{
    id: string;
    user_id: string;
    firm_id: string | null;
    name: string;
    title: string;
    firm_name: string;
    email: string;
    location: string | null;
    vertical: string | null;
    one_liner: string | null;
    profile_completed: boolean;
    role?: string;
    funFact?: string;
    investingSectors?: string[];
  } | null>(null);
  const [investorApplication, setInvestorApplication] = useState<InvestorApplication | null>(null);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [rawMemoData, setRawMemoData] = useState<Partial<VCOnboardingData> | null>(null);
  const [rawFirmId, setRawFirmId] = useState<string | null>(null);

  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const [syncsModalOpen, setSyncsModalOpen] = useState(false);
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [thesisModalOpen, setThesisModalOpen] = useState(false);
  const [memoModalOpen, setMemoModalOpen] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState<FounderApplication | null>(null);

  const [incomingInterests, setIncomingInterests] = useState<{
    id: string;
    requester_user_id: string;
    sync_note: string | null;
    created_at: string;
    company_name?: string;
    founder_name?: string;
    vertical?: string;
    stage?: string;
    location?: string;
    funding_goal?: string;
  }[]>([]);
  const [interestsLoading, setInterestsLoading] = useState(false);
  const [processingInterestId, setProcessingInterestId] = useState<string | null>(null);
  const [activeSyncs, setActiveSyncs] = useState<{
    id: string;
    other_user_id: string;
    other_user_type: string;
    created_at: string;
    company_name?: string;
    founder_name?: string;
    vertical?: string;
    stage?: string;
    location?: string;
    calendly_link?: string;
  }[]>([]);
  const [syncsLoading, setSyncsLoading] = useState(false);
  const [outgoingPending, setOutgoingPending] = useState<{
    id: string;
    target_user_id: string;
    sync_note: string | null;
    created_at: string;
    company_name?: string;
    founder_name?: string;
    vertical?: string;
    stage?: string;
    location?: string;
  }[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [messageThreads, setMessageThreads] = useState<{
    id: string;
    other_user_id: string;
    other_user_name: string;
    other_user_company: string;
    last_message: string;
    last_message_time: string;
    unread_count: number;
    messages: Array<{ id: string; sender: "self" | "other"; content: string; timestamp: string }>;
  }[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [initialContactUserId, setInitialContactUserId] = useState<string | null>(null);
  const [requestingSync, setRequestingSync] = useState<string | null>(null);
  const [thesisLoading, setThesisLoading] = useState(false);

  const currentTab = searchParams.get("tab") || "dashboard";

  const { data: dashboardQueryData, isPending: loading } = useQuery({
    queryKey: ["vc-dashboard"],
    queryFn: async (): Promise<{ adminName: string; firmId: string | null; dashboard: DashboardData; userData?: any }> => {
      const { getAuth } = await import("firebase/auth");
      const user = getAuth().currentUser;
      if (!user) {
        return { adminName: "VC User", firmId: null, dashboard: {}, userData: null };
      }
      let firmId = sessionManager.get()?.firmId;
      const token = await user.getIdToken();
      const apiUrl = import.meta.env.VITE_FIREBASE_API as string;

      let adminName = user.displayName ? user.displayName.split(" ")[0] : "VC User";
      let fullUserData = null;
      try {
        const userRes = await fetch(`${apiUrl}/api/users/vc-users/${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          fullUserData = userData.user;
          if (userData.user?.fullName) adminName = userData.user.fullName.split(" ")[0];
          if (userData.user?.firmId) {
            firmId = userData.user.firmId;
            sessionManager.save({ ...sessionManager.get(), firmId });
          }
        }
      } catch {
        // keep adminName fallback
      }

      if (!firmId) {
        return { adminName, firmId: null, dashboard: {}, userData: fullUserData };
      }

      const cacheKey = `dashboardData_${firmId}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          const dashboard = JSON.parse(cached) as DashboardData;
          return { adminName, firmId, dashboard, userData: fullUserData };
        } catch {
          // ignore bad cache
        }
      }

      const [firmRes, memoRes] = await Promise.all([
        fetch(`${apiUrl}/api/firms/${firmId}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiUrl}/api/firms/${firmId}/memo`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const dashboard: DashboardData = {};
      if (firmRes.ok) {
        const firmData = await firmRes.json();
        dashboard.firm = firmData.firm;
      }
      if (memoRes.ok) {
        const memoData = await memoRes.json();
        dashboard.memo = memoData.memo;
      }
      sessionStorage.setItem(cacheKey, JSON.stringify(dashboard));
      return { adminName, firmId, dashboard, userData: fullUserData };
    },
  });

  const applyDashboardData = (data: DashboardData) => {
    if (data.memo) {
      const memo = data.memo;
      setInvestorApplication({
        id: memo.id,
        firm_name: memo.firmName,
        firm_description: memo.firmDescription,
        thesis_statement: memo.thesisStatement,
        sub_themes: memo.subThemes || [],
        fast_signals: memo.fastSignals || [],
        hard_nos: memo.hardNos || [],
        check_sizes: memo.checkSizes || [],
        stage_focus: memo.stageFocus || [],
        sector_tags: memo.sectorTags || [],
        customer_types: [],
        lead_follow: memo.leadFollow,
        operating_support: memo.operatingSupport || [],
        support_style: memo.firmInvolvement,
        hq_location: memo.hqLocation,
        aum: memo.aum,
        fund_type: memo.fundType,
        geographic_focus: memo.geographicFocus === "boston" ? "Boston" : (memo.geographicFocusDetail || memo.geographicFocus),
        b2b_b2c: null,
        revenue_models: [],
        minimum_traction: [],
        board_involvement: memo.boardInvolvement,
        decision_process: memo.decisionProcess,
        time_to_decision: memo.timeToDecision,
        website: memo.website,
        company_linkedin: memo.companyLinkedIn,
        ownership_target: memo.ownershipTarget,
        company_logo: memo.companyLogo,
        top_investments: memo.topInvestments || [],
        sub_themes_other: memo.subThemesOther,
        non_negotiables: memo.nonNegotiables,
        business_models: memo.businessModels || [],
        key_metrics: memo.keyMetrics || [],
        operating_support_other: memo.operatingSupportOther,
        time_to_first_response: memo.timeToFirstResponse,
        gives_no_with_feedback: memo.givesNoWithFeedback,
        feedback_when: memo.feedbackWhen,
        follow_on_reserves: memo.followOnReserves,
        follow_on_when: memo.followOnWhen,
      });
      // Always prefer memo.firmName — it's what the user edits directly
      if (memo.firmName) setFirmName(memo.firmName);
      else if (data.firm) setFirmName(data.firm.name);
      // Set company logo if available
      if (memo.companyLogo) setCompanyLogo(memo.companyLogo);
      // Store raw memo for VCMemoEditView prefill (cast geographicFocus to the correct union)
      setRawMemoData({
        ...memo,
        geographicFocus: (memo.geographicFocus === "boston" || memo.geographicFocus === "other")
          ? memo.geographicFocus
          : "",
      } as Partial<VCOnboardingData>);
    } else if (data.firm) {
      // No memo yet — fall back to firm name from the firms collection
      setFirmName(data.firm.name);
    }
    // Store firmId for VCMemoEditView
    const firmId = sessionManager.get()?.firmId;
    if (firmId) setRawFirmId(firmId);
  };

  useEffect(() => {
    if (!dashboardQueryData) return;
    setAdminName(dashboardQueryData.adminName);
    if (dashboardQueryData.firmId) setRawFirmId(dashboardQueryData.firmId);
    
    if (dashboardQueryData.userData) {
      const u = dashboardQueryData.userData;
      setAdminProfile({
        id: u.uid,
        user_id: u.uid,
        firm_id: u.firmId,
        name: u.fullName || "VC User",
        title: u.title || "VC",
        firm_name: firmName,
        email: u.email || "",
        location: u.location || null,
        vertical: u.vertical || null,
        one_liner: u.one_liner || null,
        profile_completed: u.onboardingComplete || false,
        role: u.role,
        funFact: u.funFact || "",
        investingSectors: u.investingSectors || [],
      });
      setAdminTitle(u.title || "VC");
    }

    applyDashboardData(dashboardQueryData.dashboard);
    if (!dashboardQueryData.firmId) {
      setApplications([]);
      setConnectionStats({ interests: 0, syncs: 0, pending: 0 });
      setIncomingInterests([]);
      setActiveSyncs([]);
      setOutgoingPending([]);
      setMessageThreads([]);
    }
  }, [dashboardQueryData]);

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab }, { replace: true });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const toStartupCardData = (app: FounderApplication): StartupCardData => ({
    id: app.id,
    user_id: app.user_id,
    founder_name: app.founder_name,
    company_name: app.company_name,
    vertical: app.vertical,
    stage: app.stage,
    location: app.location,
    business_model: app.business_model,
    funding_goal: app.funding_goal,
  });

  const filteredApplications = applications.filter(
    (app) =>
      app.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.vertical.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.founder_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAcceptInterest = async (requestId: string) => {
    setProcessingInterestId(requestId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({ title: "Connection accepted!", description: "You are now synced with this founder." });
      setIncomingInterests((prev) => prev.filter((i) => i.id !== requestId));
      setConnectionStats((prev) => ({ ...prev, interests: prev.interests - 1, syncs: prev.syncs + 1 }));
    } catch {
      toast({ title: "Error", description: "Failed to accept", variant: "destructive" });
    } finally {
      setProcessingInterestId(null);
    }
  };

  const handleDeclineInterest = async (requestId: string) => {
    setProcessingInterestId(requestId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({ title: "Connection declined" });
      setIncomingInterests((prev) => prev.filter((i) => i.id !== requestId));
      setConnectionStats((prev) => ({ ...prev, interests: prev.interests - 1 }));
    } catch {
      toast({ title: "Error", description: "Failed to decline", variant: "destructive" });
    } finally {
      setProcessingInterestId(null);
    }
  };

  const handleCancelPending = async (requestId: string) => {
    setCancellingId(requestId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({ title: "Request cancelled" });
      setOutgoingPending((prev) => prev.filter((p) => p.id !== requestId));
      setConnectionStats((prev) => ({ ...prev, pending: prev.pending - 1 }));
    } catch {
      toast({ title: "Error", description: "Failed to cancel request", variant: "destructive" });
    } finally {
      setCancellingId(null);
    }
  };

  const handleSendMessage = async (_receiverUserId: string, _content: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    toast({ title: "Message sent", description: "Your message has been sent." });
    return true;
  };

  const handleMarkAsRead = (otherUserId: string) => {
    setMessageThreads((prev) =>
      prev.map((thread) =>
        thread.other_user_id === otherUserId ? { ...thread, unread_count: 0 } : thread
      )
    );
  };

  const handleRequestSync = async (founderUserId: string, companyName: string) => {
    setRequestingSync(founderUserId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({ title: "Sync requested!", description: `Your request to connect with ${companyName} has been sent.` });
      setPendingRequests((prev) => new Set([...prev, founderUserId]));
      setConnectionStats((prev) => ({ ...prev, pending: prev.pending + 1 }));
    } catch {
      toast({ title: "Error", description: "Failed to send sync request", variant: "destructive" });
    } finally {
      setRequestingSync(null);
    }
  };

  const displayStats = {
    interests: connectionStats.interests,
    syncs: connectionStats.syncs,
    pending: connectionStats.pending,
    messages: 0,
  };

  const curatedStartups = applications;

  const toFounderData = (item: {
    id: string;
    founder_name?: string;
    company_name?: string;
    vertical?: string;
    stage?: string;
    location?: string;
    funding_goal?: string;
    created_at: string;
  }, userId?: string): FounderApplication => ({
    id: item.id,
    founder_name: item.founder_name ?? "Unknown Founder",
    company_name: item.company_name ?? "Unknown Company",
    vertical: item.vertical ?? "",
    stage: item.stage ?? "",
    location: item.location ?? "",
    website: null,
    business_model: "",
    funding_goal: item.funding_goal ?? "",
    traction: "",
    created_at: item.created_at,
    user_id: userId,
  });

  const VCCuratedStartupCard = ({ app }: { app: FounderApplication }) => (
    <StartupCard
      startup={toStartupCardData(app)}
      onViewMemo={() => {
        setSelectedStartup(app);
        setMemoModalOpen(true);
      }}
      isSyncRequested={app.user_id ? pendingRequests.has(app.user_id) : false}
    />
  );

  const renderContent = () => {
    // Robustly determine if profile is incomplete to avoid flickering
    const userData = dashboardQueryData?.userData;
    const isProfileIncomplete = userData && (!userData.funFact || !userData.investingSectors || userData.investingSectors.length === 0);
    const showProfileBanner = !!isProfileIncomplete;

    switch (currentTab) {
      case "dashboard":
        return (
          <InvestorDashboardContent
            adminName={adminName}
            firmName={firmName}
            adminTitle={adminTitle}
            thesisSubtitle={
              <div className="flex flex-wrap items-center gap-4 mt-1" onClick={(e) => e.stopPropagation()}>
                {investorApplication?.hq_location && (
                  <span className="flex items-center gap-1 text-white/60">
                    <MapPin className="h-4 w-4 text-[hsl(var(--cyan-glow))]" />
                    {investorApplication.hq_location}
                  </span>
                )}
                {investorApplication?.website && (
                  <a
                    href={investorApplication.website.startsWith('http') ? investorApplication.website : `https://${investorApplication.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-white/40 hover:text-[hsl(var(--cyan-glow))] transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
                {investorApplication?.company_linkedin && (
                  <a
                    href={investorApplication.company_linkedin.startsWith('http') ? investorApplication.company_linkedin : `https://${investorApplication.company_linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-white/40 hover:text-[hsl(var(--cyan-glow))] transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                {!investorApplication?.hq_location && !investorApplication?.website && !investorApplication?.company_linkedin && (
                  <span className="text-white/40">Complete your firm profile to add details</span>
                )}
              </div>
            }
            onViewAll={() => handleTabChange("startups")}
            stats={displayStats}
            startups={curatedStartups.map(toStartupCardData)}
            pendingRequestIds={pendingRequests}
            onThesisClick={() => setThesisModalOpen(true)}
            onInterestsClick={() => setInterestsModalOpen(true)}
            onSyncsClick={() => setSyncsModalOpen(true)}
            onPendingClick={() => setPendingModalOpen(true)}
            onMessagesClick={() => setMessagesModalOpen(true)}
            onViewStartup={(s) => {
              const app = curatedStartups.find((a) => a.id === s.id);
              if (app) {
                setSelectedStartup(app);
                setMemoModalOpen(true);
              }
            }}
            companyLogoUrl={companyLogo}
            showProfileBanner={showProfileBanner}
            onProfileBannerClick={() => handleTabChange("profile")}
          />
        );

      case "startups":
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                  Curated Startups
                </h2>
                <p className="text-white/60">AI-matched startups based on {firmName}&apos;s thesis</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder="Search startups..."
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {filteredApplications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApplications.map((app) => (
                  <VCCuratedStartupCard key={app.id} app={app} />
                ))}
              </div>
            ) : (
              <Card className="bg-navy-card border-white/10 p-12 text-center">
                <Search className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No startups found</h3>
                <p className="text-white/60">Try adjusting your search criteria</p>
              </Card>
            )}
          </div>
        );

      case "events":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Upcoming Events</h2>
              <p className="text-white/60">Networking and pitch events</p>
            </div>
            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card
                    key={event.id}
                    className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.08)] hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                      </div>
                      <Badge className="bg-white/10 text-white/80 border-white/20">{event.event_type}</Badge>
                    </div>
                    <h4 className="font-semibold text-white mb-2">{event.title}</h4>
                    <p className="text-sm text-white/60 mb-4 line-clamp-2">{event.description}</p>
                    <div className="space-y-2 text-sm text-white/50 mb-4">
                      <p>📍 {event.location}</p>
                      <p>📅 {formatDate(event.event_date)}</p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/20 border border-[hsl(var(--cyan-glow))]/30"
                    >
                      Register
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-navy-card border-white/10 p-12 text-center">
                <Calendar className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No upcoming events</h3>
                <p className="text-white/60">Check back soon for new events</p>
              </Card>
            )}
          </div>
        );

      case "organisation":
        return (
          <VCOrganisation 
            firmId={dashboardQueryData?.firmId || ""} 
            isAdmin={adminProfile?.role === "admin"}
            firmName={firmName || dashboardQueryData?.dashboard?.memo?.firmName || ""}
            companyLogo={companyLogo || dashboardQueryData?.dashboard?.memo?.companyLogo}
          />
        );

      case "edit-memo":
        return (
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--cyan-glow))]" />
              </div>
            }
          >
            <div className="bg-navy-card/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
              <VCMemoEditView
                initialData={rawMemoData}
                firmId={rawFirmId}
                onSaved={() => {
                  if (rawFirmId) {
                    sessionStorage.removeItem(`dashboardData_${rawFirmId}`);
                  }
                  queryClient.invalidateQueries({ queryKey: ["vc-dashboard"] });
                  handleTabChange("");
                }}
              />
            </div>
          </Suspense>
        );

      case "profile":
        return (
          <VCProfileSettings 
            userData={dashboardQueryData?.userData} 
            onUpdate={() => queryClient.invalidateQueries({ queryKey: ["vc-dashboard"] })}
          />
        );

      case "settings":
         return <VCSettings />;

      default:
        // Dashboard Default
        return (
          <InvestorDashboardContent
            adminName={adminName}
            firmName={firmName}
            adminTitle={adminTitle}
            thesisSubtitle={
              <div className="flex flex-wrap items-center gap-4 mt-1" onClick={(e) => e.stopPropagation()}>
                {investorApplication?.hq_location && (
                  <span className="flex items-center gap-1 text-white/60">
                    <MapPin className="h-4 w-4 text-[hsl(var(--cyan-glow))]" />
                    {investorApplication.hq_location}
                  </span>
                )}
                {investorApplication?.website && (
                  <a
                    href={investorApplication.website.startsWith('http') ? investorApplication.website : `https://${investorApplication.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-white/40 hover:text-[hsl(var(--cyan-glow))] transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
                {investorApplication?.company_linkedin && (
                  <a
                    href={investorApplication.company_linkedin.startsWith('http') ? investorApplication.company_linkedin : `https://${investorApplication.company_linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-white/40 hover:text-[hsl(var(--cyan-glow))] transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                {!investorApplication?.hq_location && !investorApplication?.website && !investorApplication?.company_linkedin && (
                  <span className="text-white/40">Complete your firm profile to add details</span>
                )}
              </div>
            }
            onViewAll={() => handleTabChange("startups")}
            stats={displayStats}
            startups={curatedStartups.map(toStartupCardData)}
            pendingRequestIds={pendingRequests}
            onThesisClick={() => setThesisModalOpen(true)}
            onInterestsClick={() => setInterestsModalOpen(true)}
            onSyncsClick={() => setSyncsModalOpen(true)}
            onPendingClick={() => setPendingModalOpen(true)}
            onMessagesClick={() => setMessagesModalOpen(true)}
            onViewStartup={(s) => {
              const app = curatedStartups.find((a) => a.id === s.id);
              if (app) {
                setSelectedStartup(app);
                setMemoModalOpen(true);
              }
            }}
            companyLogoUrl={companyLogo}
            showProfileBanner={showProfileBanner}
            onProfileBannerClick={() => handleTabChange("profile")}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#151a24]">
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {loading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--cyan-glow))]" />
          </div>
        ) : (
          renderContent()
        )}
      </main>

      <InvestorThesisModal
        open={thesisModalOpen}
        onOpenChange={setThesisModalOpen}
        application={investorApplication}
        loading={thesisLoading}
        onEditMemo={() => {
          setThesisModalOpen(false);
          handleTabChange("edit-memo");
        }}
      />

      <InterestsModal
        open={interestsModalOpen}
        onOpenChange={setInterestsModalOpen}
        interests={incomingInterests}
        loading={interestsLoading}
        onAccept={handleAcceptInterest}
        onDecline={handleDeclineInterest}
        processingId={processingInterestId}
        userType="investor"
        onViewProfile={(userId, interest) => {
          setSelectedStartup(toFounderData(interest as { id: string; founder_name?: string; company_name?: string; vertical?: string; stage?: string; location?: string; funding_goal?: string; created_at: string }, userId));
          setMemoModalOpen(true);
        }}
      />

      <SyncsModal
        open={syncsModalOpen}
        onOpenChange={setSyncsModalOpen}
        syncs={activeSyncs}
        loading={syncsLoading}
        userType="investor"
        onViewProfile={(userId, sync) => {
          setSelectedStartup(toFounderData(sync as { id: string; founder_name?: string; company_name?: string; vertical?: string; stage?: string; location?: string; created_at: string }, userId));
          setMemoModalOpen(true);
        }}
        onMessage={(userId, _sync) => {
          setSyncsModalOpen(false);
          setInitialContactUserId(userId);
          setMessagesModalOpen(true);
        }}
      />

      <PendingModal
        open={pendingModalOpen}
        onOpenChange={setPendingModalOpen}
        pending={outgoingPending}
        loading={pendingLoading}
        onCancel={handleCancelPending}
        cancellingId={cancellingId}
        userType="investor"
        onViewProfile={(userId, item) => {
          setSelectedStartup(toFounderData(item as { id: string; founder_name?: string; company_name?: string; vertical?: string; stage?: string; location?: string; created_at: string }, userId));
          setMemoModalOpen(true);
        }}
      />

      <MessagesModal
        open={messagesModalOpen}
        onOpenChange={(open) => {
          setMessagesModalOpen(open);
          if (!open) setInitialContactUserId(null);
        }}
        threads={messageThreads}
        loading={messagesLoading}
        userType="investor"
        onSendMessage={handleSendMessage}
        onMarkAsRead={handleMarkAsRead}
        initialContactUserId={initialContactUserId}
        activeSyncs={activeSyncs.map((sync) => ({
          id: sync.id,
          other_user_id: sync.other_user_id,
          company_name: sync.company_name,
          founder_name: sync.founder_name,
          calendly_link: sync.calendly_link,
        }))}
      />

      <MemoModal
        open={memoModalOpen}
        onOpenChange={setMemoModalOpen}
        startup={selectedStartup}
        onRequestSync={handleRequestSync}
        isRequested={selectedStartup?.user_id ? pendingRequests.has(selectedStartup.user_id) : false}
        isRequesting={requestingSync === selectedStartup?.user_id}
      />
    </div>
  );
};

export default VCDashboard;
