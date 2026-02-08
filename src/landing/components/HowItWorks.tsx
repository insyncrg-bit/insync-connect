import { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin,
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  FileText,
  Sparkles,
  Users,
  Target,
  Briefcase,
  Map,
  Swords,
  DollarSign
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import infinityLogoTransparent from "../assets/infinity-logo-transparent.png";

// Mock data for Founder Dashboard (seeing investors)
const mockInvestors = [
  {
    firm_name: "Horizon Ventures",
    hq_location: "San Francisco, CA",
    stage_focus: ["Pre-seed"],
    sector_tags: ["Enterprise SaaS"],
    check_sizes: ["$500K - $2M"],
    thesis_statement: "We invest in technical founders building software that becomes critical infrastructure for enterprises. We look for companies...",
  },
  {
    firm_name: "Climate Capital",
    hq_location: "New York, NY",
    stage_focus: ["Seed"],
    sector_tags: ["Climate Tech"],
    check_sizes: ["$1M - $5M"],
    thesis_statement: "We back founders building solutions to the climate crisis. Focus on carbon reduction, clean energy, and sustainable supply chains.",
  },
];

// Mock data for Investor Dashboard (seeing startups)
const mockStartups = [
  {
    company_name: "NeuralFlow AI",
    location: "San Francisco, CA",
    stage: "Seed",
    vertical: "AI/ML Infrastructure",
    funding_goal: "$3M",
    description: "B2B SaaS platform enabling enterprises to deploy and manage ML models at scale with automated MLOps pipelines.",
  },
  {
    company_name: "ClimateLedger",
    location: "Austin, TX",
    stage: "Pre-seed",
    vertical: "Climate Tech",
    funding_goal: "$1.5M",
    description: "Carbon credit verification platform using blockchain for transparent ESG reporting and compliance.",
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

interface HowItWorksProps {
  onTryDemo?: (type: "founder" | "investor") => void;
}

export const HowItWorks = ({ onTryDemo }: HowItWorksProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'founder' | 'investor'>('founder');
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Auto-cycle through steps
  useEffect(() => {
    if (!isAnimating) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAnimating]);

  const steps = [
    {
      number: "01",
      title: activeTab === 'founder' ? "Fill Out Your Memo" : "Fill Out Your Thesis",
      description: activeTab === 'founder' 
        ? "Share your startup's story, metrics, and what you're looking for"
        : "Define your investment criteria, sectors, and check sizes"
    },
    {
      number: "02",
      title: "Get Curated Matches",
      description: "Our algorithm finds the best fits based on mutual criteria"
    },
    {
      number: "03",
      title: "Access Your Dashboard",
      description: "View matches, express interest, and start conversations"
    }
  ];

  return (
    <section id="how-it-works" className="relative py-24 px-4 md:px-6">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan-glow/5 blur-[150px] rounded-full" />
      </div>
      
      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-white/60 text-sm font-medium uppercase tracking-widest mb-4">
            How It Works
          </h2>
          <p className="text-2xl md:text-3xl text-white font-light">
            Simple. Curated. Effective.
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-navy-card border border-white/10 rounded-full p-1 flex gap-1">
            <button
              onClick={() => { setActiveTab('founder'); setIsAnimating(true); }}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'founder'
                  ? 'bg-cyan-glow text-navy-deep'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              For Founders
            </button>
            <button
              onClick={() => { setActiveTab('investor'); setIsAnimating(true); }}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'investor'
                  ? 'bg-cyan-glow text-navy-deep'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              For VCs
            </button>
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => { setActiveStep(index); setIsAnimating(false); }}
              className={`relative p-4 rounded-xl text-left transition-all duration-300 ${
                activeStep === index
                  ? 'bg-navy-card border-2 border-cyan-glow/50'
                  : 'bg-navy-card/50 border border-white/10 hover:border-white/20'
              }`}
            >
              {/* Step number */}
              <span className={`text-xs font-mono ${
                activeStep === index ? 'text-cyan-glow' : 'text-white/40'
              }`}>
                {step.number}
              </span>
              <h3 className={`font-medium mt-1 ${
                activeStep === index ? 'text-white' : 'text-white/60'
              }`}>
                {step.title}
              </h3>
              <p className="text-xs text-white/40 mt-1 line-clamp-2">
                {step.description}
              </p>

              {/* Progress bar */}
              {activeStep === index && isAnimating && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-glow animate-[progress_4s_linear]"
                    style={{ animation: 'progress 4s linear forwards' }}
                  />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Quick Demo Access Buttons - Always visible */}
        {onTryDemo && (
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => onTryDemo('founder')}
              className="px-5 py-2.5 rounded-lg bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow font-medium hover:bg-cyan-glow/20 transition-all flex items-center gap-2 text-sm"
            >
              <Eye className="w-4 h-4" />
              View Founder Demo
            </button>
            <button
              onClick={() => onTryDemo('investor')}
              className="px-5 py-2.5 rounded-lg bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow font-medium hover:bg-cyan-glow/20 transition-all flex items-center gap-2 text-sm"
            >
              <Eye className="w-4 h-4" />
              View Investor Demo
            </button>
          </div>
        )}

        {/* Interactive Preview Area */}
        <div className="bg-[hsl(var(--navy-deep))] border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-h-[400px]">
          
          {/* Step 1: Fill Out Form Preview */}
          {activeStep === 0 && (
            <div className="p-6 animate-fade-in">
              {activeTab === 'founder' ? (
                <>
                  {/* Founder Application Steps Bar - matching actual application */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-6">
                    <div className="flex items-center justify-between gap-2">
                      {[
                        { icon: Sparkles, label: "Welcome", active: true },
                        { icon: Building2, label: "Company Info", active: false },
                        { icon: Users, label: "Team & Overview", active: false },
                        { icon: Target, label: "Value Proposition", active: false },
                        { icon: Briefcase, label: "Business Model", active: false },
                        { icon: TrendingUp, label: "Go-to-Market", active: false },
                        { icon: Map, label: "Customer & Market", active: false },
                        { icon: Swords, label: "Competitors", active: false },
                      ].map((step, index) => {
                        const Icon = step.icon;
                        return (
                          <div
                            key={index}
                            className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all cursor-pointer ${
                              step.active ? 'bg-white/20' : 'hover:bg-white/10'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              step.active 
                                ? 'bg-white text-navy-deep' 
                                : 'bg-white/20 text-white/60'
                            }`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className={`text-xs font-medium text-center leading-tight ${
                              step.active ? 'text-white' : 'text-white/60'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sample form preview */}
                  <div className="bg-navy-card border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Welcome</h3>
                    <p className="text-white/60 text-sm mb-4">Help us understand the what, why, and how of your company</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-white/5 border border-cyan-glow/20 rounded-lg">
                        <span className="text-xl font-bold text-cyan-glow">WHAT</span>
                        <p className="text-xs text-white/50 mt-1">The problem you're solving</p>
                      </div>
                      <div className="p-4 bg-white/5 border border-cyan-glow/20 rounded-lg">
                        <span className="text-xl font-bold text-cyan-glow">WHY</span>
                        <p className="text-xs text-white/50 mt-1">Motivation & urgency</p>
                      </div>
                      <div className="p-4 bg-white/5 border border-cyan-glow/20 rounded-lg">
                        <span className="text-xl font-bold text-cyan-glow">HOW</span>
                        <p className="text-xs text-white/50 mt-1">Solution & business model</p>
                      </div>
                      <div className="p-4 bg-white/5 border border-cyan-glow/20 rounded-lg">
                        <span className="text-xl font-bold text-cyan-glow">METRIC</span>
                        <p className="text-xs text-white/50 mt-1">Proof & traction</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Investor Application Steps Bar - matching actual application */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-6">
                    <div className="flex items-center justify-between gap-2">
                      {[
                        { icon: Sparkles, label: "Welcome", active: true },
                        { icon: Building2, label: "Admin & Verification", active: false },
                        { icon: DollarSign, label: "Fund Overview", active: false },
                        { icon: Target, label: "Investment Strategy", active: false },
                        { icon: Users, label: "Value-Add", active: false },
                        { icon: FileText, label: "Portfolio", active: false },
                        { icon: TrendingUp, label: "Deal Mechanics", active: false },
                      ].map((step, index) => {
                        const Icon = step.icon;
                        return (
                          <div
                            key={index}
                            className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all cursor-pointer ${
                              step.active ? 'bg-white/20' : 'hover:bg-white/10'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              step.active
                                ? 'bg-white text-navy-deep'
                                : 'bg-white/20 text-white/60'
                            }`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className={`text-xs font-medium text-center leading-tight ${
                              step.active ? 'text-white' : 'text-white/60'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sample form preview */}
                  <div className="bg-navy-card border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Welcome</h3>
                    <p className="text-white/60 text-sm mb-4">Help us understand your investment thesis and criteria</p>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-white/5 border border-cyan-glow/20 rounded-lg">
                        <span className="text-xl font-bold text-cyan-glow">THESIS</span>
                        <p className="text-xs text-white/50 mt-1">Your investment focus</p>
                      </div>
                      <div className="p-4 bg-white/5 border border-cyan-glow/20 rounded-lg">
                        <span className="text-xl font-bold text-cyan-glow">CRITERIA</span>
                        <p className="text-xs text-white/50 mt-1">Stage, sector, check size</p>
                      </div>
                      <div className="p-4 bg-white/5 border border-cyan-glow/20 rounded-lg">
                        <span className="text-xl font-bold text-cyan-glow">PROCESS</span>
                        <p className="text-xs text-white/50 mt-1">How you evaluate deals</p>
                      </div>
                      <div className="p-4 bg-white/5 border border-cyan-glow/20 rounded-lg">
                        <span className="text-xl font-bold text-cyan-glow">VALUE-ADD</span>
                        <p className="text-xs text-white/50 mt-1">What you offer portfolio</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Matching Animation */}
          {activeStep === 1 && (
            <div className="p-8 flex items-center justify-center min-h-[350px]">
              <div className="relative">
                {/* Center icon - InSync Logo PNG */}
                <div className="w-28 h-28 rounded-full bg-cyan-glow/20 border-2 border-cyan-glow flex items-center justify-center p-2">
                  <img src={infinityLogoTransparent} alt="InSync Logo" className="w-24 h-auto" />
                </div>
                
                {/* Orbiting elements */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-navy-card border border-white/20 rounded-lg px-3 py-2">
                    <span className="text-xs text-white/80">Stage Match</span>
                  </div>
                </div>
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }}>
                  <div className="absolute top-1/2 -right-20 -translate-y-1/2 bg-navy-card border border-white/20 rounded-lg px-3 py-2">
                    <span className="text-xs text-white/80">Sector Fit</span>
                  </div>
                </div>
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s' }}>
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-navy-card border border-white/20 rounded-lg px-3 py-2">
                    <span className="text-xs text-white/80">Check Size</span>
                  </div>
                </div>
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '9s', animationDirection: 'reverse' }}>
                  <div className="absolute top-1/2 -left-20 -translate-y-1/2 bg-navy-card border border-white/20 rounded-lg px-3 py-2">
                    <span className="text-xs text-white/80">Location</span>
                  </div>
                </div>
                
                {/* Pulse rings */}
                <div className="absolute inset-0 -m-4">
                  <div className="w-full h-full rounded-full border border-cyan-glow/30 animate-ping" style={{ animationDuration: '2s' }} />
                </div>
                <div className="absolute inset-0 -m-8">
                  <div className="w-full h-full rounded-full border border-cyan-glow/20 animate-ping" style={{ animationDuration: '2.5s' }} />
                </div>
              </div>
              
              <div className="ml-16 text-left">
                <h3 className="text-xl text-white font-medium mb-2">Finding Your Matches</h3>
                <p className="text-white/50 text-sm mb-4 max-w-xs">
                  Our algorithm analyzes 20+ criteria to find the perfect fit between {activeTab === 'founder' ? 'startups and investors' : 'VCs and founders'}
                </p>
                <div className="flex items-center gap-2 text-cyan-glow text-sm">
                  <div className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
                  <span>Processing matches...</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Dashboard Preview - Matching actual screenshots */}
          {activeStep === 2 && (
            <div className="animate-fade-in">
              {/* Header matching screenshots */}
              <div className="px-6 pt-6 pb-4 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {activeTab === 'founder' ? 'Demo Startup' : 'Dashboard'}
                </h3>
                <p className="text-white/50 text-sm">
                  {activeTab === 'founder' ? 'Track your connections and opportunities' : 'Discover and connect with promising startups'}
                </p>
              </div>

              {/* Profile Card - matching screenshot design */}
              <div className="px-6 pt-4">
                <Card className="bg-navy-card border border-white/10 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-glow/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-cyan-glow" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">
                        {activeTab === 'founder' ? 'Demo Startup' : 'Your Thesis'}
                      </h4>
                      <p className="text-xs text-white/50">
                        {activeTab === 'founder' ? 'FinTech • Seed' : 'Investment Thesis'}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/40" />
                </Card>
              </div>

              {/* Stats Row - matching screenshot exactly */}
              <div className="px-6 py-4 grid grid-cols-4 gap-3">
                <Card className="bg-navy-card border border-white/10 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-cyan-glow" />
                    <span className="text-2xl font-semibold text-white">2</span>
                  </div>
                  <p className="text-xs text-white/50">Interests</p>
                </Card>
                <Card className="bg-navy-card border border-white/10 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-cyan-glow" />
                    <span className="text-2xl font-semibold text-white">2</span>
                  </div>
                  <p className="text-xs text-white/50">Syncs</p>
                </Card>
                <Card className="bg-navy-card border border-white/10 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="w-4 h-4 text-white/60" />
                    <span className="text-2xl font-semibold text-white">1</span>
                  </div>
                  <p className="text-xs text-white/50">Pending</p>
                </Card>
                <Card className="bg-navy-card border border-white/10 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-white/60" />
                    <span className="text-2xl font-semibold text-white">{activeTab === 'founder' ? '3' : '1'}</span>
                  </div>
                  <p className="text-xs text-white/50">Messages</p>
                </Card>
              </div>

              {/* Curated Section Header */}
              <div className="px-6 flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">
                  {activeTab === 'founder' ? 'Curated Investors' : 'Curated Startups'}
                </h3>
                <button className="text-cyan-glow text-sm flex items-center gap-1 hover:underline">
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Cards Grid - matching screenshots exactly */}
              <div className="px-6 pb-6 grid grid-cols-2 gap-4">
                {activeTab === 'founder' ? (
                  mockInvestors.map((investor, index) => (
                    <Card 
                      key={index}
                      className="bg-navy-card border border-white/10 p-5 hover:border-cyan-glow/30 transition-all group cursor-pointer"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-glow/10 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-cyan-glow" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{investor.firm_name}</h4>
                          <p className="text-xs text-white/50 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {investor.hq_location}
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getStageColor(investor.stage_focus[0])}`}>
                          {investor.stage_focus[0]}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20">
                          {investor.sector_tags[0]}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10">
                          {investor.check_sizes[0]}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-white/60 mb-4 line-clamp-2">
                        {investor.thesis_statement}
                      </p>

                      {/* Action */}
                      <div className="pt-3 border-t border-white/10">
                        <button className="w-full flex items-center justify-center gap-2 text-cyan-glow text-sm hover:text-cyan-bright transition-colors">
                          <Eye className="w-4 h-4" />
                          View Profile
                        </button>
                      </div>
                    </Card>
                  ))
                ) : (
                  mockStartups.map((startup, index) => (
                    <Card 
                      key={index}
                      className="bg-navy-card border border-white/10 p-5 hover:border-cyan-glow/30 transition-all group cursor-pointer"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-glow/10 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-cyan-glow" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{startup.company_name}</h4>
                          <p className="text-xs text-white/50 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {startup.location}
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getStageColor(startup.stage)}`}>
                          {startup.stage}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20">
                          {startup.vertical}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10">
                          {startup.funding_goal}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-white/60 mb-4 line-clamp-2">
                        {startup.description}
                      </p>

                      {/* Action */}
                      <div className="pt-3 border-t border-white/10">
                        <button className="w-full flex items-center justify-center gap-2 text-cyan-glow text-sm hover:text-cyan-bright transition-colors">
                          <FileText className="w-4 h-4" />
                          View Memo
                        </button>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Try Demo CTA */}
              {onTryDemo && (
                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => onTryDemo(activeTab)}
                    className="w-full py-3 rounded-lg bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow font-medium hover:bg-cyan-glow/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Try Full Demo Dashboard
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Add keyframe animation for progress bar */}
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};
