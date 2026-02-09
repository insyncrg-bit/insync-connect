/**
 * Startup (Founder) Dashboard – demo page.
 * Reference: DemoStartupFlow and VCAdminDashboard.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Building2,
  Eye,
  Heart,
  MapPin,
  ArrowRight,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import infinityLogo from "@/landing/assets/infinity-logo.png";
import syncsLogo from "@/landing/assets/infinity-logo-transparent.png";
import { InterestsModal } from "@/components/InterestsModal";
import { SyncsModal } from "@/components/SyncsModal";
import { PendingModal } from "@/components/PendingModal";
import { MessagesModal } from "@/components/MessagesModal";
import { InvestorProfileModal } from "@/components/InvestorProfileModal";

const demoMemo = {
  company_name: "Demo Startup",
  vertical: "AI/ML",
  stage: "Seed",
};

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

// Demo data for founder-side modals (investors interested in this startup, syncs, pending, messages)
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

function getStageColor(stage: string) {
  const colors: Record<string, string> = {
    "Pre-seed": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "Seed": "bg-green-500/20 text-green-400 border-green-500/30",
    "Series A": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Series B": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  };
  return colors[stage] || "bg-white/10 text-white/80 border-white/20";
}

export function StartupDashboard() {
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#151a24]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[hsl(var(--cyan-glow))] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#151a24]">
      <header className="h-14 border-b border-white/10 bg-[hsl(var(--navy-header))] backdrop-blur-sm flex items-center px-6 gap-4">
        <button onClick={() => navigate("/startup")} className="hover:opacity-80 transition-opacity">
          <img src={infinityLogo} alt="Home" className="h-14 w-auto" />
        </button>
        <div className="flex-1" />
      </header>

      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="container mx-auto max-w-6xl space-y-10">
          <div>
            <h1 className="text-4xl font-bold text-white">Welcome, {demoMemo.company_name}!</h1>
          </div>

          <Card
            className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all cursor-pointer"
            onClick={() => toast({ title: "Company Memo", description: "View and edit your memo (demo)." })}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-[hsl(var(--cyan-glow))]" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-white">{demoMemo.company_name}'s Memo</p>
                  <p className="text-sm text-white/60">{demoMemo.vertical} • {demoMemo.stage}</p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-white/60" />
            </div>
          </Card>

          <div className="grid grid-cols-4 gap-4">
            <Card
              className="bg-navy-card border-white/10 p-6 cursor-pointer hover:border-[hsl(var(--cyan-glow))]/50 transition-all"
              onClick={openInterests}
            >
              <div className="flex items-center gap-4">
                <Heart className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                <p className="text-3xl font-bold text-white">{demoInterests.length}</p>
                <p className="text-base text-white/60">Interests</p>
              </div>
            </Card>
            <Card
              className="bg-navy-card border-white/10 p-6 cursor-pointer hover:border-[hsl(var(--cyan-glow))]/50 transition-all"
              onClick={openSyncs}
            >
              <div className="flex items-center gap-4">
                <img src={syncsLogo} alt="Syncs" className="h-12 w-20 object-contain" />
                <p className="text-3xl font-bold text-white">{demoSyncs.length}</p>
                <p className="text-base text-white/60">Syncs</p>
              </div>
            </Card>
            <Card
              className="bg-navy-card border-white/10 p-6 cursor-pointer hover:border-[hsl(var(--cyan-glow))]/50 transition-all"
              onClick={openPending}
            >
              <div className="flex items-center gap-4">
                <Eye className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                <p className="text-3xl font-bold text-white">{demoPending.length}</p>
                <p className="text-base text-white/60">Pending</p>
              </div>
            </Card>
            <Card
              className="bg-navy-card border-white/10 p-6 cursor-pointer hover:border-[hsl(var(--cyan-glow))]/50 transition-all"
              onClick={openMessages}
            >
              <div className="flex items-center gap-4">
                <MessageSquare className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                <p className="text-3xl font-bold text-white">{demoMessages.reduce((acc, m) => acc + m.unread_count, 0)}</p>
                <p className="text-base text-white/60">Messages</p>
              </div>
            </Card>
          </div>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-white">Curated Investors</h2>
              <button className="text-sm text-[hsl(var(--cyan-glow))] hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockInvestors.map((investor) => (
                <Card
                  key={investor.id}
                  className="bg-navy-card border-white/10 p-5 hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white group-hover:text-[hsl(var(--cyan-glow))] transition-colors">
                          {investor.firm_name}
                        </h4>
                        <p className="text-xs text-white/60 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {investor.hq_location}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {investor.stage_focus.slice(0, 1).map((stage, i) => (
                      <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${getStageColor(stage)}`}>{stage}</span>
                    ))}
                    {investor.sector_tags.slice(0, 1).map((sector, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))]">{sector}</span>
                    ))}
                    {investor.check_sizes.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">{investor.check_sizes[0]}</span>
                    )}
                  </div>
                  <p className="text-sm text-white/60 mb-4 line-clamp-2">
                    {investor.thesis_statement || investor.firm_description || "Investment thesis available"}
                  </p>
                  <div className="pt-3 border-t border-white/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10"
                      onClick={() => {
                        setSelectedInvestor(investor);
                        setInvestorModalOpen(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

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
    </div>
  );
}
