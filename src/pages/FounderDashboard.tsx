import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FounderSidebar } from "@/components/FounderSidebar";
import { MemoEditor } from "@/components/MemoEditor";
import { 
  Building2, 
  Calendar, 
  Users, 
  TrendingUp, 
  Eye, 
  Heart,
  ArrowRight,
  Menu,
  Check,
  X,
  Loader2,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Investor {
  id: string;
  name: string;
  firm_name: string;
  check_size: string;
  investment_stage: string;
  sectors: string[];
  bio: string;
  portfolio_count: number;
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

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  bio: string;
  available: boolean;
}

interface ConnectionStats {
  interests: number; // investors who want to sync with this founder
  syncs: number; // mutual connections
  pending: number; // founder's pending requests to investors
}

interface ConnectionRequest {
  id: string;
  requester_user_id: string;
  requester_type: string;
  target_user_id: string;
  target_type: string;
  status: string;
  created_at: string;
}

export default function FounderDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [connectionStats, setConnectionStats] = useState<ConnectionStats>({ interests: 0, syncs: 0, pending: 0 });
  const [incomingInterests, setIncomingInterests] = useState<ConnectionRequest[]>([]);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

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

      const { data: investorsData } = await supabase
        .from("investors")
        .select("*")
        .eq("active", true)
        .limit(6);
      
      setInvestors((investorsData || []).map(inv => ({
        ...inv,
        sectors: Array.isArray(inv.sectors) ? inv.sectors as string[] : []
      })));

      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(3);
      
      setEvents(eventsData || []);

      const { data: mentorsData } = await supabase
        .from("mentors")
        .select("*")
        .eq("available", true)
        .limit(3);
      
      setMentors((mentorsData || []).map(mentor => ({
        ...mentor,
        expertise: Array.isArray(mentor.expertise) ? mentor.expertise as string[] : []
      })));

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

      setConnectionStats({ interests, syncs, pending });
      setIncomingInterests((connections || []).filter(
        c => c.target_user_id === userId && c.requester_type === 'investor' && c.status === 'pending'
      ));
    } catch (error) {
      console.error("Error fetching connection stats:", error);
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
              {investors.map((investor) => (
                <Card key={investor.id} className="bg-navy-card border-white/10 p-6 hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white mb-1">{investor.name}</h4>
                      <p className="text-sm text-white/60">{investor.firm_name}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/20">{investor.check_size}</Badge>
                    <Badge className="bg-white/10 text-white/80 border-white/20">{investor.investment_stage}</Badge>
                  </div>
                  <p className="text-sm text-white/70 mb-4 line-clamp-2">{investor.bio}</p>
                  <Button size="sm" variant="ghost" className="text-[hsl(var(--cyan-glow))] hover:bg-white/5">
                    View Profile
                  </Button>
                </Card>
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
                Welcome back, {application?.founder_name?.split(" ")[0] || "Founder"}!
              </h2>
              <p className="text-white/60">
                Track your connections, engagement, and opportunities
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-6 shadow-[0_0_20px_hsl(var(--cyan-glow)/0.15)] hover:shadow-[0_0_30px_hsl(var(--cyan-glow)/0.25)] transition-all duration-300 cursor-pointer">
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

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card 
                className="bg-gradient-to-br from-[hsl(var(--cyan-glow))]/20 to-[hsl(var(--primary))]/20 border-[hsl(var(--cyan-glow))]/30 p-6 cursor-pointer hover:border-[hsl(var(--cyan-glow))]/50 transition-all"
                onClick={() => navigate("/founder-dashboard?tab=memo")}
              >
                <h3 className="text-xl font-bold text-white mb-2">📄 View Your Memo</h3>
                <p className="text-white/70 mb-4">Review and update your company information</p>
                <Button size="sm" className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))]">
                  Edit Memo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>

              <Card 
                className="bg-gradient-to-br from-[hsl(var(--navy-deep))]/50 to-[hsl(var(--cyan-glow))]/10 border-[hsl(var(--cyan-glow))]/20 p-6 cursor-pointer hover:border-[hsl(var(--cyan-glow))]/40 transition-all"
                onClick={() => navigate("/founder-dashboard?tab=investors")}
              >
                <h3 className="text-xl font-bold text-white mb-2">🎯 Curated Investors</h3>
                <p className="text-white/70 mb-4">Browse investors matched to your profile</p>
                <Button size="sm" className="bg-white/10 text-white hover:bg-white/20 border border-white/20">
                  View Investors <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </div>

            {/* Recent Investors Preview */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Recent Investors</h3>
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
                {investors.slice(0, 3).map((investor) => (
                  <Card key={investor.id} className="bg-navy-card border-white/10 p-6 hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white mb-1">{investor.name}</h4>
                        <p className="text-sm text-white/60">{investor.firm_name}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/20">{investor.check_size}</Badge>
                      <Badge className="bg-white/10 text-white/80 border-white/20">{investor.investment_stage}</Badge>
                    </div>
                    <Button size="sm" variant="ghost" className="text-[hsl(var(--cyan-glow))] hover:bg-white/5">
                      View Profile
                    </Button>
                  </Card>
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
              {application?.company_name || "Demo Mode"}
            </Badge>
          </header>

          {/* Content */}
          <div className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
