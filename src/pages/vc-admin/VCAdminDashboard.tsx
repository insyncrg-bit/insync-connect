import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { VCAdminOrganisation, VCAdminSettings } from "@/components/vc-admin";
import { InvestorDashboardContent, StartupCard } from "@/components/dashboards";
import type { StartupCardData } from "@/components/dashboards";
import { InvestorThesisModal } from "@/components/InvestorThesisModal";
import { InterestsModal } from "@/components/InterestsModal";
import { SyncsModal } from "@/components/SyncsModal";
import { PendingModal } from "@/components/PendingModal";
import { MessagesModal } from "@/components/MessagesModal";
import { MemoModal } from "@/components/MemoModal";
import { AnalystProfileModal } from "@/components/AnalystProfileModal";
import { sessionManager } from "@/lib/session";
import type { InvestorApplication } from "@/components/InvestorThesisModal";

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

export const VCAdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [applications, setApplications] = useState<FounderApplication[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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
  } | null>(null);
  const [investorApplication, setInvestorApplication] = useState<InvestorApplication | null>(null);

  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const [syncsModalOpen, setSyncsModalOpen] = useState(false);
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
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

  const demoInterests = [
    {
      id: "demo-int-1",
      requester_user_id: "demo-founder-1",
      sync_note: "Your thesis on AI infrastructure aligns perfectly with our roadmap.",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      company_name: "NeuralFlow AI",
      founder_name: "Sarah Chen",
      vertical: "AI/ML Infrastructure",
      stage: "Seed",
      location: "San Francisco, CA",
      funding_goal: "$3M",
    },
    {
      id: "demo-int-2",
      requester_user_id: "demo-founder-2",
      sync_note: null,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      company_name: "ClimateLedger",
      founder_name: "Marcus Johnson",
      vertical: "Climate Tech",
      stage: "Pre-seed",
      location: "Austin, TX",
      funding_goal: "$1.5M",
    },
  ];

  const demoSyncs = [
    {
      id: "demo-sync-1",
      other_user_id: "demo-founder-3",
      other_user_type: "founder",
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      company_name: "MedSync Health",
      founder_name: "Priya Patel",
      vertical: "Digital Health",
      stage: "Seed",
      location: "Boston, MA",
    },
    {
      id: "demo-sync-2",
      other_user_id: "demo-founder-4",
      other_user_type: "founder",
      created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      company_name: "FinanceOS",
      founder_name: "David Kim",
      vertical: "Fintech",
      stage: "Series A",
      location: "New York, NY",
    },
  ];

  const demoPending = [
    {
      id: "demo-pend-1",
      target_user_id: "demo-founder-5",
      sync_note: "Your traction in the supply chain space is impressive.",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      company_name: "SupplyChain360",
      founder_name: "Elena Rodriguez",
      vertical: "Supply Chain & Logistics",
      stage: "Seed",
      location: "Miami, FL",
    },
  ];

  const demoMessages = [
    {
      id: "demo-msg-1",
      other_user_id: "demo-founder-3",
      other_user_name: "Priya Patel",
      other_user_company: "MedSync Health",
      last_message: "Thanks for the intro to the health system. The meeting went great!",
      last_message_time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      unread_count: 1,
      messages: [
        { id: "m1", sender: "self" as const, content: "I'd like to introduce you to our portfolio company's head of partnerships.", timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() },
        { id: "m2", sender: "other" as const, content: "That would be amazing!", timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
        { id: "m3", sender: "self" as const, content: "I'll set up the intro.", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
        { id: "m4", sender: "other" as const, content: "Thanks for the intro to the health system. The meeting went great!", timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
      ],
    },
    {
      id: "demo-msg-2",
      other_user_id: "demo-founder-4",
      other_user_name: "David Kim",
      other_user_company: "FinanceOS",
      last_message: "The board deck is ready for your review.",
      last_message_time: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      unread_count: 0,
      messages: [
        { id: "m1", sender: "other" as const, content: "The board deck is ready for your review.", timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
      ],
    },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const session = sessionManager.get();
      const firmId = session?.firmId;

      if (firmId) {
        const { getAuth } = await import("firebase/auth");
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          try {
            const token = await user.getIdToken();
            const apiUrl = import.meta.env.VITE_FIREBASE_API;

            const response = await fetch(`${apiUrl}/api/firms/${firmId}/memo`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
              const data = await response.json();
              const memo = data.memo;

              if (memo) {
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
                });
                if (memo.firmName) setFirmName(memo.firmName);
              }
            }
          } catch (err) {
            console.error("Error fetching memo:", err);
          }
        }
      }

      setApplications([
        {
          id: "1",
          founder_name: "Demo Founder",
          company_name: "Demo Startup",
          vertical: "AI/ML",
          stage: "Seed",
          location: "San Francisco, CA",
          website: "https://example.com",
          business_model: "Example business model",
          funding_goal: "$2M",
          traction: "Example traction",
          created_at: new Date().toISOString(),
        },
      ]);

      setEvents([
        {
          id: "1",
          title: "VC Networking Event",
          description: "Connect with other VCs and startups",
          event_type: "Networking",
          location: "San Francisco, CA",
          event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          max_attendees: 100,
        },
      ]);

      setConnectionStats({ interests: 5, syncs: 12, pending: 3 });
      setIncomingInterests(demoInterests);
      setActiveSyncs(demoSyncs);
      setOutgoingPending(demoPending);
      setMessageThreads(demoMessages);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

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
    messages: demoMessages.reduce((acc, t) => acc + t.unread_count, 0),
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
    switch (currentTab) {
      case "dashboard":
        return (
          <InvestorDashboardContent
            adminName={adminName}
            firmName={firmName}
            adminTitle={adminTitle}
            thesisSubtitle="Seed • Series A • AI/ML"
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
        return <VCAdminOrganisation />;

      case "settings":
        return <VCAdminSettings />;

      case "profile":
        return (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-navy-card border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Profile Settings</h2>
              <p className="text-white/60">Profile settings will be implemented soon.</p>
            </Card>
          </div>
        );

      default:
        return (
          <InvestorDashboardContent
            adminName={adminName}
            firmName={firmName}
            adminTitle={adminTitle}
            thesisSubtitle="Seed • Series A • AI/ML"
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
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#151a24]">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--cyan-glow))]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#151a24]">
      <main className="flex-1 p-6 md:p-8 overflow-auto">{renderContent()}</main>

      <InvestorThesisModal
        open={thesisModalOpen}
        onOpenChange={setThesisModalOpen}
        application={investorApplication}
        loading={thesisLoading}
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

      <AnalystProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        profile={adminProfile}
        onProfileUpdate={(profile) => {
          setAdminProfile(profile);
          setAdminName(profile.name);
          setAdminTitle(profile.title);
        }}
        isMandatory={false}
      />
    </div>
  );
};

export default VCAdminDashboard;
