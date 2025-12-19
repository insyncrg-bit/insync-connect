import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { InvestorSidebar } from "@/components/InvestorSidebar";
import { InvestorThesisModal } from "@/components/InvestorThesisModal";
import { InterestsModal } from "@/components/InterestsModal";
import { SyncsModal } from "@/components/SyncsModal";
import { PendingModal } from "@/components/PendingModal";
import { MessagesModal } from "@/components/MessagesModal";
import { 
  Building2, 
  Calendar, 
  TrendingUp, 
  Eye, 
  Heart,
  MapPin,
  Globe,
  DollarSign,
  ArrowRight,
  Menu,
  Search,
  Filter,
  MessageSquare,
  Check,
  X,
  Loader2,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

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

interface InvestorApplication {
  id: string;
  firm_name: string;
  firm_description: string | null;
  thesis_statement: string | null;
  sub_themes: string[];
  fast_signals: string[];
  hard_nos: string[];
  check_sizes: string[];
  stage_focus: string[];
  sector_tags: string[];
  customer_types: string[];
  lead_follow: string | null;
  operating_support: string[];
  support_style: string | null;
  hq_location: string | null;
  aum: string | null;
  fund_type: string | null;
  geographic_focus: string | null;
  b2b_b2c: string | null;
  revenue_models: string[];
  minimum_traction: string[];
  board_involvement: string | null;
  decision_process: string | null;
  time_to_decision: string | null;
}

interface ConnectionStats {
  interests: number; // founders who want to sync with this investor
  syncs: number; // mutual connections
  pending: number; // investor's pending requests to founders
}

export default function InvestorDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [applications, setApplications] = useState<FounderApplication[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [thesisModalOpen, setThesisModalOpen] = useState(false);
  const [investorApplication, setInvestorApplication] = useState<InvestorApplication | null>(null);
  const [thesisLoading, setThesisLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [connectionStats, setConnectionStats] = useState<ConnectionStats>({ interests: 0, syncs: 0, pending: 0 });
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
  const [requestingSync, setRequestingSync] = useState<string | null>(null);
  
  // Interests modal state
  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const [incomingInterests, setIncomingInterests] = useState<any[]>([]);
  const [interestsLoading, setInterestsLoading] = useState(false);
  const [processingInterestId, setProcessingInterestId] = useState<string | null>(null);

  // Syncs modal state
  const [syncsModalOpen, setSyncsModalOpen] = useState(false);
  const [activeSyncs, setActiveSyncs] = useState<any[]>([]);
  const [syncsLoading, setSyncsLoading] = useState(false);

  // Pending modal state
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [outgoingPending, setOutgoingPending] = useState<any[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Messages modal state
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [messageThreads, setMessageThreads] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Demo data for modals
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

  const currentTab = searchParams.get("tab") || "dashboard";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchInvestorThesis = async () => {
    setThesisLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // If user is logged in, try to fetch their application
      if (user) {
        const { data, error } = await supabase
          .from("investor_applications")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!error && data) {
          setInvestorApplication({
            ...data,
            sub_themes: (data.sub_themes as string[]) || [],
            fast_signals: (data.fast_signals as string[]) || [],
            hard_nos: (data.hard_nos as string[]) || [],
            check_sizes: (data.check_sizes as string[]) || [],
            stage_focus: (data.stage_focus as string[]) || [],
            sector_tags: (data.sector_tags as string[]) || [],
            customer_types: (data.customer_types as string[]) || [],
            operating_support: (data.operating_support as string[]) || [],
            revenue_models: (data.revenue_models as string[]) || [],
            minimum_traction: (data.minimum_traction as string[]) || [],
          });
        }
      }
      // Always open the modal - it will show sample data if no application exists
      setThesisModalOpen(true);
    } catch (error) {
      console.error("Error fetching thesis:", error);
      // Still open modal with sample data on error
      setThesisModalOpen(true);
    } finally {
      setThesisLoading(false);
    }
  };

  // Demo curated startups for preview
  const demoStartups: FounderApplication[] = [
    {
      id: "demo-1",
      founder_name: "Sarah Chen",
      company_name: "NeuralFlow AI",
      vertical: "AI/ML Infrastructure",
      stage: "Seed",
      location: "San Francisco, CA",
      website: "https://neuralflow.ai",
      business_model: "B2B SaaS platform enabling enterprises to deploy and manage ML models at scale with automated MLOps pipelines.",
      funding_goal: "$3M",
      traction: "$120K ARR, 15 enterprise customers",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-2",
      founder_name: "Marcus Johnson",
      company_name: "ClimateLedger",
      vertical: "Climate Tech",
      stage: "Pre-seed",
      location: "Austin, TX",
      website: "https://climateledger.io",
      business_model: "Carbon credit verification platform using blockchain for transparent ESG reporting and compliance.",
      funding_goal: "$1.5M",
      traction: "3 pilot customers, LOIs from 2 Fortune 500 companies",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-3",
      founder_name: "Priya Patel",
      company_name: "MedSync Health",
      vertical: "Digital Health",
      stage: "Seed",
      location: "Boston, MA",
      website: "https://medsynchealth.com",
      business_model: "AI-powered patient engagement platform reducing hospital readmissions through predictive analytics and care coordination.",
      funding_goal: "$4M",
      traction: "$280K ARR, partnerships with 8 hospital systems",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-4",
      founder_name: "David Kim",
      company_name: "FinanceOS",
      vertical: "Fintech",
      stage: "Series A",
      location: "New York, NY",
      website: "https://financeos.com",
      business_model: "Embedded finance infrastructure enabling any SaaS company to offer banking, lending, and payment services to their customers.",
      funding_goal: "$12M",
      traction: "$1.2M ARR, 45 platform customers, $50M in transaction volume",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-5",
      founder_name: "Elena Rodriguez",
      company_name: "SupplyChain360",
      vertical: "Supply Chain & Logistics",
      stage: "Seed",
      location: "Miami, FL",
      website: "https://supplychain360.io",
      business_model: "Real-time supply chain visibility platform with AI-driven demand forecasting for mid-market manufacturers.",
      funding_goal: "$2.5M",
      traction: "$90K ARR, 12 manufacturing customers",
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-6",
      founder_name: "James Wright",
      company_name: "EdTech Pro",
      vertical: "Education Technology",
      stage: "Pre-seed",
      location: "Seattle, WA",
      website: "https://edtechpro.com",
      business_model: "Personalized learning platform using AI tutors to help K-12 students master STEM subjects at their own pace.",
      funding_goal: "$1M",
      traction: "5,000 MAU, 92% student satisfaction score",
      created_at: new Date().toISOString(),
    },
  ];

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }

      // Fetch founder applications (in a real app, this would have proper RLS for investors)
      const { data: appsData } = await supabase
        .from("founder_applications")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      
      setApplications(appsData || []);

      // Fetch events
      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(5);
      
      setEvents(eventsData || []);

      // Fetch connection stats for the investor
      if (user) {
        await fetchConnectionStats(user.id);
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchConnectionStats = async (userId: string) => {
    try {
      // Fetch all connection requests involving this investor
      const { data: connections, error } = await supabase
        .from("connection_requests")
        .select("*")
        .or(`requester_user_id.eq.${userId},target_user_id.eq.${userId}`);

      if (error) {
        console.error("Error fetching connections:", error);
        return;
      }

      // Calculate stats
      // Interests: founders who requested to sync with this investor (pending requests where investor is target)
      const interests = (connections || []).filter(
        c => c.target_user_id === userId && c.requester_type === 'founder' && c.status === 'pending'
      ).length;

      // Syncs: mutual connections (accepted requests)
      const syncs = (connections || []).filter(c => c.status === 'accepted').length;

      // Pending: investor's pending requests to founders (investor is requester, status pending)
      const pending = (connections || []).filter(
        c => c.requester_user_id === userId && c.requester_type === 'investor' && c.status === 'pending'
      ).length;

      // Track which founder user_ids the investor has already requested
      const pendingFounderIds = new Set(
        (connections || [])
          .filter(c => c.requester_user_id === userId && c.requester_type === 'investor')
          .map(c => c.target_user_id)
      );

      setConnectionStats({ interests, syncs, pending });
      setPendingRequests(pendingFounderIds);
    } catch (error) {
      console.error("Error calculating connection stats:", error);
    }
  };

  const handleRequestSync = async (founderUserId: string, companyName: string) => {
    if (!currentUserId) {
      toast({
        title: "Login required",
        description: "Please log in to request a sync",
        variant: "destructive",
      });
      return;
    }

    if (!founderUserId) {
      toast({
        title: "Demo startup",
        description: "This is a demo startup. Real sync requests require actual founder data.",
      });
      return;
    }

    setRequestingSync(founderUserId);
    try {
      const { error } = await supabase
        .from("connection_requests")
        .insert({
          requester_user_id: currentUserId,
          requester_type: 'investor',
          target_user_id: founderUserId,
          target_type: 'founder',
          status: 'pending'
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already requested",
            description: `You've already sent a sync request to ${companyName}`,
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Sync requested!",
          description: `Your request to connect with ${companyName} has been sent.`,
        });
        setPendingRequests(prev => new Set([...prev, founderUserId]));
        setConnectionStats(prev => ({ ...prev, pending: prev.pending + 1 }));
      }
    } catch (error) {
      console.error("Error requesting sync:", error);
      toast({
        title: "Error",
        description: "Failed to send sync request",
        variant: "destructive",
      });
    } finally {
      setRequestingSync(null);
    }
  };

  const fetchIncomingInterests = async () => {
    if (!currentUserId) return;
    setInterestsLoading(true);
    try {
      const { data: connections } = await supabase
        .from("connection_requests")
        .select("*")
        .eq("target_user_id", currentUserId)
        .eq("requester_type", "founder")
        .eq("status", "pending");

      if (connections && connections.length > 0) {
        const founderIds = connections.map(c => c.requester_user_id);
        const { data: founders } = await supabase
          .from("founder_applications")
          .select("user_id, company_name, founder_name, vertical, stage, location, funding_goal")
          .in("user_id", founderIds);

        const enriched = connections.map(conn => ({
          id: conn.id,
          requester_user_id: conn.requester_user_id,
          sync_note: conn.sync_note as string | null,
          created_at: conn.created_at,
          ...(founders?.find(f => f.user_id === conn.requester_user_id) || {})
        }));
        setIncomingInterests(enriched);
      } else {
        setIncomingInterests([]);
      }
    } catch (error) {
      console.error("Error fetching interests:", error);
    } finally {
      setInterestsLoading(false);
    }
  };

  const handleOpenInterests = () => {
    setInterestsModalOpen(true);
    if (currentUserId) {
      fetchIncomingInterests();
    } else {
      // Show demo data for preview
      setInterestsLoading(true);
      setTimeout(() => {
        setIncomingInterests(demoInterests);
        setInterestsLoading(false);
      }, 500);
    }
  };

  const handleAcceptInterest = async (requestId: string) => {
    setProcessingInterestId(requestId);
    try {
      await supabase.from("connection_requests").update({ status: "accepted" }).eq("id", requestId);
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
      await supabase.from("connection_requests").update({ status: "declined" }).eq("id", requestId);
      toast({ title: "Connection declined" });
      setIncomingInterests(prev => prev.filter(i => i.id !== requestId));
      setConnectionStats(prev => ({ ...prev, interests: prev.interests - 1 }));
    } catch (error) {
      toast({ title: "Error", description: "Failed to decline", variant: "destructive" });
    } finally {
      setProcessingInterestId(null);
    }
  };

  const fetchActiveSyncs = async () => {
    if (!currentUserId) return;
    setSyncsLoading(true);
    try {
      const { data: connections } = await supabase
        .from("connection_requests")
        .select("*")
        .eq("status", "accepted")
        .or(`requester_user_id.eq.${currentUserId},target_user_id.eq.${currentUserId}`);

      if (connections && connections.length > 0) {
        // Get founder user_ids (the other party)
        const founderIds = connections.map(c => 
          c.requester_user_id === currentUserId ? c.target_user_id : c.requester_user_id
        );
        
        const { data: founders } = await supabase
          .from("founder_applications")
          .select("user_id, company_name, founder_name, vertical, stage, location")
          .in("user_id", founderIds);

        const enriched = connections.map(conn => {
          const otherUserId = conn.requester_user_id === currentUserId ? conn.target_user_id : conn.requester_user_id;
          return {
            id: conn.id,
            other_user_id: otherUserId,
            other_user_type: 'founder',
            created_at: conn.updated_at || conn.created_at,
            ...(founders?.find(f => f.user_id === otherUserId) || {})
          };
        });
        setActiveSyncs(enriched);
      } else {
        setActiveSyncs([]);
      }
    } catch (error) {
      console.error("Error fetching syncs:", error);
    } finally {
      setSyncsLoading(false);
    }
  };

  const handleOpenSyncs = () => {
    setSyncsModalOpen(true);
    if (currentUserId) {
      fetchActiveSyncs();
    } else {
      // Show demo data for preview
      setSyncsLoading(true);
      setTimeout(() => {
        setActiveSyncs(demoSyncs);
        setSyncsLoading(false);
      }, 500);
    }
  };

  const fetchOutgoingPending = async () => {
    if (!currentUserId) return;
    setPendingLoading(true);
    try {
      const { data: connections } = await supabase
        .from("connection_requests")
        .select("*")
        .eq("requester_user_id", currentUserId)
        .eq("requester_type", "investor")
        .eq("status", "pending");

      if (connections && connections.length > 0) {
        const founderIds = connections.map(c => c.target_user_id);
        
        const { data: founders } = await supabase
          .from("founder_applications")
          .select("user_id, company_name, founder_name, vertical, stage, location")
          .in("user_id", founderIds);

        const enriched = connections.map(conn => ({
          id: conn.id,
          target_user_id: conn.target_user_id,
          sync_note: conn.sync_note,
          created_at: conn.created_at,
          ...(founders?.find(f => f.user_id === conn.target_user_id) || {})
        }));
        setOutgoingPending(enriched);
      } else {
        setOutgoingPending([]);
      }
    } catch (error) {
      console.error("Error fetching pending:", error);
    } finally {
      setPendingLoading(false);
    }
  };

  const handleOpenPending = () => {
    setPendingModalOpen(true);
    if (currentUserId) {
      fetchOutgoingPending();
    } else {
      // Show demo data for preview
      setPendingLoading(true);
      setTimeout(() => {
        setOutgoingPending(demoPending);
        setPendingLoading(false);
      }, 500);
    }
  };

  const handleCancelPending = async (requestId: string) => {
    setCancellingId(requestId);
    try {
      await supabase.from("connection_requests").delete().eq("id", requestId);
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

  // Get display counts (show demo counts when no real data)
  const displayStats = {
    interests: connectionStats.interests || (currentUserId ? 0 : demoInterests.length),
    syncs: connectionStats.syncs || (currentUserId ? 0 : demoSyncs.length),
    pending: connectionStats.pending || (currentUserId ? 0 : demoPending.length),
    messages: currentUserId ? 0 : demoMessages.reduce((acc, t) => acc + t.unread_count, 0),
  };

  const curatedStartups = applications.length > 0 ? applications : demoStartups;

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const StartupCard = ({ app }: { app: FounderApplication }) => {
    const isRequested = app.user_id ? pendingRequests.has(app.user_id) : false;
    const isRequesting = requestingSync === app.user_id;

    return (
      <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-6 shadow-[0_0_20px_hsl(var(--cyan-glow)/0.15)] hover:shadow-[0_0_30px_hsl(var(--cyan-glow)/0.25)] transition-all duration-300 group cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shrink-0">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">
                {app.company_name}
              </h4>
              <p className="text-sm text-white/60">{app.founder_name}</p>
            </div>
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className={isRequested 
              ? "text-green-400 bg-green-500/10 cursor-default" 
              : "text-white/40 hover:text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10"
            }
            onClick={(e) => {
              e.stopPropagation();
              if (!isRequested && !isRequesting && app.user_id) {
                handleRequestSync(app.user_id, app.company_name);
              }
            }}
            disabled={isRequested || isRequesting}
          >
            {isRequesting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isRequested ? (
              <Check className="h-5 w-5" />
            ) : (
              <TrendingUp className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/20">
            {app.vertical}
          </Badge>
          <Badge className={getStageColor(app.stage)}>
            {app.stage}
          </Badge>
        </div>

        <p className="text-sm text-white/70 mb-4 line-clamp-2">{app.business_model}</p>

        <div className="flex items-center gap-4 text-sm text-white/50 mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {app.location}
          </span>
          {app.website && (
            <span className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              Website
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-[hsl(var(--cyan-glow))]" />
            <span className="text-white/70">Raising: </span>
            <span className="text-white font-medium">{app.funding_goal}</span>
          </div>
          {isRequested ? (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Sync Requested
            </Badge>
          ) : (
            <Button 
              size="sm" 
              className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/20 border border-[hsl(var(--cyan-glow))]/30"
              onClick={(e) => {
                e.stopPropagation();
                if (app.user_id) {
                  handleRequestSync(app.user_id, app.company_name);
                } else {
                  toast({
                    title: "Demo startup",
                    description: "This is a demo startup for preview purposes.",
                  });
                }
              }}
              disabled={isRequesting}
            >
              {isRequesting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <TrendingUp className="mr-2 h-4 w-4" />
              )}
              Request Sync
            </Button>
          )}
        </div>
      </Card>
    );
  };

  const renderContent = () => {
    switch (currentTab) {
      case "startups":
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">Browse Startups</h2>
                <p className="text-white/60">Discover promising investment opportunities</p>
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

      case "saved":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Saved Startups</h2>
              <p className="text-white/60">Your bookmarked investment opportunities</p>
            </div>
            <Card className="bg-navy-card border-white/10 p-12 text-center">
              <Heart className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No saved startups yet</h3>
              <p className="text-white/60 mb-4">Start browsing and save startups you're interested in</p>
              <Button 
                onClick={() => navigate("/investor-dashboard?tab=startups")}
                className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-bright))]"
              >
                Browse Startups
              </Button>
            </Card>
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
                  <Card key={event.id} className="bg-navy-card border-white/10 p-6">
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

      case "profile":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Profile Settings</h2>
              <p className="text-white/60">Manage your investor profile</p>
            </div>
            <Card className="bg-navy-card border-white/10 p-6">
              <p className="text-white/60">Profile settings coming soon...</p>
            </Card>
          </div>
        );

      default:
        return (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {investorApplication?.firm_name || "Investor"} Dashboard
              </h2>
              <p className="text-white/60">
                Discover and connect with promising startups
              </p>
            </div>

            {/* Thesis Quick View */}
            <Card 
              className="bg-[hsl(var(--navy-deep))]/80 border-[hsl(var(--cyan-glow))]/30 p-6 mb-8 cursor-pointer shadow-[0_0_20px_hsl(var(--cyan-glow)/0.15)] hover:shadow-[0_0_30px_hsl(var(--cyan-glow)/0.25)] transition-all duration-300"
              onClick={fetchInvestorThesis}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white/70" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{investorApplication?.firm_name || "Your Thesis"}</h3>
                    <p className="text-white/50 text-sm">
                      {investorApplication?.stage_focus?.slice(0, 2).join(" • ") || "Investment Thesis"} 
                      {investorApplication?.check_sizes?.[0] && ` • ${investorApplication.check_sizes[0]}`}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/5">
                  View Thesis <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Thesis Modal */}
            <InvestorThesisModal 
              open={thesisModalOpen} 
              onOpenChange={setThesisModalOpen}
              application={investorApplication}
              loading={thesisLoading}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card 
                className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-6 shadow-[0_0_20px_hsl(var(--cyan-glow)/0.15)] hover:shadow-[0_0_30px_hsl(var(--cyan-glow)/0.25)] transition-all duration-300 cursor-pointer"
                onClick={handleOpenInterests}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{displayStats.interests}</p>
                    <p className="text-sm text-white/60">Interests</p>
                  </div>
                </div>
              </Card>

              <Card 
                className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-6 shadow-[0_0_20px_hsl(var(--cyan-glow)/0.15)] hover:shadow-[0_0_30px_hsl(var(--cyan-glow)/0.25)] transition-all duration-300 cursor-pointer"
                onClick={handleOpenSyncs}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{displayStats.syncs}</p>
                    <p className="text-sm text-white/60">Syncs</p>
                  </div>
                </div>
              </Card>

              <Card 
                className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-6 shadow-[0_0_20px_hsl(var(--cyan-glow)/0.15)] hover:shadow-[0_0_30px_hsl(var(--cyan-glow)/0.25)] transition-all duration-300 cursor-pointer"
                onClick={handleOpenPending}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{displayStats.pending}</p>
                    <p className="text-sm text-white/60">Pending</p>
                  </div>
                </div>
              </Card>

              <Card 
                className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-6 shadow-[0_0_20px_hsl(var(--cyan-glow)/0.15)] hover:shadow-[0_0_30px_hsl(var(--cyan-glow)/0.25)] transition-all duration-300 cursor-pointer"
                onClick={handleOpenMessages}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{displayStats.messages}</p>
                    <p className="text-sm text-white/60">Messages</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Curated Startups Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">Curated Startups</h3>
                  <p className="text-white/60 text-sm mt-1">Startups aligned with your thesis</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[hsl(var(--cyan-glow))] hover:bg-white/5"
                  onClick={() => navigate("/investor-dashboard?tab=startups")}
                >
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {curatedStartups.slice(0, 3).map((app) => (
                  <StartupCard key={app.id} app={app} />
                ))}
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" style={{ background: 'var(--gradient-hero)' }}>
        <InvestorSidebar />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b border-white/10 bg-navy-header flex items-center px-4 gap-4">
            <SidebarTrigger className="text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <div className="flex-1" />
            <Badge className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/30">
              Investor Portal
            </Badge>
          </header>

          {/* Content */}
          <div className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Interests Modal */}
      <InterestsModal
        open={interestsModalOpen}
        onOpenChange={setInterestsModalOpen}
        interests={incomingInterests}
        loading={interestsLoading}
        onAccept={handleAcceptInterest}
        onDecline={handleDeclineInterest}
        processingId={processingInterestId}
        userType="investor"
      />

      {/* Syncs Modal */}
      <SyncsModal
        open={syncsModalOpen}
        onOpenChange={setSyncsModalOpen}
        syncs={activeSyncs}
        loading={syncsLoading}
        userType="investor"
      />

      {/* Pending Modal */}
      <PendingModal
        open={pendingModalOpen}
        onOpenChange={setPendingModalOpen}
        pending={outgoingPending}
        loading={pendingLoading}
        onCancel={handleCancelPending}
        cancellingId={cancellingId}
        userType="investor"
      />

      {/* Messages Modal */}
      <MessagesModal
        open={messagesModalOpen}
        onOpenChange={setMessagesModalOpen}
        threads={messageThreads}
        loading={messagesLoading}
        userType="investor"
      />
    </SidebarProvider>
  );
}
