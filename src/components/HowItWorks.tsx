import { FileText, Brain, Target, MessageSquare, TrendingUp, CheckCircle } from "lucide-react";

const timelineSteps = [
  {
    phase: "Apply",
    duration: "5 min",
    icon: FileText,
    title: "Complete Your Profile",
    founderDesc: "Share your pitch once — stage, vertical, traction, and what you're looking for.",
    investorDesc: "Define your thesis — check sizes, sectors, stages, and deal-breakers.",
    highlight: "One detailed form replaces hundreds of cold emails",
  },
  {
    phase: "Match",
    duration: "24-48 hrs",
    icon: Brain,
    title: "AI-Powered Matching",
    founderDesc: "Our algorithm finds VCs whose thesis actually fits your company.",
    investorDesc: "See only startups that match your investment criteria exactly.",
    highlight: "90%+ match accuracy based on real thesis alignment",
  },
  {
    phase: "Connect",
    duration: "Ongoing",
    icon: Target,
    title: "Your Personalized Dashboard",
    founderDesc: "View matched investors, track interest signals, and manage warm intros.",
    investorDesc: "Browse curated deal flow, save favorites, and request intros.",
    highlight: "No more noise — just relevant opportunities",
  },
];

const dashboardFeatures = [
  {
    icon: MessageSquare,
    title: "Direct Messaging",
    description: "Chat with matched founders or investors without exchanging emails",
  },
  {
    icon: TrendingUp,
    title: "Match Scores",
    description: "See exactly why each match makes sense with transparent scoring",
  },
  {
    icon: CheckCircle,
    title: "Sync Requests",
    description: "Express interest and get notified when it's mutual",
  },
];

export const HowItWorks = () => {
  return (
    <section className="relative py-24 px-4 md:px-6">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan-glow/5 blur-[150px] rounded-full" />
      </div>
      
      <div className="container max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-white/60 text-sm font-medium uppercase tracking-widest mb-4">
            How it works
          </h2>
          <p className="text-2xl md:text-3xl text-white font-light">
            From application to <span className="text-cyan-glow">warm intro</span> in 3 steps
          </p>
        </div>
        
        {/* Timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-glow/30 to-transparent" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-16">
            {timelineSteps.map((step, index) => (
              <div 
                key={index} 
                className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-cyan-glow/30 transition-all duration-300"
              >
                {/* Phase badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-glow bg-cyan-glow/10 px-3 py-1 rounded-full">
                    {step.phase}
                  </span>
                  <span className="text-xs text-white/40">{step.duration}</span>
                </div>
                
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-glow/10 border border-cyan-glow/20 mb-4">
                  <step.icon className="w-5 h-5 text-cyan-glow" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-3">
                  {step.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <p className="text-white/60 text-sm">
                    <span className="text-cyan-glow/80 font-medium">Founders:</span> {step.founderDesc}
                  </p>
                  <p className="text-white/60 text-sm">
                    <span className="text-cyan-glow/80 font-medium">Investors:</span> {step.investorDesc}
                  </p>
                </div>
                
                {/* Highlight */}
                <p className="text-xs text-white/40 italic border-t border-white/10 pt-3">
                  {step.highlight}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Dashboard preview section */}
        <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl p-8">
          <h3 className="text-center text-lg font-medium text-white mb-2">
            What you get on your dashboard
          </h3>
          <p className="text-center text-white/50 text-sm mb-8">
            Your command center for fundraising or deal sourcing
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan-glow/10 flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-cyan-glow" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm mb-1">{feature.title}</h4>
                  <p className="text-white/50 text-xs">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
