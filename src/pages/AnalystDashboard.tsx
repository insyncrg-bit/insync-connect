import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InvestorThesisModal } from "@/components/InvestorThesisModal";
import { ProfileSettings } from "@/components/ProfileSettings";
import { InterestsModal } from "@/components/InterestsModal";
import { SyncsModal } from "@/components/SyncsModal";
import { PendingModal } from "@/components/PendingModal";
import { MessagesModal } from "@/components/MessagesModal";
import { MemoModal } from "@/components/MemoModal";
import { MatchScoreBadge } from "@/components/MatchScoreBadge";
import { AnalystProfileModal } from "@/components/AnalystProfileModal";
import syncsLogo from "@/assets/syncs-logo.png";

import { useMatchmaking, MatchResult } from "@/hooks/useMatchmaking";
import { useMessages } from "@/hooks/useMessages";
import { 
  Building2, 
  Calendar, 
  Eye, 
  Heart,
  MapPin,
  DollarSign,
  ArrowRight,
  Search,
  Filter,
  MessageSquare,
  Check,
  Loader2,
  FileText,
  Sparkles,
  UserCog
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface AnalystProfile {
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
  interests: number;
  syncs: number;
  pending: number;
}

export default function AnalystDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [applications, setApplications] = useState<FounderApplication[]>([]);
  const [matchedStartups, setMatchedStartups] = useState<MatchResult[]>([]);
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
  
  // Analyst profile state
  const [analystProfile, setAnalystProfile] = useState<AnalystProfile | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [showMandatoryProfileModal, setShowMandatoryProfileModal] = useState(false);
  
  // Matchmaking hook
  const { matches, loading: matchLoading, error: matchError, fetchMatches } = useMatchmaking();
  
  // Messages hook
  const { threads: realThreads, loading: realMessagesLoading, sendMessage, markAsRead, fetchThreads } = useMessages(currentUserId, "investor");
  
  // Modal states
  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const [incomingInterests, setIncomingInterests] = useState<any[]>([]);
  const [interestsLoading, setInterestsLoading] = useState(false);
  const [processingInterestId, setProcessingInterestId] = useState<string | null>(null);

  const [syncsModalOpen, setSyncsModalOpen] = useState(false);
  const [activeSyncs, setActiveSyncs] = useState<any[]>([]);
  const [syncsLoading, setSyncsLoading] = useState(false);

  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [outgoingPending, setOutgoingPending] = useState<any[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [messageThreads, setMessageThreads] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [memoModalOpen, setMemoModalOpen] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState<FounderApplication | null>(null);

  const currentTab = searchParams.get("tab") || "dashboard";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchMatches('investor', currentUserId);
    }
  }, [currentUserId, fetchMatches]);

  useEffect(() => {
    if (matches.length > 0) {
      setMatchedStartups(matches);
    }
  }, [matches]);

  const fetchAnalystProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("analyst_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      setAnalystProfile(data as AnalystProfile);
      
      // Check if profile is incomplete - show mandatory modal
      if (!data.profile_completed) {
        setShowMandatoryProfileModal(true);
      }
    } else {
      // No analyst profile - redirect to analyst auth
      navigate("/analyst-auth");
    }
  };

  const fetchFirmThesis = async (firmId: string) => {
    const { data, error } = await supabase
      .from("investor_applications")
      .select("*")
      .eq("id", firmId)
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
  };

  const fetchInvestorThesis = async () => {
    setThesisLoading(true);
    try {
      if (analystProfile?.firm_id) {
        await fetchFirmThesis(analystProfile.firm_id);
      }
      setThesisModalOpen(true);
    } catch (error) {
      console.error("Error fetching thesis:", error);
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
      business_model: "B2B SaaS platform enabling enterprises to deploy and manage ML models at scale.",
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
      business_model: "Carbon credit verification platform using blockchain for transparent ESG reporting.",
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
      business_model: "AI-powered patient engagement platform reducing hospital readmissions.",
      funding_goal: "$4M",
      traction: "$280K ARR, partnerships with 8 hospital systems",
      created_at: new Date().toISOString(),
    },
  ];

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        await fetchAnalystProfile(user.id);
      } else {
        navigate("/analyst-auth");
        return;
      }

      const { data: appsData } = await supabase
        .from("founder_applications")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      
      setApplications(appsData || []);

      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(5);
      
      setEvents(eventsData || []);

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

  // Fetch firm thesis when analyst profile is loaded
  useEffect(() => {
    if (analystProfile?.firm_id) {
      fetchFirmThesis(analystProfile.firm_id);
    }
  }, [analystProfile?.firm_id]);

  const fetchConnectionStats = async (userId: string) => {
    try {
      const { data: connections, error } = await supabase
        .from("connection_requests")
        .select("*")
        .or(`requester_user_id.eq.${userId},target_user_id.eq.${userId}`);

      if (error) {
        console.error("Error fetching connections:", error);
        return;
      }

      const interests = (connections || []).filter(
        c => c.target_user_id === userId && c.requester_type === 'founder' && c.status === 'pending'
      ).length;

      const syncs = (connections || []).filter(c => c.status === 'accepted').length;

      const pending = (connections || []).filter(
        c => c.requester_user_id === userId && c.requester_type === 'investor' && c.status === 'pending'
      ).length;

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

  // Modal handlers (same as InvestorDashboard)
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
    fetchIncomingInterests();
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
    fetchActiveSyncs();
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
    fetchOutgoingPending();
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
    fetchThreads();
  };

  const displayThreads = realThreads;
  const displayMessagesLoading = realMessagesLoading;

  const displayStats = {
    interests: connectionStats.interests,
    syncs: connectionStats.syncs,
    pending: connectionStats.pending,
    messages: 0,
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

  const MatchedStartupCard = ({ match }: { match: MatchResult }) => {
    const founder = match.founder;
    if (!founder) return null;
    
    const isRequested = founder.user_id ? pendingRequests.has(founder.user_id) : false;

    return (
      <Card className="bg-navy-card border-white/10 p-5 shadow-[0_0_15px_rgba(6,182,212,0.08)] hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300 group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
            </div>
            <div>
              <h4 className="font-medium text-white group-hover:text-[hsl(var(--cyan-glow))] transition-colors">
                {founder.company_name}
              </h4>
              <p className="text-xs text-white/60 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {founder.location}
              </p>
            </div>
          </div>
          <MatchScoreBadge score={match.match_score} label={match.match_label} />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className={`text-xs px-2 py-0.5 rounded-full ${getStageColor(founder.stage)}`}>
            {founder.stage}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))]">
            {founder.vertical}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
            {founder.funding_goal}
          </span>
        </div>

        <p className="text-sm text-white/60 mb-4 line-clamp-2">
          {founder.business_model}
        </p>

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
                setSelectedStartup({
                  id: founder.id,
                  founder_name: founder.founder_name,
                  company_name: founder.company_name,
                  vertical: founder.vertical,
                  stage: founder.stage,
                  location: founder.location,
                  website: founder.website,
                  business_model: founder.business_model,
                  funding_goal: founder.funding_goal,
                  traction: founder.traction,
                  created_at: new Date().toISOString(),
                  user_id: founder.user_id,
                });
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
      case "startups":
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                  Curated Startups
                </h2>
                <p className="text-white/60">AI-matched startups based on {analystProfile?.firm_name}'s thesis</p>
              </div>
              <div className="flex items-center gap-3">
                {matchLoading && (
                  <div className="flex items-center gap-2 text-white/60">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Finding matches...
                  </div>
                )}
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

            {matchError && (
              <Card className="bg-amber-500/10 border-amber-500/30 p-4">
                <p className="text-amber-400 text-sm">
                  Unable to load personalized matches. Showing all startups.
                </p>
              </Card>
            )}

            {matchedStartups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedStartups.map((match) => (
                  <MatchedStartupCard key={match.id} match={match} />
                ))}
              </div>
            ) : filteredApplications.length > 0 ? (
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

      case "profile":
        return <ProfileSettings userType="investor" userId={currentUserId} />;

      default:
        return (
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Welcome Section - Personalized */}
            <div>
              <h1 className="text-4xl font-bold text-white">
                Welcome {analystProfile?.name || "Analyst"} from {analystProfile?.firm_name || "Your Firm"}!
              </h1>
              <p className="text-white/60 mt-2">{analystProfile?.title}</p>
            </div>

            {/* Thesis Quick Access */}
            <Card 
              className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300 cursor-pointer"
              onClick={fetchInvestorThesis}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <FileText className="h-7 w-7 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-white">{analystProfile?.firm_name}'s Thesis</p>
                    <p className="text-sm text-white/60">
                      {investorApplication?.stage_focus?.slice(0, 2).join(" • ") || "Seed • Series A"} 
                      {investorApplication?.sector_tags?.[0] && ` • ${investorApplication.sector_tags[0]}`}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-white/60" />
              </div>
            </Card>

            {/* Thesis Modal */}
            <InvestorThesisModal 
              open={thesisModalOpen} 
              onOpenChange={setThesisModalOpen}
              application={investorApplication}
              loading={thesisLoading}
            />

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Interests", value: displayStats.interests, icon: Heart, onClick: handleOpenInterests },
                { label: "Syncs", value: displayStats.syncs, icon: null, image: syncsLogo, onClick: handleOpenSyncs },
                { label: "Pending", value: displayStats.pending, icon: Eye, onClick: handleOpenPending },
                { label: "Messages", value: displayStats.messages, icon: MessageSquare, onClick: handleOpenMessages },
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
                      <img src={stat.image} alt={stat.label} className="h-12 w-20 object-contain" />
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
                  onClick={() => navigate("/analyst-dashboard?tab=startups")}
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

  return (
    <div className="min-h-screen flex flex-col bg-[#151a24]">
      {/* Header */}
      <header className="h-14 border-b border-white/10 bg-[hsl(var(--navy-header))] backdrop-blur-sm flex items-center px-6 gap-4">
        <h1 className="text-lg font-semibold text-white">Analyst Dashboard</h1>
        <div className="flex-1" />
        {/* Edit Profile Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setProfileModalOpen(true)}
          className="border-white/20 text-white hover:bg-white/10"
        >
          <UserCog className="h-4 w-4 mr-2" />
          Edit My Profile
        </Button>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {renderContent()}
      </main>

      {/* Analyst Profile Modal - Mandatory on first login */}
      <AnalystProfileModal
        open={showMandatoryProfileModal}
        onOpenChange={setShowMandatoryProfileModal}
        profile={analystProfile}
        onProfileUpdate={setAnalystProfile}
        isMandatory={true}
      />

      {/* Analyst Profile Modal - Edit */}
      <AnalystProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        profile={analystProfile}
        onProfileUpdate={setAnalystProfile}
        isMandatory={false}
      />

      {/* Other Modals */}
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
        onMessage={(userId) => {
          setSyncsModalOpen(false);
          setMessagesModalOpen(true);
          fetchThreads();
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
        onOpenChange={setMessagesModalOpen}
        threads={displayThreads}
        loading={displayMessagesLoading}
        userType="investor"
        onSendMessage={sendMessage}
        onMarkAsRead={markAsRead}
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
    </div>
  );
}
