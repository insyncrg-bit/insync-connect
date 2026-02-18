import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  TrendingUp,
  MessageSquare,
  Calendar,
  MapPin,
  Settings,
  Loader2,
  ArrowRight
} from "lucide-react";

interface DashboardStats {
  totalAnalysts: number;
  pendingRequests: number;
  activeSyncs: number;
  messages: number;
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

export const VCDashboardContent = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalAnalysts: 0,
    pendingRequests: 0,
    activeSyncs: 0,
    messages: 0,
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [firmName, setFirmName] = useState<string>("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setFirmName("Your VC Firm");
    setStats({
      totalAnalysts: 5,
      pendingRequests: 3,
      activeSyncs: 12,
      messages: 8,
    });
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
      {
        id: "2",
        title: "Startup Pitch Day",
        description: "Watch startups pitch their ideas",
        event_type: "Pitch Event",
        location: "New York, NY",
        event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        max_attendees: 50,
      },
    ]);
    setLoading(false);
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--cyan-glow))]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Welcome, {firmName || "VC Admin"}!
        </h1>
        <p className="text-white/60 mt-2">Manage your firm and team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300">
          <div className="flex items-center gap-4">
            <Users className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
            <div>
              <p className="text-3xl font-bold text-white">{stats.totalAnalysts}</p>
              <p className="text-base text-white/60">Analysts</p>
            </div>
          </div>
        </Card>
        <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300">
          <div className="flex items-center gap-4">
            <TrendingUp className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
            <div>
              <p className="text-3xl font-bold text-white">{stats.pendingRequests}</p>
              <p className="text-base text-white/60">Pending Requests</p>
            </div>
          </div>
        </Card>
        <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300">
          <div className="flex items-center gap-4">
            <Building2 className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
            <div>
              <p className="text-3xl font-bold text-white">{stats.activeSyncs}</p>
              <p className="text-base text-white/60">Active Syncs</p>
            </div>
          </div>
        </Card>
        <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300">
          <div className="flex items-center gap-4">
            <MessageSquare className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
            <div>
              <p className="text-3xl font-bold text-white">{stats.messages}</p>
              <p className="text-base text-white/60">Messages</p>
            </div>
          </div>
        </Card>
      </div>

      {events.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card
                key={event.id}
                className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.08)] hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <Badge className="bg-white/10 text-white/80 border-white/20">
                    {event.event_type}
                  </Badge>
                </div>
                <h4 className="font-semibold text-white mb-2">{event.title}</h4>
                <p className="text-sm text-white/60 mb-4 line-clamp-2">{event.description}</p>
                <div className="space-y-2 text-sm text-white/50 mb-4">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(event.event_date)}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/20 border border-[hsl(var(--cyan-glow))]/30"
                >
                  Register
                </Button>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.08)] hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Users className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                <div>
                  <p className="font-semibold text-white">Manage Organisation</p>
                  <p className="text-sm text-white/60">View and manage your team members</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-white/60" />
            </div>
          </Card>
          <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.08)] hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Settings className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                <div>
                  <p className="font-semibold text-white">Settings</p>
                  <p className="text-sm text-white/60">Configure your firm settings</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-white/60" />
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
