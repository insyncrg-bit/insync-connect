/**
 * Startup (Founder) Dashboard – demo page.
 * Uses shared dashboard components from @/components/dashboards.
 */
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { InterestsModal } from "@/components/InterestsModal";
import { SyncsModal } from "@/components/SyncsModal";
import { PendingModal } from "@/components/PendingModal";
import { MessagesModal } from "@/components/MessagesModal";
import { InvestorProfileModal } from "@/components/InvestorProfileModal";
import { StartupDashboardContent } from "@/components/dashboards";

const emptyArr: string[] = [];
const mockInvestors = [
  {
    id: "inv-1",
    user_id: "vc-1",
    firm_name: "Horizon Ventures",
    firm_description: "Early-stage VC focused on B2B SaaS and developer tools.",
    hq_location: "San Francisco, CA",
    aum: "$150M",
    fund_type: "Early Stage VC",
    stage_focus: ["Pre-seed", "Seed"],
    sector_tags: ["Enterprise SaaS", "AI/ML"],
    check_sizes: ["$500K - $2M"],
    thesis_statement: "We invest in technical founders building software that becomes critical infrastructure.",
    sub_themes: ["MLOps", "Developer Experience"],
    fast_signals: emptyArr,
    hard_nos: ["Consumer apps", "Hardware-only"],
    operating_support: ["Executive hiring", "Sales strategy"],
    support_style: null,
    lead_follow: "Lead",
    geographic_focus: null,
    b2b_b2c: null,
    revenue_models: emptyArr,
    minimum_traction: emptyArr,
    board_involvement: null,
    decision_process: null,
    time_to_decision: null,
    customer_types: emptyArr,
  },
  {
    id: "inv-2",
    user_id: "vc-2",
    firm_name: "Climate Capital",
    firm_description: "Impact-focused fund investing in climate solutions.",
    hq_location: "New York, NY",
    aum: "$300M",
    fund_type: "Impact VC",
    stage_focus: ["Seed", "Series A"],
    sector_tags: ["Climate Tech", "Sustainability"],
    check_sizes: ["$1M - $5M"],
    thesis_statement: "We back founders building solutions to the climate crisis.",
    sub_themes: ["Carbon Capture", "Clean Energy"],
    fast_signals: emptyArr,
    hard_nos: ["Fossil fuel adjacent"],
    operating_support: ["Policy & regulatory", "Impact measurement"],
    support_style: null,
    lead_follow: "Lead or Follow",
    geographic_focus: null,
    b2b_b2c: null,
    revenue_models: emptyArr,
    minimum_traction: emptyArr,
    board_involvement: null,
    decision_process: null,
    time_to_decision: null,
    customer_types: emptyArr,
  },
  {
    id: "inv-3",
    user_id: "vc-3",
    firm_name: "HealthTech Partners",
    firm_description: "Healthcare and digital health focused VC.",
    hq_location: "Boston, MA",
    aum: "$200M",
    fund_type: "Sector VC",
    stage_focus: ["Seed", "Series A"],
    sector_tags: ["Digital Health", "MedTech"],
    check_sizes: ["$750K - $3M"],
    thesis_statement: "We invest in companies improving patient outcomes and care delivery.",
    sub_themes: ["Diagnostics", "Care coordination"],
    fast_signals: emptyArr,
    hard_nos: ["Pure pharma", "Devices without software"],
    operating_support: ["Clinical trials", "Regulatory"],
    support_style: null,
    lead_follow: "Lead",
    geographic_focus: null,
    b2b_b2c: null,
    revenue_models: emptyArr,
    minimum_traction: emptyArr,
    board_involvement: null,
    decision_process: null,
    time_to_decision: null,
    customer_types: emptyArr,
  },
];

