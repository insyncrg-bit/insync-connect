/**
 * Analyst Dashboard – demo page (dashboard + profile only).
 * Reference: VCAdminDashboard and DemoVCFlow.
 */
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  UserCog,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import infinityLogo from "@/landing/assets/infinity-logo.png";
import { InterestsModal } from "@/components/InterestsModal";
import { SyncsModal } from "@/components/SyncsModal";
import { PendingModal } from "@/components/PendingModal";
import { MessagesModal } from "@/components/MessagesModal";
import { MemoModal } from "@/components/MemoModal";
import { AnalystProfileModal } from "@/components/AnalystProfileModal";

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

// Demo data (matches VCAdminDashboard pattern)
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

export function AnalystDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [applications, setApplications] = useState<FounderApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStats, setConnectionStats] = useState({ interests: 0, syncs: 0, pending: 0 });
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
  const [adminName, setAdminName] = useState("Analyst");
  const [firmName, setFirmName] = useState("Demo Ventures");
  const [adminTitle, setAdminTitle] = useState("Associate");
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

  const handleTabChange = (tab: string) => setSearchParams({ tab }, { replace: true });

  const displayStats = {
    interests: connectionStats.interests,
    syncs: connectionStats.syncs,
    pending: connectionStats.pending,
    messages: messageThreads.reduce((acc, t) => acc + t.unread_count, 0),
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      "Pre-seed": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "Seed": "bg-green-500/20 text-green-400 border-green-500/30",
      "Series A": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "Series B": "bg-orange-500/20 text-orange-400 border-orange-500/30",
    };
    return colors[stage] || "bg-white/10 text-white/80 border-white/20";
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

  const toFounderApp = (item: { id: string; founder_name?: string; company_name?: string; vertical?: string; stage?: string; location?: string; funding_goal?: string; created_at: string }, userId?: string): FounderApplication => ({
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

  const StartupCard = ({ app }: { app: FounderApplication }) => {
    const isRequested = app.user_id ? pendingRequests.has(app.user_id) : false;
    return (
      <Card className="bg-navy-card border-white/10 p-5 shadow-[0_0_15px_rgba(6,182,212,0.08)] hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300 group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
            </div>
            <div>
              <h4 className="font-medium text-white group-hover:text-[hsl(var(--cyan-glow))] transition-colors">{app.company_name}</h4>
              <p className="text-xs text-white/60 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {app.location}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className={cn("text-xs px-2 py-0.5 rounded-full", getStageColor(app.stage))}>{app.stage}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))]">{app.vertical}</span>
        </div>
        <p className="text-sm text-white/60 mb-4 line-clamp-2">{app.business_model}</p>
        <div className="pt-3 border-t border-white/10">
          {isRequested ? (
            <span className="text-sm text-green-400">Sync Requested</span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10"
              onClick={() => {
                setSelectedStartup(app);
                setMemoModalOpen(true);
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              View Memo
            </Button>
          )}
        </div>
      </Card>
    );
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
        <button onClick={() => navigate("/analyst")} className="hover:opacity-80 transition-opacity">
          <img src={infinityLogo} alt="Home" className="h-14 w-auto" />
        </button>
        <div className="flex-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              {currentTab === "dashboard" ? <><LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard</> : <><UserCog className="h-4 w-4 mr-2" /> Profile</>}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#151a24] border-white/10">
            <DropdownMenuItem onClick={() => handleTabChange("dashboard")} className={cn("text-white hover:bg-white/10 cursor-pointer", currentTab === "dashboard" && "bg-[hsl(var(--cyan-glow))]/20")}>
              <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleTabChange("profile")} className={cn("text-white hover:bg-white/10 cursor-pointer", currentTab === "profile" && "bg-[hsl(var(--cyan-glow))]/20")}>
              <UserCog className="h-4 w-4 mr-2" /> Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm" onClick={() => setProfileModalOpen(true)} className="border-white/20 text-white hover:bg-white/10">
          <UserCog className="h-4 w-4 mr-2" />
          Edit My Profile
        </Button>
      </header>

      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {currentTab === "profile" ? (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-navy-card border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Profile</h2>
              <p className="text-white/60">Manage your analyst profile and visibility.</p>
            </Card>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-10">
            <div>
              <h1 className="text-4xl font-bold text-white">Welcome {adminName} from {firmName}!</h1>
              <p className="text-white/60 mt-2">{adminTitle}</p>
            </div>
            <Card
              className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all cursor-pointer"
              onClick={() => toast({ title: "Firm Thesis", description: "View firm thesis (demo)." })}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <FileText className="h-7 w-7 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-white">{firmName}'s Thesis</p>
                    <p className="text-sm text-white/60">Seed • AI/ML</p>
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-white/60" />
              </div>
            </Card>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Interests", value: displayStats.interests, icon: Heart, onClick: openInterests },
                { label: "Syncs", value: displayStats.syncs, icon: null, image: true, onClick: openSyncs },
                { label: "Pending", value: displayStats.pending, icon: Eye, onClick: openPending },
                { label: "Messages", value: displayStats.messages, icon: MessageSquare, onClick: openMessages },
              ].map((stat) => (
                <Card
                  key={stat.label}
                  className="bg-navy-card border-white/10 p-6 cursor-pointer hover:border-[hsl(var(--cyan-glow))]/50 transition-all"
                  onClick={stat.onClick}
                >
                  <div className="flex items-center gap-4">
                    {stat.icon ? <stat.icon className="h-6 w-6 text-[hsl(var(--cyan-glow))]" /> : stat.image ? <span className="text-[hsl(var(--cyan-glow))] font-bold text-lg">∞</span> : null}
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-base text-white/60">{stat.label}</p>
                  </div>
                </Card>
              ))}
            </div>
            <section>
              <h2 className="text-lg font-medium text-white mb-4">Curated Startups</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {applications.slice(0, 3).map((app) => (
                  <StartupCard key={app.id} app={app} />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

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
      <AnalystProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        profile={(adminProfile ?? defaultProfile) as Parameters<typeof AnalystProfileModal>[0]["profile"]}
        onProfileUpdate={(profile) => {
          setAdminProfile(profile as AnalystProfileState);
          setAdminName(profile.name);
          setAdminTitle(profile.title);
        }}
        isMandatory={false}
      />
    </div>
  );
}
