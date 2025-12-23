import { useState, useEffect } from "react";
import { 
  FileText, 
  Sparkles, 
  LayoutDashboard, 
  Heart, 
  MessageCircle, 
  Eye,
  ArrowRight,
  Check,
  MapPin,
  Building2,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock matches that reflect actual dashboard data
const mockInvestorMatches = [
  {
    name: "Horizon Ventures",
    stage: "Pre-seed • Seed",
    sectors: ["Enterprise SaaS", "Developer Tools"],
    location: "San Francisco, CA",
    checkSize: "$500K - $2M",
    matchScore: 94,
  },
  {
    name: "Climate Capital", 
    stage: "Seed • Series A",
    sectors: ["Climate Tech", "Clean Energy"],
    location: "New York, NY",
    checkSize: "$1M - $5M",
    matchScore: 87,
  },
  {
    name: "HealthTech Partners",
    stage: "Seed • Series A", 
    sectors: ["Digital Health", "HealthTech"],
    location: "Boston, MA",
    checkSize: "$2M - $8M",
    matchScore: 82,
  },
];

const mockStats = [
  { label: "Interests", value: 3, icon: Eye },
  { label: "Syncs", value: 2, icon: Heart },
  { label: "Messages", value: 5, icon: MessageCircle },
];

export const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeCard, setActiveCard] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Auto-cycle through steps
  useEffect(() => {
    if (!isAnimating) return;
    
    const stepTimer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);
    
    return () => clearInterval(stepTimer);
  }, [isAnimating]);

  // Auto-cycle through cards when on step 3
  useEffect(() => {
    if (activeStep !== 2 || !isAnimating) return;
    
    const cardTimer = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % mockInvestorMatches.length);
    }, 2000);
    
    return () => clearInterval(cardTimer);
  }, [activeStep, isAnimating]);

  const getStageColor = (stage: string) => {
    if (stage.includes("Pre-seed")) return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    if (stage.includes("Seed")) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    if (stage.includes("Series A")) return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    return "bg-white/10 text-white/70 border-white/20";
  };

  return (
    <section className="relative py-24 px-4 md:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-cyan-glow/5 blur-[200px] rounded-full" />
      </div>
      
      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-white/60 text-sm font-medium uppercase tracking-widest mb-4">
            How it works
          </h2>
          <p className="text-2xl md:text-3xl text-white font-light">
            Less searching. More <span className="text-cyan-glow">syncing</span>.
          </p>
        </div>

        {/* Interactive Steps + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Left: Step Indicators */}
          <div className="lg:col-span-2 space-y-4">
            {/* Step 1 */}
            <div 
              className={`relative p-5 rounded-xl border cursor-pointer transition-all duration-500 ${
                activeStep === 0 
                  ? 'bg-cyan-glow/10 border-cyan-glow/40 scale-[1.02]' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
              onClick={() => { setActiveStep(0); setIsAnimating(false); }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  activeStep === 0 ? 'bg-cyan-glow text-navy-deep' : 'bg-white/10 text-white/60'
                }`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">Tell us about you</h3>
                  <p className="text-white/50 text-sm">5 minutes. One form. Never repeat yourself.</p>
                </div>
              </div>
              {activeStep === 0 && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-glow rounded-l-xl" />
              )}
            </div>

            {/* Step 2 */}
            <div 
              className={`relative p-5 rounded-xl border cursor-pointer transition-all duration-500 ${
                activeStep === 1 
                  ? 'bg-cyan-glow/10 border-cyan-glow/40 scale-[1.02]' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
              onClick={() => { setActiveStep(1); setIsAnimating(false); }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  activeStep === 1 ? 'bg-cyan-glow text-navy-deep' : 'bg-white/10 text-white/60'
                }`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">We find your people</h3>
                  <p className="text-white/50 text-sm">Matched on what actually matters to you.</p>
                </div>
              </div>
              {activeStep === 1 && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-glow rounded-l-xl" />
              )}
            </div>

            {/* Step 3 */}
            <div 
              className={`relative p-5 rounded-xl border cursor-pointer transition-all duration-500 ${
                activeStep === 2 
                  ? 'bg-cyan-glow/10 border-cyan-glow/40 scale-[1.02]' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
              onClick={() => { setActiveStep(2); setIsAnimating(false); }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  activeStep === 2 ? 'bg-cyan-glow text-navy-deep' : 'bg-white/10 text-white/60'
                }`}>
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">Start connecting</h3>
                  <p className="text-white/50 text-sm">Your dashboard. Real conversations.</p>
                </div>
              </div>
              {activeStep === 2 && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-glow rounded-l-xl" />
              )}
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => { setActiveStep(i); setIsAnimating(false); }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeStep === i ? 'bg-cyan-glow w-6' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right: Interactive Preview */}
          <div className="lg:col-span-3">
            <div className="relative bg-navy-card/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden min-h-[400px]">
              
              {/* Step 1: Application Preview */}
              {activeStep === 0 && (
                <div className="p-6 animate-fade-in">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-cyan-glow/10 border border-cyan-glow/30 rounded-full px-4 py-2 mb-4">
                      <FileText className="w-4 h-4 text-cyan-glow" />
                      <span className="text-white text-sm">Your Memo / Thesis</span>
                    </div>
                    <p className="text-white/50 text-sm">One detailed profile that speaks for you</p>
                  </div>
                  
                  {/* Form preview */}
                  <div className="space-y-3">
                    {["Company Overview", "Traction & Metrics", "What You're Looking For"].map((field, i) => (
                      <div 
                        key={i}
                        className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-3"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-cyan-glow/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-cyan-glow" />
                        </div>
                        <span className="text-white/70 text-sm">{field}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-cyan-glow/80 text-xs">VCs see exactly what they need to decide</p>
                  </div>
                </div>
              )}

              {/* Step 2: Matching Animation */}
              {activeStep === 1 && (
                <div className="p-6 animate-fade-in">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-cyan-glow/10 border border-cyan-glow/30 rounded-full px-4 py-2 mb-4">
                      <Sparkles className="w-4 h-4 text-cyan-glow animate-pulse" />
                      <span className="text-white text-sm">Finding matches...</span>
                    </div>
                  </div>
                  
                  {/* Matching visualization */}
                  <div className="relative h-48 flex items-center justify-center">
                    {/* Center element */}
                    <div className="absolute w-16 h-16 rounded-full bg-cyan-glow/20 border-2 border-cyan-glow flex items-center justify-center z-10">
                      <Building2 className="w-6 h-6 text-cyan-glow" />
                    </div>
                    
                    {/* Orbiting matches */}
                    {mockInvestorMatches.map((match, i) => (
                      <div
                        key={i}
                        className="absolute w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-xs"
                        style={{
                          transform: `rotate(${i * 120}deg) translateX(80px) rotate(-${i * 120}deg)`,
                          animation: `orbit 8s linear infinite`,
                          animationDelay: `${i * -2.6}s`,
                        }}
                      >
                        {match.matchScore}%
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <p className="text-white/50 text-sm">Stage • Sector • Thesis • Location</p>
                    <p className="text-cyan-glow/80 text-xs mt-2">Only relevant matches, no noise</p>
                  </div>
                </div>
              )}

              {/* Step 3: Dashboard Preview */}
              {activeStep === 2 && (
                <div className="animate-fade-in">
                  {/* Mini stats bar */}
                  <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
                    <span className="text-white/60 text-sm font-medium">Your Dashboard</span>
                    <div className="flex items-center gap-4">
                      {mockStats.map((stat, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <stat.icon className="w-3.5 h-3.5 text-cyan-glow" />
                          <span className="text-white text-xs font-medium">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Match cards */}
                  <div className="p-4 space-y-3">
                    {mockInvestorMatches.map((match, index) => (
                      <div 
                        key={index}
                        className={`bg-white/5 border rounded-xl p-4 transition-all duration-300 ${
                          activeCard === index 
                            ? 'border-cyan-glow/50 shadow-lg shadow-cyan-glow/5' 
                            : 'border-white/10'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-glow/30 to-cyan-glow/10 flex items-center justify-center text-white font-bold text-sm">
                              {match.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-white font-medium text-sm">{match.name}</h4>
                              <div className="flex items-center gap-2 text-white/40 text-xs">
                                <MapPin className="w-3 h-3" />
                                {match.location}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-cyan-glow font-bold">{match.matchScore}%</div>
                            <p className="text-white/40 text-xs">match</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={`text-xs border ${getStageColor(match.stage)}`}>
                            {match.stage}
                          </Badge>
                          <span className="text-white/40 text-xs">{match.checkSize}</span>
                        </div>

                        {/* Action buttons on active card */}
                        {activeCard === index && (
                          <div className="flex gap-2 pt-3 border-t border-white/10 animate-fade-in">
                            <Button size="sm" variant="ghost" className="flex-1 h-8 text-white/60 hover:text-white hover:bg-white/10 text-xs">
                              <Eye className="w-3 h-3 mr-1" /> View
                            </Button>
                            <Button size="sm" className="flex-1 h-8 bg-cyan-glow text-navy-deep hover:bg-cyan-bright text-xs">
                              <Heart className="w-3 h-3 mr-1" /> Sync
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Decorative glow */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-glow/10 blur-3xl rounded-full pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
        }
      `}</style>
    </section>
  );
};