const demoInterests = [
  {
    id: "int-1",
    requester_user_id: "vc-1",
    sync_note: "Your product fits our thesis on developer tools.",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    firm_name: "Horizon Ventures",
    analyst_name: "Jane Smith",
    stage_focus: ["Seed"],
    sector_tags: ["AI/ML"],
    check_sizes: ["$500K - $2M"],
  },
];
const demoSyncs = [
  {
    id: "sync-1",
    other_user_id: "vc-2",
    other_user_type: "investor",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    firm_name: "Climate Capital",
    analyst_name: "Alex Green",
    unread_count: 0,
    calendly_link: null,
  },
];
const demoPending = [
  {
    id: "pend-1",
    target_user_id: "vc-3",
    sync_note: "Would love to discuss our climate angle.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    firm_name: "HealthTech Partners",
    analyst_name: "Sam Lee",
  },
];
const demoMessages = [
  {
    id: "msg-1",
    other_user_id: "vc-2",
    other_user_type: "investor",
    other_user_name: "Alex Green",
    other_user_company: "Climate Capital",
    last_message: "Let's schedule a call next week.",
    last_message_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unread_count: 1,
    messages: [
      { id: "m1", sender: "other" as const, content: "Let's schedule a call next week.", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    ],
  },
];

export function StartupDashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const [syncsModalOpen, setSyncsModalOpen] = useState(false);
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [investorModalOpen, setInvestorModalOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<(typeof mockInvestors)[0] | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncedIds, setSyncedIds] = useState<Set<string>>(new Set());

  const [interests, setInterests] = useState<typeof demoInterests>([]);
  const [syncs, setSyncs] = useState<typeof demoSyncs>([]);
  const [pending, setPending] = useState<typeof demoPending>([]);
  const [messageThreads, setMessageThreads] = useState<typeof demoMessages>([]);
  const [interestsLoading, setInterestsLoading] = useState(false);
  const [syncsLoading, setSyncsLoading] = useState(false);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [initialContactUserId, setInitialContactUserId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const openInterests = () => {
    setInterestsModalOpen(true);
    setInterestsLoading(true);
    setTimeout(() => {
      setInterests(demoInterests);
      setInterestsLoading(false);
    }, 300);
  };
  const openSyncs = () => {
    setSyncsModalOpen(true);
    setSyncsLoading(true);
    setTimeout(() => {
      setSyncs(demoSyncs);
      setSyncsLoading(false);
    }, 300);
  };
  const openPending = () => {
    setPendingModalOpen(true);
    setPendingLoading(true);
    setTimeout(() => {
      setPending(demoPending);
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

  return (
    <>
      <StartupDashboardContent
        loading={loading}
        companyName="Demo Startup"
        vertical="AI/ML"
        stage="Seed"
        stats={{
          interests: demoInterests.length,
          syncs: demoSyncs.length,
          pending: demoPending.length,
          messages: demoMessages.reduce((acc, m) => acc + m.unread_count, 0),
        }}
        investors={mockInvestors}
        pendingRequestIds={syncedIds}
        onMemoClick={() => toast({ title: "Company Memo", description: "View and edit your memo (demo)." })}
        onInterestsClick={openInterests}
        onSyncsClick={openSyncs}
        onPendingClick={openPending}
        onMessagesClick={openMessages}
        onViewInvestor={(inv) => {
          setSelectedInvestor(inv as (typeof mockInvestors)[0]);
          setInvestorModalOpen(true);
        }}
      />

      <InterestsModal
        open={interestsModalOpen}
        onOpenChange={setInterestsModalOpen}
        interests={interests}
        loading={interestsLoading}
        onAccept={async () => {}}
        onDecline={async () => {}}
        processingId={null}
        userType="founder"
        onViewProfile={() => {}}
      />
      <SyncsModal
        open={syncsModalOpen}
        onOpenChange={setSyncsModalOpen}
        syncs={syncs}
        loading={syncsLoading}
        userType="founder"
        onViewProfile={() => {}}
        onMessage={() => {
          setSyncsModalOpen(false);
          setMessagesModalOpen(true);
          openMessages();
        }}
      />
      <PendingModal
        open={pendingModalOpen}
        onOpenChange={setPendingModalOpen}
        pending={pending}
        loading={pendingLoading}
        onCancel={async () => {}}
        cancellingId={null}
        userType="founder"
        onViewProfile={() => {}}
      />
      <MessagesModal
        open={messagesModalOpen}
        onOpenChange={(open) => {
          setMessagesModalOpen(open);
          if (!open) setInitialContactUserId(null);
        }}
        threads={messageThreads}
        loading={messagesLoading}
        userType="founder"
        onSendMessage={async () => {
          toast({ title: "Message sent" });
          return true;
        }}
        onMarkAsRead={() => {}}
        initialContactUserId={initialContactUserId}
        activeSyncs={syncs.map((s) => ({ id: s.id, other_user_id: s.other_user_id, company_name: s.firm_name, founder_name: s.analyst_name, calendly_link: s.calendly_link }))}
      />
      {selectedInvestor && (
        <InvestorProfileModal
          open={investorModalOpen}
          onOpenChange={setInvestorModalOpen}
          investor={selectedInvestor}
          loading={false}
          onSync={async (userId, note) => {
            setSyncingId(userId);
            await new Promise((r) => setTimeout(r, 400));
            toast({ title: "Sync requested!", description: "Your request has been sent." });
            setSyncedIds((prev) => new Set([...prev, userId]));
            setSyncingId(null);
          }}
          isSyncing={syncingId === selectedInvestor.user_id}
          alreadySynced={syncedIds.has(selectedInvestor.user_id)}
        />
      )}
    </>
  );
}
