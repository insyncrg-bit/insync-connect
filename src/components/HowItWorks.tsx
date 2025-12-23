import { FileText, Zap, LayoutDashboard, Users, MessageCircle, Heart, Bell, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Tell us about you",
    description: "5 minutes. One form. No more repeating yourself.",
  },
  {
    number: "02",
    icon: Zap,
    title: "We find your people",
    description: "Matches based on what actually matters to you.",
  },
  {
    number: "03",
    icon: LayoutDashboard,
    title: "Start connecting",
    description: "Your dashboard. Your matches. Real conversations.",
  },
];

const dashboardTeasers = [
  { icon: Users, label: "Curated matches" },
  { icon: Heart, label: "Mutual interest" },
  { icon: MessageCircle, label: "Direct chat" },
  { icon: Bell, label: "Real-time alerts" },
  { icon: BarChart3, label: "Match insights" },
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
            Less searching. More <span className="text-cyan-glow">syncing</span>.
          </p>
        </div>
        
        {/* Steps - visual timeline */}
        <div className="relative mb-20">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-cyan-glow/40 via-cyan-glow/20 to-cyan-glow/40" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                {/* Number + Icon */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-navy-card border border-cyan-glow/20 flex items-center justify-center group-hover:border-cyan-glow/50 transition-all duration-300">
                    <step.icon className="w-10 h-10 text-cyan-glow" />
                  </div>
                  <span className="absolute -top-2 -right-2 text-xs font-bold text-cyan-glow bg-navy-deep border border-cyan-glow/30 rounded-full w-8 h-8 flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-medium text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-white/50 text-sm max-w-[200px] mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Dashboard teaser */}
        <div className="text-center">
          <p className="text-white/40 text-sm mb-6">
            Once you're in, your dashboard gives you:
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            {dashboardTeasers.map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 hover:border-cyan-glow/30 hover:bg-cyan-glow/5 transition-all duration-300"
              >
                <item.icon className="w-4 h-4 text-cyan-glow" />
                <span className="text-white/70 text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
