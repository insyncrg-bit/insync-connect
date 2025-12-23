import { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin,
  Eye,
  Heart,
  MessageSquare,
  Clock,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// Mock data matching actual dashboard format
const mockInvestors = [
  {
    firm_name: "Horizon Ventures",
    hq_location: "San Francisco, CA",
    stage_focus: ["Pre-seed", "Seed"],
    sector_tags: ["Enterprise SaaS", "Developer Tools"],
    check_sizes: ["$500K - $2M"],
    thesis_statement: "We invest in technical founders building software that becomes critical infrastructure for enterprises.",
    match_score: 94,
    match_label: "Strong",
  },
  {
    firm_name: "Climate Capital",
    hq_location: "New York, NY",
    stage_focus: ["Seed", "Series A"],
    sector_tags: ["Climate Tech", "Clean Energy"],
    check_sizes: ["$1M - $5M"],
    thesis_statement: "We back founders building solutions to the climate crisis with measurable carbon impact.",
    match_score: 87,
    match_label: "Good",
  },
  {
    firm_name: "HealthTech Partners",
    hq_location: "Boston, MA",
    stage_focus: ["Seed", "Series A"],
    sector_tags: ["Digital Health", "HealthTech"],
    check_sizes: ["$2M - $8M"],
    thesis_statement: "We partner with founders reimagining healthcare delivery through technology.",
    match_score: 82,
    match_label: "Good",
  },
];

const getStageColor = (stage: string) => {
  const colors: Record<string, string> = {
    "Pre-seed": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "Seed": "bg-green-500/20 text-green-400 border-green-500/30",
    "Series A": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };
  return colors[stage] || "bg-white/10 text-white/80 border-white/20";
};

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-400";
  if (score >= 80) return "text-cyan-glow";
  return "text-yellow-400";
};

export const HowItWorks = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(0);

  // Auto-cycle through cards
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % mockInvestors.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-24 px-4 md:px-6">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan-glow/5 blur-[150px] rounded-full" />
      </div>
      
      <div className="container max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-white/60 text-sm font-medium uppercase tracking-widest mb-4">
            Your Dashboard
          </h2>
          <p className="text-2xl md:text-3xl text-white font-light mb-2">
            This is what you get
          </p>
          <p className="text-white/50 text-sm">
            Fill out your profile once → Get matched → Start real conversations
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="bg-[hsl(var(--navy-deep))] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Stats Bar - exactly like dashboard */}
          <div className="bg-[hsl(var(--navy-header))] border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Your Matches</span>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-glow" />
                  <span className="text-white text-sm">3 Interests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-cyan-glow" />
                  <span className="text-white text-sm">2 Syncs</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-glow" />
                  <span className="text-white text-sm">5 Messages</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Grid - matching actual dashboard design */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockInvestors.map((investor, index) => (
                <Card 
                  key={index}
                  className={`bg-navy-card border p-5 transition-all duration-300 cursor-pointer ${
                    activeCard === index 
                      ? 'border-[hsl(var(--cyan-glow))]/50 shadow-lg shadow-cyan-glow/10 scale-[1.02]' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setActiveCard(index)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">
                          {investor.firm_name}
                        </h4>
                        <p className="text-xs text-white/60 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {investor.hq_location}
                        </p>
                      </div>
                    </div>
                    {/* Match Score Badge */}
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(investor.match_score)}`}>
                        {investor.match_score}%
                      </div>
                      <p className="text-xs text-white/40">{investor.match_label}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStageColor(investor.stage_focus[0])}`}>
                      {investor.stage_focus[0]}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))]">
                      {investor.sector_tags[0]}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                      {investor.check_sizes[0]}
                    </span>
                  </div>

                  {/* Thesis */}
                  <p className="text-sm text-white/60 mb-4 line-clamp-2">
                    {investor.thesis_statement}
                  </p>

                  {/* Action - only show on active */}
                  <div className="pt-3 border-t border-white/10">
                    {activeCard === index ? (
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-white/60 hover:text-white hover:bg-white/10"
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>
                        <Button 
                          size="sm"
                          className="flex-1 bg-cyan-glow text-navy-deep hover:bg-cyan-bright"
                        >
                          <Heart className="mr-1 h-4 w-4" />
                          Sync
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="w-full text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-white/40 text-sm mb-4">
            5 minutes to set up • Curated matches only • No spam
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => navigate("/founder-application")}
              className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright px-6"
            >
              Join as a Startup
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/investor-application")}
              className="border-cyan-glow/40 text-cyan-glow hover:bg-cyan-glow/10 px-6"
            >
              Join as a VC
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
