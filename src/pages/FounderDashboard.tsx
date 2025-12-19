import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FounderSidebar } from "@/components/FounderSidebar";
import { MemoEditor } from "@/components/MemoEditor";
import { InvestorProfileModal } from "@/components/InvestorProfileModal";
import { InterestsModal } from "@/components/InterestsModal";
import { 
  Building2, 
  Calendar, 
  TrendingUp, 
  Eye, 
  Heart,
  ArrowRight,
  Menu,
  MessageSquare,
  MapPin,
  DollarSign,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvestorApplication {
  id: string;
  user_id: string;
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

interface InterestItem {
  id: string;
  requester_user_id: string;
  sync_note: string | null;
  created_at: string;
  firm_name?: string;
}

export default function FounderDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [curatedInvestors, setCuratedInvestors] = useState<InvestorApplication[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [connectionStats, setConnectionStats] = useState<ConnectionStats>({ interests: 0, syncs: 0, pending: 0 });
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
  
  // Modal states
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorApplication | null>(null);
  const [investorModalOpen, setInvestorModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Interests modal
  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const [incomingInterests, setIncomingInterests] = useState<InterestItem[]>([]);
  const [interestsLoading, setInterestsLoading] = useState(false);
  const [processingInterestId, setProcessingInterestId] = useState<string | null>(null);

  const currentTab = searchParams.get("tab") || "dashboard";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setCurrentUserId(user.id);
        const { data: appData } = await supabase
          .from("founder_applications")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        
        setApplication(appData);
        await fetchConnectionStats(user.id);
      } else {
        setApplication({
          id: "demo",
          founder_name: "Demo Founder",
          company_name: "Demo Startup",
          vertical: "FinTech",
          stage: "Seed",
          location: "San Francisco, CA",
          website: "https://demo.com",
          business_model: "We help businesses manage their finances more efficiently.",
          application_sections: {}
        });
      }

      // Fetch curated investor applications
      const { data: investorApps } = await supabase
        .from("investor_applications")
        .select("*")
        .eq("status", "active")
        .eq("public_profile", true)
        .limit(6);
      
      setCuratedInvestors((investorApps || []).map(inv => ({
        ...inv,
        sub_themes: (inv.sub_themes as string[]) || [],
        fast_signals: (inv.fast_signals as string[]) || [],
        hard_nos: (inv.hard_nos as string[]) || [],
        check_sizes: (inv.check_sizes as string[]) || [],
        stage_focus: (inv.stage_focus as string[]) || [],
        sector_tags: (inv.sector_tags as string[]) || [],
        customer_types: (inv.customer_types as string[]) || [],
        operating_support: (inv.operating_support as string[]) || [],
        revenue_models: (inv.revenue_models as string[]) || [],
        minimum_traction: (inv.minimum_traction as string[]) || [],
      })));

      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(3);
      
      setEvents(eventsData || []);

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
      const { data: connections } = await supabase
        .from("connection_requests")
        .select("*")
        .or(`requester_user_id.eq.${userId},target_user_id.eq.${userId}`);

      // Interests: investors who requested to sync with this founder
      const interests = (connections || []).filter(
        c => c.target_user_id === userId && c.requester_type === 'investor' && c.status === 'pending'
      ).length;

      // Syncs: mutual connections
      const syncs = (connections || []).filter(c => c.status === 'accepted').length;

      // Pending: founder's pending requests to investors
      const pending = (connections || []).filter(
        c => c.requester_user_id === userId && c.requester_type === 'founder' && c.status === 'pending'
      ).length;

      // Track which investor user_ids the founder has already requested
      const pendingInvestorIds = new Set(
        (connections || [])
          .filter(c => c.requester_user_id === userId && c.requester_type === 'founder')
          .map(c => c.target_user_id)
      );

      setConnectionStats({ interests, syncs, pending });
      setPendingRequests(pendingInvestorIds);
    } catch (error) {
      console.error("Error fetching connection stats:", error);
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
        .eq("requester_type", "investor")
        .eq("status", "pending");

      if (connections && connections.length > 0) {
        // Fetch investor details for each connection
        const investorIds = connections.map(c => c.requester_user_id);
        const { data: investors } = await supabase
          .from("investor_applications")
          .select("user_id, firm_name")
          .in("user_id", investorIds);

        const enrichedInterests = connections.map(conn => ({
          id: conn.id,
          requester_user_id: conn.requester_user_id,
          sync_note: conn.sync_note as string | null,
          created_at: conn.created_at,
          firm_name: investors?.find(i => i.user_id === conn.requester_user_id)?.firm_name || "Unknown Investor"
        }));

        setIncomingInterests(enrichedInterests);
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
      const { error } = await supabase
        .from("connection_requests")
        .update({ status: "accepted" })
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Connection accepted!",
        description: "You are now synced with this investor.",
      });

      // Update stats and list
      setIncomingInterests(prev => prev.filter(i => i.id !== requestId));
      setConnectionStats(prev => ({
        ...prev,
        interests: prev.interests - 1,
        syncs: prev.syncs + 1
      }));
    } catch (error) {
      console.error("Error accepting interest:", error);
      toast({
        title: "Error",
        description: "Failed to accept connection",
        variant: "destructive",
      });
    } finally {
      setProcessingInterestId(null);
    }
  };

  const handleDeclineInterest = async (requestId: string) => {
    setProcessingInterestId(requestId);
    try {
      const { error } = await supabase
        .from("connection_requests")
        .update({ status: "declined" })
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Connection declined",
      });

      setIncomingInterests(prev => prev.filter(i => i.id !== requestId));
      setConnectionStats(prev => ({
        ...prev,
        interests: prev.interests - 1
      }));
    } catch (error) {
      console.error("Error declining interest:", error);
      toast({
        title: "Error",
        description: "Failed to decline connection",
        variant: "destructive",
      });
    } finally {
      setProcessingInterestId(null);
    }
  };

  const handleOpenInvestorProfile = (investor: InvestorApplication) => {
    setSelectedInvestor(investor);
    setInvestorModalOpen(true);
  };

  const handleSyncWithInvestor = async (investorUserId: string, note: string) => {
    if (!currentUserId) {
      toast({
        title: "Login required",
        description: "Please log in to request a sync",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    try {
      const { error } = await supabase
        .from("connection_requests")
        .insert({
          requester_user_id: currentUserId,
          requester_type: 'founder',
          target_user_id: investorUserId,
          target_type: 'investor',
          status: 'pending',
          sync_note: note || null
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already requested",
            description: "You've already sent a sync request to this investor",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Sync requested!",
          description: "Your request has been sent to the investor.",
        });
        setPendingRequests(prev => new Set([...prev, investorUserId]));
        setConnectionStats(prev => ({ ...prev, pending: prev.pending + 1 }));
        setInvestorModalOpen(false);
      }
    } catch (error) {
      console.error("Error requesting sync:", error);
      toast({
        title: "Error",
        description: "Failed to send sync request",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const InvestorCard = ({ investor }: { investor: InvestorApplication }) => {
    const isRequested = pendingRequests.has(investor.user_id);

    return (
      <Card 
        className="bg-navy-card border-white/10 p-6 hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300 group cursor-pointer"
        onClick={() => handleOpenInvestorProfile(investor)}
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shrink-0">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">
              {investor.firm_name}
            </h4>
            {investor.hq_location && (
              <p className="text-sm text-white/60 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {investor.hq_location}
              </p>
            )}
          </div>
          {isRequested && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              Pending
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {investor.stage_focus.slice(0, 2).map((stage, i) => (
            <Badge key={i} className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/20 text-xs">
              {stage}
            </Badge>
          ))}
          {investor.check_sizes.length > 0 && (
            <Badge className="bg-white/10 text-white/80 border-white/20 text-xs flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {investor.check_sizes[0]}
            </Badge>
          )}
        </div>

        <p className="text-sm text-white/70 mb-4 line-clamp-2">
          {investor.thesis_statement || investor.firm_description || "Investment thesis not provided."}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {investor.sector_tags.slice(0, 3).map((sector, i) => (
            <Badge key={i} variant="outline" className="bg-transparent border-white/20 text-white/60 text-xs">
              {sector}
            </Badge>
          ))}
          {investor.sector_tags.length > 3 && (
            <Badge variant="outline" className="bg-transparent border-white/20 text-white/60 text-xs">
              +{investor.sector_tags.length - 3}
            </Badge>
          )}
        </div>

        <Button 
          size="sm" 
          className="w-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/20 border border-[hsl(var(--cyan-glow))]/30"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenInvestorProfile(investor);
          }}
        >
          View Thesis
        </Button>
      </Card>
    );
  };

  const renderContent = () => {
    switch (currentTab) {
      case "memo":
        return <MemoEditor application={application} onUpdate={fetchDashboardData} />;
      
      case "investors":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Curated Investors</h2>
              <p className="text-white/60">Investors matched to your company profile</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {curatedInvestors.map((investor) => (
                <InvestorCard key={investor.id} investor={investor} />
              ))}
            </div>
          </div>
        );

      case "events":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Upcoming Events</h2>
              <p className="text-white/60">Networking opportunities and pitch events</p>
            </div>
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
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Profile Settings</h2>
              <p className="text-white/60">Manage your account</p>
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
                Welcome back, {application?.company_name || application?.founder_name?.split(" ")[0] || "Founder"}!
              </h2>
              <p className="text-white/60">
                Track your connections, engagement, and opportunities
              </p>
            </div>

            {/* Memo Quick View */}
            <Card 
              className="bg-gradient-to-br from-[hsl(var(--cyan-glow))]/10 to-transparent border-[hsl(var(--cyan-glow))]/30 p-6 mb-8 cursor-pointer hover:border-[hsl(var(--cyan-glow))]/50 transition-all"
              onClick={() => navigate("/founder-dashboard?tab=memo")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[hsl(var(--cyan-glow))]/20 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{application?.company_name || "Your Memo"}</h3>
                    <p className="text-white/60 text-sm">{application?.vertical} • {application?.stage}</p>
                  </div>
                </div>
                <Button size="sm" className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))]">
                  View Memo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>

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
                    <p className="text-2xl font-bold text-white">{connectionStats.interests}</p>
                    <p className="text-sm text-white/60">Interests</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-6 shadow-[0_0_20px_hsl(var(--cyan-glow)/0.15)] hover:shadow-[0_0_30px_hsl(var(--cyan-glow)/0.25)] transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{connectionStats.syncs}</p>
                    <p className="text-sm text-white/60">Syncs</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-6 shadow-[0_0_20px_hsl(var(--cyan-glow)/0.15)] hover:shadow-[0_0_30px_hsl(var(--cyan-glow)/0.25)] transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{connectionStats.pending}</p>
                    <p className="text-sm text-white/60">Pending</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-6 shadow-[0_0_20px_hsl(var(--cyan-glow)/0.15)] hover:shadow-[0_0_30px_hsl(var(--cyan-glow)/0.25)] transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">0</p>
                    <p className="text-sm text-white/60">Messages</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Curated Investors Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">Curated Investors</h3>
                  <p className="text-white/60 text-sm mt-1">Investors aligned with your profile</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[hsl(var(--cyan-glow))] hover:bg-white/5"
                  onClick={() => navigate("/founder-dashboard?tab=investors")}
                >
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {curatedInvestors.slice(0, 3).map((investor) => (
                  <InvestorCard key={investor.id} investor={investor} />
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
        <FounderSidebar />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b border-white/10 bg-navy-header flex items-center px-4 gap-4">
            <SidebarTrigger className="text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <div className="flex-1" />
            <Badge className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/30">
              Founder Portal
            </Badge>
          </header>

          {/* Content */}
          <div className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </div>
        </main>

        {/* Modals */}
        <InvestorProfileModal
          open={investorModalOpen}
          onOpenChange={setInvestorModalOpen}
          investor={selectedInvestor}
          loading={false}
          onSync={handleSyncWithInvestor}
          isSyncing={isSyncing}
          alreadySynced={selectedInvestor ? pendingRequests.has(selectedInvestor.user_id) : false}
        />

        <InterestsModal
          open={interestsModalOpen}
          onOpenChange={setInterestsModalOpen}
          interests={incomingInterests}
          loading={interestsLoading}
          onAccept={handleAcceptInterest}
          onDecline={handleDeclineInterest}
          processingId={processingInterestId}
          userType="founder"
        />
      </div>
    </SidebarProvider>
  );
}