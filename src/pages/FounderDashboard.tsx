import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Calendar, 
  Users, 
  TrendingUp, 
  Eye, 
  Mail,
  Rocket,
  ArrowRight,
  LogOut
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

export default function FounderDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Allow preview mode without auth
      if (user) {
        // Fetch application
        const { data: appData } = await supabase
          .from("founder_applications")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        setApplication(appData);
      } else {
        // Preview mode with mock data
        setApplication({
          founder_name: "Demo Founder",
          company_name: "Demo Startup",
        });
      }

      // Fetch investors
      const { data: investorsData } = await supabase
        .from("investors")
        .select("*")
        .eq("active", true)
        .limit(6);
      
      setInvestors((investorsData || []).map(inv => ({
        ...inv,
        sectors: Array.isArray(inv.sectors) ? inv.sectors as string[] : []
      })));

      // Fetch events
      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(3);
      
      setEvents(eventsData || []);

      // Fetch mentors
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
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
      <div className="min-h-screen bg-[hsl(220,60%,10%)] flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(220,60%,10%)]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[hsl(220,60%,12%)]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] rounded-lg flex items-center justify-center">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">In-Sync</h1>
                <p className="text-sm text-white/60">Founder Dashboard</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white/80 hover:text-white hover:bg-white/10">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {application?.founder_name?.split(" ")[0]}!
          </h2>
          <p className="text-white/60">
            Track your connections, engagement, and opportunities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[hsl(220,60%,15%)] border-[hsl(var(--cyan-glow))]/20 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-white/60">Profile Views</p>
              </div>
            </div>
          </Card>

          <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-white/60">Connections</p>
              </div>
            </div>
          </Card>

          <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Pending</p>
                <p className="text-sm text-white/60">Status</p>
              </div>
            </div>
          </Card>

          <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{events.length}</p>
                <p className="text-sm text-white/60">Upcoming Events</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Curated Investors */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Curated Investors</h3>
            <Button variant="ghost" size="sm" className="text-[hsl(var(--cyan-glow))] hover:bg-white/5">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investors.map((investor) => (
              <Card key={investor.id} className="bg-[hsl(220,60%,15%)] border-white/10 p-6 hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300">
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
                  <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20">
                    {investor.check_size}
                  </Badge>
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20">
                    {investor.investment_stage}
                  </Badge>
                  {investor.sectors.slice(0, 1).map((sector, i) => (
                    <Badge key={i} className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">
                      {sector}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm text-white/70 mb-4 line-clamp-2">
                  {investor.bio}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-white/50">
                    {investor.portfolio_count} portfolio companies
                  </span>
                  <Button size="sm" variant="ghost" className="text-[hsl(var(--cyan-glow))] hover:bg-white/5">
                    View Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Events */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Upcoming Events</h3>
            <Button variant="ghost" size="sm" className="text-[hsl(var(--cyan-glow))] hover:bg-white/5">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="bg-[hsl(220,60%,15%)] border-white/10 p-6 hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                    {event.event_type}
                  </Badge>
                </div>

                <h4 className="font-semibold text-white mb-2">{event.title}</h4>
                <p className="text-sm text-white/60 mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 text-sm text-white/50 mb-4">
                  <p>📍 {event.location}</p>
                  <p>📅 {formatDate(event.event_date)}</p>
                  <p>👥 {event.max_attendees} max attendees</p>
                </div>

                <Button size="sm" className="w-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/20 border border-[hsl(var(--cyan-glow))]/30">
                  Register
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Mentor Network */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Mentor Network</h3>
            <Button variant="ghost" size="sm" className="text-[hsl(var(--cyan-glow))] hover:bg-white/5">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="bg-[hsl(220,60%,15%)] border-white/10 p-6 hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white mb-1">{mentor.name}</h4>
                    <p className="text-sm text-white/60">{mentor.title}</p>
                    <p className="text-xs text-white/50">{mentor.company}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.expertise.slice(0, 2).map((skill, i) => (
                    <Badge key={i} className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm text-white/70 mb-4 line-clamp-2">
                  {mentor.bio}
                </p>

                <Button size="sm" className="w-full bg-white/5 text-white hover:bg-white/10 border border-white/10">
                  Connect
                </Button>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
