import { useState, useEffect } from "react";
import { FileText, Zap, LayoutDashboard, Heart, MessageCircle, X, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Tell us about you",
    description: "5 minutes. One form. No repeating yourself.",
  },
  {
    number: "02",
    icon: Zap,
    title: "We find your people",
    description: "Matches based on what actually matters.",
  },
  {
    number: "03",
    icon: LayoutDashboard,
    title: "Start connecting",
    description: "Your dashboard. Real conversations.",
  },
];

// Mock data for the interactive preview
const mockMatches = [
  {
    name: "Sequoia Capital",
    type: "Series A • B2B SaaS",
    matchScore: 94,
    status: "interested",
  },
  {
    name: "a]6z Ventures",
    type: "Seed • Fintech",
    matchScore: 89,
    status: "new",
  },
  {
    name: "Accel Partners",
    type: "Series A • Enterprise",
    matchScore: 87,
    status: "synced",
  },
];

const mockNotifications = [
  "Sequoia Capital expressed interest in your startup",
  "New match: Greylock Partners (92% match)",
  "a16z requested to sync with you",
];

export const HowItWorks = () => {
  const [activeMatch, setActiveMatch] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationIndex, setNotificationIndex] = useState(0);

  // Animate through matches
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMatch((prev) => (prev + 1) % mockMatches.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Show notifications periodically
  useEffect(() => {
    const showTimer = setInterval(() => {
      setShowNotification(true);
      setNotificationIndex((prev) => (prev + 1) % mockNotifications.length);
      
      setTimeout(() => setShowNotification(false), 2500);
    }, 4000);
    
    return () => clearInterval(showTimer);
  }, []);

  return (
    <section className="relative py-24 px-4 md:px-6">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan-glow/5 blur-[150px] rounded-full" />
      </div>
      
      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-white/60 text-sm font-medium uppercase tracking-widest mb-4">
            How it works
          </h2>
          <p className="text-2xl md:text-3xl text-white font-light">
            Less searching. More <span className="text-cyan-glow">syncing</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-glow/10 border border-cyan-glow/20 flex items-center justify-center group-hover:bg-cyan-glow/20 transition-all">
                  <step.icon className="w-5 h-5 text-cyan-glow" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-cyan-glow/60 font-mono">{step.number}</span>
                    <h3 className="text-lg font-medium text-white">{step.title}</h3>
                  </div>
                  <p className="text-white/50 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Interactive Dashboard Preview */}
          <div className="relative">
            {/* Floating notification */}
            <div 
              className={`absolute -top-4 right-0 left-0 mx-auto w-fit max-w-[280px] bg-cyan-glow/20 backdrop-blur-md border border-cyan-glow/30 rounded-lg px-4 py-2 flex items-center gap-2 transition-all duration-500 z-20 ${
                showNotification ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
              <p className="text-white text-xs truncate">{mockNotifications[notificationIndex]}</p>
            </div>

            {/* Mock Dashboard */}
            <div className="bg-navy-card/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <span className="text-white/80 text-sm font-medium">Your Matches</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                </div>
              </div>

              {/* Match Cards */}
              <div className="p-4 space-y-3">
                {mockMatches.map((match, index) => (
                  <div 
                    key={index}
                    className={`bg-white/5 border rounded-xl p-4 transition-all duration-500 cursor-pointer ${
                      activeMatch === index 
                        ? 'border-cyan-glow/50 scale-[1.02] shadow-lg shadow-cyan-glow/10' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-glow/30 to-cyan-glow/10 flex items-center justify-center text-white font-bold text-sm">
                          {match.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-sm">{match.name}</h4>
                          <p className="text-white/40 text-xs">{match.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-glow font-bold text-lg">{match.matchScore}%</div>
                        <p className="text-white/40 text-xs">match</p>
                      </div>
                    </div>

                    {/* Action buttons - show on active */}
                    {activeMatch === index && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-white/10 animate-fade-in">
                        <Button size="sm" variant="ghost" className="flex-1 h-8 text-white/60 hover:text-white hover:bg-white/10">
                          <X className="w-4 h-4 mr-1" /> Pass
                        </Button>
                        <Button size="sm" className="flex-1 h-8 bg-cyan-glow text-navy-deep hover:bg-cyan-bright">
                          <Heart className="w-4 h-4 mr-1" /> Sync
                        </Button>
                      </div>
                    )}

                    {/* Status badge for non-active */}
                    {activeMatch !== index && match.status === "synced" && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-green-400">
                        <Check className="w-3 h-3" /> Synced
                      </div>
                    )}
                    {activeMatch !== index && match.status === "interested" && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-cyan-glow">
                        <Heart className="w-3 h-3" /> Interested in you
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer hint */}
              <div className="bg-white/5 border-t border-white/10 px-4 py-3 flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4 text-cyan-glow" />
                <span className="text-white/50 text-xs">Start chatting after you sync</span>
                <ChevronRight className="w-3 h-3 text-white/30" />
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-cyan-glow/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-cyan-glow/5 blur-2xl rounded-full pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};
