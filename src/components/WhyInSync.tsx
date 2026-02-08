import { Target, Users, Zap } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Curated Matches",
    description: "No spray-and-pray. We connect you with investors who actually invest in your stage, sector, and geography.",
  },
  {
    icon: Users,
    title: "Human-Reviewed",
    description: "Real analysts review every application. No algorithms deciding your fate.",
  },
  {
    icon: Zap,
    title: "Warm Intros Only",
    description: "Skip the cold outreach. Every intro is facilitated and contextualized.",
  },
];

export const WhyInSync = () => {
  return (
    <section className="py-16 px-4 md:px-6 border-t border-cyan-glow/10">
      <div className="container max-w-4xl mx-auto">
        {/* Highlighted Problem Statement */}
        <div className="text-center mb-12">
          <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed max-w-2xl mx-auto">
            <span className="text-cyan-glow">Fundraising is broken.</span>{" "}
            Cold emails get ignored. Warm intros are gatekept.{" "}
            <span className="text-cyan-glow font-semibold">We fix that.</span>
          </p>
        </div>

        <h2 className="text-center text-white/60 text-sm font-medium uppercase tracking-widest mb-10">
          Why inSync?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-5 rounded-xl bg-white/[0.02] border border-cyan-glow/10 hover:border-cyan-glow/25 transition-all duration-300"
            >
              <feature.icon className="w-5 h-5 text-cyan-glow mb-3" />
              <h3 className="text-base font-medium text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
