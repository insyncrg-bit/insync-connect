import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { InvestorSidebar } from "@/components/InvestorSidebar";
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
  Filter
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

export default function InvestorDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [applications, setApplications] = useState<FounderApplication[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const currentTab = searchParams.get("tab") || "dashboard";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
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

  const StartupCard = ({ app }: { app: FounderApplication }) => (
    <Card className="bg-navy-card border-white/10 p-6 hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300 group cursor-pointer">
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
        <Button size="icon" variant="ghost" className="text-white/40 hover:text-red-400 hover:bg-red-500/10">
          <Heart className="h-5 w-5" />
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
        <Button size="sm" variant="ghost" className="text-[hsl(var(--cyan-glow))] hover:bg-white/5">
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );

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
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                First Look. First Move.
              </h2>
              <p className="text-white/60 mb-3">
                Where bold ideas meet strategic capital
              </p>
              <button 
                onClick={() => navigate("/investor-thesis")}
                className="text-[hsl(var(--cyan-glow))] hover:text-[hsl(var(--cyan-glow))]/80 text-sm font-medium underline underline-offset-4 transition-colors"
              >
                View Your Investment Thesis →
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/20 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{applications.length}</p>
                    <p className="text-sm text-white/60">Active Startups</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-navy-card border-white/10 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">0</p>
                    <p className="text-sm text-white/60">Saved</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-navy-card border-white/10 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[hsl(var(--cyan-bright))]/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-[hsl(var(--cyan-bright))]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">0</p>
                    <p className="text-sm text-white/60">Connections</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-navy-card border-white/10 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white/80" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{events.length}</p>
                    <p className="text-sm text-white/60">Upcoming Events</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card 
                className="bg-gradient-to-br from-[hsl(var(--cyan-glow))]/20 to-[hsl(var(--primary))]/20 border-[hsl(var(--cyan-glow))]/30 p-6 cursor-pointer hover:border-[hsl(var(--cyan-glow))]/50 transition-all"
                onClick={() => navigate("/investor-dashboard?tab=startups")}
              >
                <h3 className="text-xl font-bold text-white mb-2">🚀 Browse Startups</h3>
                <p className="text-white/70 mb-4">Discover new investment opportunities</p>
                <Button size="sm" className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))]">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>

              <Card 
                className="bg-gradient-to-br from-[hsl(var(--navy-deep))]/50 to-[hsl(var(--cyan-glow))]/10 border-[hsl(var(--cyan-glow))]/20 p-6 cursor-pointer hover:border-[hsl(var(--cyan-glow))]/40 transition-all"
                onClick={() => navigate("/investor-dashboard?tab=events")}
              >
                <h3 className="text-xl font-bold text-white mb-2">📅 Upcoming Events</h3>
                <p className="text-white/70 mb-4">Join pitch sessions and networking events</p>
                <Button size="sm" className="bg-white/10 text-white hover:bg-white/20 border border-white/20">
                  View Events <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </div>

            {/* Recent Startups Preview */}
            {applications.length > 0 && (
              <section>
                <div className="flex items-center justify-center mb-6 gap-4">
                  <h3 className="text-2xl font-bold text-white">Recent Startups</h3>
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
                  {applications.slice(0, 3).map((app) => (
                    <StartupCard key={app.id} app={app} />
                  ))}
                </div>
              </section>
            )}
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
    </SidebarProvider>
  );
}
