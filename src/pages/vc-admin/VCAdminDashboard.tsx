import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Calendar, 
  Eye, 
  Heart,
  MapPin,
  ArrowRight,
  Search,
  Filter,
  MessageSquare,
  Check,
  Loader2,
  FileText,
  Sparkles,
  UserCog,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { VCAdminOrganisation } from "./components/VCAdminOrganisation";
import { VCAdminSettings } from "./components/VCAdminSettings";
import { InvestorThesisModal } from "@/components/InvestorThesisModal";
import { ProfileSettings } from "@/components/ProfileSettings";
import { InterestsModal } from "@/components/InterestsModal";
import { SyncsModal } from "@/components/SyncsModal";
import { PendingModal } from "@/components/PendingModal";
import { MessagesModal } from "@/components/MessagesModal";
import { MemoModal } from "@/components/MemoModal";
import { MatchScoreBadge } from "@/components/MatchScoreBadge";
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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [applications, setApplications] = useState<FounderApplication[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [connectionStats, setConnectionStats] = useState<ConnectionStats>({ interests: 0, syncs: 0, pending: 0 });
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
  
  // Admin profile state
  const [adminName, setAdminName] = useState<string>("VC Admin");
  const [firmName, setFirmName] = useState<string>("Your VC Firm");
  const [adminTitle, setAdminTitle] = useState<string>("Admin");
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [investorApplication, setInvestorApplication] = useState<any>(null);
  
  // Modal states
  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const [syncsModalOpen, setSyncsModalOpen] = useState(false);
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [thesisModalOpen, setThesisModalOpen] = useState(false);
  const [memoModalOpen, setMemoModalOpen] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState<FounderApplication | null>(null);
  
  // Interest/Sync/Pending/Messages data
  const [incomingInterests, setIncomingInterests] = useState<any[]>([]);
  const [interestsLoading, setInterestsLoading] = useState(false);
  const [processingInterestId, setProcessingInterestId] = useState<string | null>(null);
  const [activeSyncs, setActiveSyncs] = useState<any[]>([]);
  const [syncsLoading, setSyncsLoading] = useState(false);
  const [outgoingPending, setOutgoingPending] = useState<any[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [messageThreads, setMessageThreads] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [initialContactUserId, setInitialContactUserId] = useState<string | null>(null);
  const [requestingSync, setRequestingSync] = useState<string | null>(null);
  const [thesisLoading, setThesisLoading] = useState(false);

  const currentTab = searchParams.get("tab") || "dashboard";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Demo data
  const demoInterests = [
    {
      id: "demo-int-1",
      requester_user_id: "demo-founder-1",
      sync_note: "Your thesis on AI infrastructure aligns perfectly with our roadmap. Would love to discuss a potential partnership.",
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
      sync_note: "Your traction in the supply chain space is impressive. Would love to learn more about your expansion plans.",
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
        { id: "m1", sender: "self" as const, content: "I'd like to introduce you to our portfolio company's head of partnerships at a major health system.", timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() },
        { id: "m2", sender: "other" as const, content: "That would be amazing! We've been looking to expand our health system partnerships.", timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
        { id: "m3", sender: "self" as const, content: "I'll set up the intro. Expect an email from Sarah at Northeast Health.", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
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

  const fetchDashboardData = async () => {
    // TODO: Integrate with backend API when ready
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Placeholder data
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
    
    // Set demo data for modals
    setIncomingInterests(demoInterests);
    setActiveSyncs(demoSyncs);
    setOutgoingPending(demoPending);
    setMessageThreads(demoMessages);
    
    // Set investor application for thesis
    setInvestorApplication({
      id: "demo-firm",
      firm_name: firmName,
      firm_description: "Early-stage venture fund focused on B2B software and AI infrastructure.",
      thesis_statement: "We invest in technical founders building category-defining B2B software companies.",
      sub_themes: ["Developer Tools", "AI Infrastructure", "Data Platforms"],
      fast_signals: ["Strong technical team", "Early revenue traction"],
      hard_nos: ["Consumer apps", "Hardware-only"],
      check_sizes: ["$500K - $2M"],
      stage_focus: ["Pre-seed", "Seed"],
      sector_tags: ["AI/ML", "B2B SaaS", "Developer Tools"],
      customer_types: ["Enterprise", "SMB"],
      lead_follow: "Lead",
      operating_support: ["Hiring", "GTM Strategy"],
      support_style: "Hands-on",
      hq_location: "San Francisco, CA",
      aum: "$150M",
      fund_type: "Early Stage",
      geographic_focus: "North America",
      b2b_b2c: "B2B",
      revenue_models: ["SaaS", "Usage-based"],
      minimum_traction: ["$50K ARR"],
      board_involvement: "Board seat at Seed+",
      decision_process: "2 partner meetings",
      time_to_decision: "2-3 weeks",
    });
    
    setLoading(false);
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

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      "Pre-seed": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "Seed": "bg-green-500/20 text-green-400 border-green-500/30",
      "Series A": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "Series B": "bg-orange-500/20 text-orange-400 border-orange-500/30",
    };
    return colors[stage] || "bg-white/10 text-white/80 border-white/20";
  };

  const filteredApplications = applications.filter(app => 
    app.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.vertical.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.founder_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handler functions
  const handleOpenInterests = () => {
    setInterestsModalOpen(true);
    setInterestsLoading(true);
    setTimeout(() => {
      setIncomingInterests(demoInterests);
      setInterestsLoading(false);
    }, 500);
  };

  const handleAcceptInterest = async (requestId: string) => {
    setProcessingInterestId(requestId);
    try {
      // TODO: Integrate with backend API when ready
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({ title: "Connection accepted!", description: "You are now synced with this founder." });
      setIncomingInterests(prev => prev.filter(i => i.id !== requestId));
      setConnectionStats(prev => ({ ...prev, interests: prev.interests - 1, syncs: prev.syncs + 1 }));
    } catch (error) {
      toast({ title: "Error", description: "Failed to accept", variant: "destructive" });
    } finally {
      setProcessingInterestId(null);
    }
  };

  const handleDeclineInterest = async (requestId: string) => {
    setProcessingInterestId(requestId);
    try {
      // TODO: Integrate with backend API when ready
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({ title: "Connection declined" });
      setIncomingInterests(prev => prev.filter(i => i.id !== requestId));
      setConnectionStats(prev => ({ ...prev, interests: prev.interests - 1 }));
    } catch (error) {
      toast({ title: "Error", description: "Failed to decline", variant: "destructive" });
    } finally {
      setProcessingInterestId(null);
    }
  };

  const handleOpenSyncs = () => {
    setSyncsModalOpen(true);
    setSyncsLoading(true);
    setTimeout(() => {
      setActiveSyncs(demoSyncs);
      setSyncsLoading(false);
    }, 500);
  };

  const handleOpenPending = () => {
    setPendingModalOpen(true);
    setPendingLoading(true);
    setTimeout(() => {
      setOutgoingPending(demoPending);
      setPendingLoading(false);
    }, 500);
  };

  const handleCancelPending = async (requestId: string) => {
    setCancellingId(requestId);
    try {
      // TODO: Integrate with backend API when ready
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({ title: "Request cancelled" });
      setOutgoingPending(prev => prev.filter(p => p.id !== requestId));
      setConnectionStats(prev => ({ ...prev, pending: prev.pending - 1 }));
    } catch (error) {
      toast({ title: "Error", description: "Failed to cancel request", variant: "destructive" });
    } finally {
      setCancellingId(null);
    }
  };

  const handleOpenMessages = () => {
    setMessagesModalOpen(true);
    setMessagesLoading(true);
    setTimeout(() => {
      setMessageThreads(demoMessages);
      setMessagesLoading(false);
    }, 500);
  };

  const handleSendMessage = async (receiverUserId: string, content: string): Promise<boolean> => {
    // TODO: Integrate with backend API when ready
    await new Promise((resolve) => setTimeout(resolve, 300));
    toast({ title: "Message sent", description: "Your message has been sent." });
    return true;
  };

  const handleMarkAsRead = (otherUserId: string) => {
    // TODO: Integrate with backend API when ready
    setMessageThreads(prev => prev.map(thread => 
      thread.other_user_id === otherUserId 
        ? { ...thread, unread_count: 0 }
        : thread
    ));
  };

  const handleRequestSync = async (founderUserId: string, companyName: string) => {
    setRequestingSync(founderUserId);
    try {
      // TODO: Integrate with backend API when ready
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({
        title: "Sync requested!",
        description: `Your request to connect with ${companyName} has been sent.`,
      });
      setPendingRequests(prev => new Set([...prev, founderUserId]));
      setConnectionStats(prev => ({ ...prev, pending: prev.pending + 1 }));
    } catch (error) {
      toast({ title: "Error", description: "Failed to send sync request", variant: "destructive" });
    } finally {
      setRequestingSync(null);
    }
  };

  const fetchInvestorThesis = async () => {
    setThesisLoading(true);
    try {
      // TODO: Integrate with backend API when ready
      await new Promise((resolve) => setTimeout(resolve, 500));
      setThesisModalOpen(true);
    } catch (error) {
      console.error("Error fetching thesis:", error);
      setThesisModalOpen(true);
    } finally {
      setThesisLoading(false);
    }
  };

  const displayStats = {
    interests: connectionStats.interests,
    syncs: connectionStats.syncs,
    pending: connectionStats.pending,
    messages: demoMessages.reduce((acc, t) => acc + t.unread_count, 0),
  };

  const curatedStartups = applications;

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
              <h4 className="font-medium text-white group-hover:text-[hsl(var(--cyan-glow))] transition-colors">
                {app.company_name}
              </h4>
              <p className="text-xs text-white/60 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {app.location}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className={`text-xs px-2 py-0.5 rounded-full ${getStageColor(app.stage)}`}>
            {app.stage}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))]">
            {app.vertical}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
            {app.funding_goal}
          </span>
        </div>

        <p className="text-sm text-white/60 mb-4 line-clamp-2">{app.business_model}</p>

        <div className="pt-3 border-t border-white/10">
          {isRequested ? (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <Check className="h-4 w-4" />
              Sync Requested
            </div>
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

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Welcome Section */}
            <div>
              <h1 className="text-4xl font-bold text-white">
                Welcome {adminName} from {firmName}!
              </h1>
              <p className="text-white/60 mt-2">{adminTitle}</p>
            </div>

            {/* Thesis Quick Access */}
            <Card 
              className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300 cursor-pointer"
              onClick={() => {
                toast({
                  title: "Firm Thesis",
                  description: "Thesis view will be implemented soon.",
                });
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <FileText className="h-7 w-7 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-white">{firmName}'s Thesis</p>
                    <p className="text-sm text-white/60">Seed • Series A • AI/ML</p>
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-white/60" />
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Interests", value: displayStats.interests, icon: Heart, onClick: () => setInterestsModalOpen(true) },
                { label: "Syncs", value: displayStats.syncs, icon: null, image: true, onClick: () => setSyncsModalOpen(true) },
                { label: "Pending", value: displayStats.pending, icon: Eye, onClick: () => setPendingModalOpen(true) },
                { label: "Messages", value: displayStats.messages, icon: MessageSquare, onClick: () => setMessagesModalOpen(true) },
              ].map((stat) => (
                <Card 
                  key={stat.label}
                  className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300 cursor-pointer"
                  onClick={stat.onClick}
                >
                  <div className="flex items-center gap-4">
                    {stat.icon ? (
                      <stat.icon className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                    ) : stat.image ? (
                      <div className="h-12 w-20 flex items-center justify-center bg-[hsl(var(--cyan-glow))]/10 rounded">
                        <span className="text-[hsl(var(--cyan-glow))] font-bold text-lg">∞</span>
                      </div>
                    ) : null}
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-base text-white/60">{stat.label}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Curated Startups */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">Curated Startups</h2>
                <button 
                  className="text-sm text-[hsl(var(--cyan-glow))] hover:underline flex items-center gap-1"
                  onClick={() => handleTabChange("startups")}
                >
                  View all <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {curatedStartups.slice(0, 3).map((app) => (
                  <StartupCard key={app.id} app={app} />
                ))}
              </div>
            </section>
          </div>
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
                <p className="text-white/60">AI-matched startups based on {firmName}'s thesis</p>
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
                  <StartupCard key={app.id} app={app} />
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
                  <Card key={event.id} className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.08)] hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300">
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
                    <Button size="sm" className="w-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/20 border border-[hsl(var(--cyan-glow))]/30">
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
        // Default to dashboard if tab is not recognized - render dashboard content
        return (
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Welcome Section */}
            <div>
              <h1 className="text-4xl font-bold text-white">
                Welcome {adminName} from {firmName}!
              </h1>
              <p className="text-white/60 mt-2">{adminTitle}</p>
            </div>

            {/* Thesis Quick Access */}
            <Card 
              className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300 cursor-pointer"
              onClick={() => {
                toast({
                  title: "Firm Thesis",
                  description: "Thesis view will be implemented soon.",
                });
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <FileText className="h-7 w-7 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-white">{firmName}'s Thesis</p>
                    <p className="text-sm text-white/60">Seed • Series A • AI/ML</p>
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-white/60" />
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Interests", value: displayStats.interests, icon: Heart, onClick: () => setInterestsModalOpen(true) },
                { label: "Syncs", value: displayStats.syncs, icon: null, image: true, onClick: () => setSyncsModalOpen(true) },
                { label: "Pending", value: displayStats.pending, icon: Eye, onClick: () => setPendingModalOpen(true) },
                { label: "Messages", value: displayStats.messages, icon: MessageSquare, onClick: () => setMessagesModalOpen(true) },
              ].map((stat) => (
                <Card 
                  key={stat.label}
                  className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300 cursor-pointer"
                  onClick={stat.onClick}
                >
                  <div className="flex items-center gap-4">
                    {stat.icon ? (
                      <stat.icon className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                    ) : stat.image ? (
                      <div className="h-12 w-20 flex items-center justify-center bg-[hsl(var(--cyan-glow))]/10 rounded">
                        <span className="text-[hsl(var(--cyan-glow))] font-bold text-lg">∞</span>
                      </div>
                    ) : null}
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-base text-white/60">{stat.label}</p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Curated Startups */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">Curated Startups</h2>
                <button 
                  className="text-sm text-[hsl(var(--cyan-glow))] hover:underline flex items-center gap-1"
                  onClick={() => handleTabChange("startups")}
                >
                  View all <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {curatedStartups.slice(0, 3).map((app) => (
                  <StartupCard key={app.id} app={app} />
                ))}
              </div>
            </section>
          </div>
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
      {/* Navbar is rendered by AppLayoutWithNavbar; tab navigation uses URL so navbar stays in sync */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {renderContent()}
      </main>

      {/* Modals */}
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
          const founderData: FounderApplication = {
            id: interest.id,
            founder_name: interest.founder_name || "Unknown Founder",
            company_name: interest.company_name || "Unknown Company",
            vertical: interest.vertical || "",
            stage: interest.stage || "",
            location: interest.location || "",
            website: null,
            business_model: "",
            funding_goal: interest.funding_goal || "",
            traction: "",
            created_at: interest.created_at,
            user_id: userId,
          };
          setSelectedStartup(founderData);
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
          const founderData: FounderApplication = {
            id: sync.id,
            founder_name: sync.founder_name || "Unknown Founder",
            company_name: sync.company_name || "Unknown Company",
            vertical: sync.vertical || "",
            stage: sync.stage || "",
            location: sync.location || "",
            website: null,
            business_model: "",
            funding_goal: "",
            traction: "",
            created_at: sync.created_at,
            user_id: userId,
          };
          setSelectedStartup(founderData);
          setMemoModalOpen(true);
        }}
        onMessage={(userId, sync) => {
          setSyncsModalOpen(false);
          setInitialContactUserId(userId);
          setMessagesModalOpen(true);
          handleOpenMessages();
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
          const founderData: FounderApplication = {
            id: item.id,
            founder_name: item.founder_name || "Unknown Founder",
            company_name: item.company_name || "Unknown Company",
            vertical: item.vertical || "",
            stage: item.stage || "",
            location: item.location || "",
            website: null,
            business_model: "",
            funding_goal: "",
            traction: "",
            created_at: item.created_at,
            user_id: userId,
          };
          setSelectedStartup(founderData);
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
        activeSyncs={activeSyncs.map(sync => ({
          id: sync.id,
          other_user_id: sync.other_user_id,
          company_name: sync.company_name,
          founder_name: sync.founder_name,
          calendly_link: sync.calendly_link
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
