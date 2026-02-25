/**
 * Analyst Dashboard – demo page (dashboard + profile only).
 * Uses shared dashboard components from @/components/dashboards.
 */
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { InterestsModal } from "@/components/InterestsModal";
import { SyncsModal } from "@/components/SyncsModal";
import { PendingModal } from "@/components/PendingModal";
import { MessagesModal } from "@/components/MessagesModal";
import { MemoModal } from "@/components/MemoModal";
import { InvestorDashboardContent, DashboardLayout } from "@/components/dashboards";
import type { StartupCardData } from "@/components/dashboards";

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

const demoInterests = [
  {
    id: "demo-int-1",
    requester_user_id: "demo-founder-1",
    sync_note: "Your thesis on AI infrastructure aligns with our roadmap.",
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
    unread_count: 1,
    calendly_link: null,
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
    unread_count: 0,
    calendly_link: null,
  },
];

const demoPending = [
  {
    id: "demo-pend-1",
    target_user_id: "demo-founder-5",
    sync_note: "Would love to learn more about your expansion plans.",
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
    other_user_type: "founder",
    other_user_name: "Priya Patel",
    other_user_company: "MedSync Health",
    last_message: "Thanks for the intro!",
    last_message_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unread_count: 1,
    messages: [
      { id: "m1", sender: "other" as const, content: "Thanks for the intro!", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: "demo-msg-2",
    other_user_id: "demo-founder-4",
    other_user_type: "founder",
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

type AnalystProfileState = {
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
  profile_picture_url?: string | null;
  linkedin_url?: string | null;
};

const toFounderApp = (
  item: { id: string; founder_name?: string; company_name?: string; vertical?: string; stage?: string; location?: string; funding_goal?: string; created_at: string },
  userId?: string
): FounderApplication => ({
  id: item.id,
  founder_name: item.founder_name ?? "Unknown",
  company_name: item.company_name ?? "Unknown",
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

export function AnalystDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [applications, setApplications] = useState<FounderApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStats, setConnectionStats] = useState({ interests: 0, syncs: 0, pending: 0 });
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
  const [adminName, setAdminName] = useState("Analyst");
  const [firmName, setFirmName] = useState("Demo Ventures");
  const [adminTitle, setAdminTitle] = useState("Associate");
  const [adminProfile, setAdminProfile] = useState<AnalystProfileState | null>(null);

  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const [syncsModalOpen, setSyncsModalOpen] = useState(false);
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [memoModalOpen, setMemoModalOpen] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState<FounderApplication | null>(null);

  const [incomingInterests, setIncomingInterests] = useState<typeof demoInterests>([]);
  const [interestsLoading, setInterestsLoading] = useState(false);
  const [processingInterestId, setProcessingInterestId] = useState<string | null>(null);
  const [activeSyncs, setActiveSyncs] = useState<typeof demoSyncs>([]);
  const [syncsLoading, setSyncsLoading] = useState(false);
  const [outgoingPending, setOutgoingPending] = useState<typeof demoPending>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [messageThreads, setMessageThreads] = useState<typeof demoMessages>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [initialContactUserId, setInitialContactUserId] = useState<string | null>(null);
  const [requestingSync, setRequestingSync] = useState<string | null>(null);

  const currentTab = searchParams.get("tab") || "dashboard";

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setApplications([
        {
          id: "1",
          founder_name: "Demo Founder",
          company_name: "Demo Startup",
          vertical: "AI/ML",
          stage: "Seed",
          location: "San Francisco, CA",
          website: "https://example.com",
          business_model: "B2B SaaS for data teams.",
          funding_goal: "$2M",
          traction: "Early revenue.",
          created_at: new Date().toISOString(),
        },
      ]);
      setConnectionStats({ interests: demoInterests.length, syncs: demoSyncs.length, pending: demoPending.length });
      setIncomingInterests(demoInterests);
      setActiveSyncs(demoSyncs);
      setOutgoingPending(demoPending);
      setMessageThreads(demoMessages);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const displayStats = {
    interests: connectionStats.interests,
    syncs: connectionStats.syncs,
    pending: connectionStats.pending,
    messages: messageThreads.reduce((acc, t) => acc + t.unread_count, 0),
  };

  const openInterests = () => {
    setInterestsModalOpen(true);
    setInterestsLoading(true);
    setTimeout(() => {
      setIncomingInterests(demoInterests);
      setInterestsLoading(false);
    }, 300);
  };
  const openSyncs = () => {
    setSyncsModalOpen(true);
    setSyncsLoading(true);
    setTimeout(() => {
      setActiveSyncs(demoSyncs);
      setSyncsLoading(false);
    }, 300);
  };
  const openPending = () => {
    setPendingModalOpen(true);
    setPendingLoading(true);
    setTimeout(() => {
      setOutgoingPending(demoPending);
      setPendingLoading(false);
    }, 300);
  };
  const openMessages = () => {
    setMessagesModalOpen(true);
    setMessagesLoading(true);
    setTimeout(() => {
      setMessageThreads(demoMessages);
      setMessagesLoading(false);
    }, 300);
  };

  const handleAcceptInterest = async (requestId: string) => {
    setProcessingInterestId(requestId);
    await new Promise((r) => setTimeout(r, 400));
    toast({ title: "Connection accepted!" });
    setIncomingInterests((prev) => prev.filter((i) => i.id !== requestId));
    setConnectionStats((prev) => ({ ...prev, interests: prev.interests - 1, syncs: prev.syncs + 1 }));
    setProcessingInterestId(null);
  };
  const handleDeclineInterest = async (requestId: string) => {
    setProcessingInterestId(requestId);
    await new Promise((r) => setTimeout(r, 400));
    toast({ title: "Connection declined" });
    setIncomingInterests((prev) => prev.filter((i) => i.id !== requestId));
    setConnectionStats((prev) => ({ ...prev, interests: prev.interests - 1 }));
    setProcessingInterestId(null);
  };
  const handleCancelPending = async (requestId: string) => {
    setCancellingId(requestId);
    await new Promise((r) => setTimeout(r, 400));
    toast({ title: "Request cancelled" });
    setOutgoingPending((prev) => prev.filter((p) => p.id !== requestId));
    setConnectionStats((prev) => ({ ...prev, pending: prev.pending - 1 }));
    setCancellingId(null);
  };
  const handleSendMessage = async () => {
    await new Promise((r) => setTimeout(r, 200));
    toast({ title: "Message sent" });
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
    await new Promise((r) => setTimeout(r, 400));
    toast({ title: "Sync requested!", description: `Request sent to ${companyName}.` });
    setPendingRequests((prev) => new Set([...prev, founderUserId]));
    setConnectionStats((prev) => ({ ...prev, pending: prev.pending + 1 }));
    setRequestingSync(null);
  };

  const defaultProfile: AnalystProfileState = {
    id: "demo-analyst",
    user_id: "demo-analyst-1",
    firm_id: "demo-firm",
    name: "Analyst",
    title: "Associate",
    firm_name: "Demo Ventures",
    email: "analyst@demoventures.vc",
    location: "San Francisco, CA",
    vertical: "AI/ML",
    one_liner: "Demo analyst profile.",
    profile_completed: true,
  };

  return (
    <DashboardLayout loading={loading}>
      {currentTab === "profile" ? (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-navy-card border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Profile</h2>
              <p className="text-white/60">Manage your analyst profile and visibility.</p>
            </Card>
          </div>
        ) : (
          <InvestorDashboardContent
            adminName={adminName}
            firmName={firmName}
            adminTitle={adminTitle}
            stats={displayStats}
            startups={applications.map(toStartupCardData)}
            pendingRequestIds={pendingRequests}
            onThesisClick={() => toast({ title: "Firm Thesis", description: "View firm thesis (demo)." })}
            onInterestsClick={openInterests}
            onSyncsClick={openSyncs}
            onPendingClick={openPending}
            onMessagesClick={openMessages}
            onViewStartup={(s) => {
              const app = applications.find((a) => a.id === s.id) ?? toFounderApp({ id: s.id, founder_name: s.founder_name, company_name: s.company_name, vertical: s.vertical, stage: s.stage, location: s.location, created_at: "" }, s.user_id ?? undefined);
              setSelectedStartup(app);
              setMemoModalOpen(true);
            }}
          />
        )}

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
          setSelectedStartup(toFounderApp(interest, userId));
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
          setSelectedStartup(toFounderApp(sync, userId));
          setMemoModalOpen(true);
        }}
        onMessage={() => {
          setSyncsModalOpen(false);
          setMessagesModalOpen(true);
          openMessages();
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
          setSelectedStartup(toFounderApp(item, userId));
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
        activeSyncs={activeSyncs.map((s) => ({ id: s.id, other_user_id: s.other_user_id, company_name: s.company_name, founder_name: s.founder_name, calendly_link: s.calendly_link }))}
      />
      <MemoModal
        open={memoModalOpen}
        onOpenChange={setMemoModalOpen}
        startup={selectedStartup}
        onRequestSync={handleRequestSync}
        isRequested={selectedStartup?.user_id ? pendingRequests.has(selectedStartup.user_id) : false}
        isRequesting={requestingSync === selectedStartup?.user_id}
      />
    </DashboardLayout>
  );
}
