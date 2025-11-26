import { CheckCircle2, Database, Zap, TrendingUp, Target } from "lucide-react";

export const Solution = () => {
  const features = [
    {
      icon: Database,
      title: "Structured Data Profiles",
      description: "Founders and investors complete detailed onboarding forms capturing key metadata—vertical, traction, stage, investment thesis, and current needs."
    },
    {
      icon: Target,
      title: "Dynamic Matching Engine",
      description: "A hybrid algorithm + human layer that routes connections in real-time based on context, timing, and strategic fit."
    },
    {
      icon: Zap,
      title: "Rapid Material Exchange",
      description: "Once matched, founders upload pitch decks and materials to a shared dealroom. Investors access everything instantly—no manual follow-ups."
    },
    {
      icon: TrendingUp,
      title: "Outcome Tracking Dashboard",
      description: "Every connection is logged and tracked. See who opened your deck, who responded, and which introductions led to meetings, pilots, or deals."
    }
  ];

  return (
    <section id="solution" className="py-24 relative" style={{ background: 'linear-gradient(180deg, hsl(210 65% 20%) 0%, hsl(195 70% 35%) 100%)' }}>
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-[hsl(var(--navy-deep))]/60 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/40 rounded-full text-sm font-medium text-[hsl(var(--cyan-glow))] mb-6">
            <CheckCircle2 className="h-4 w-4" />
            The Solution
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            High-Fidelity Routing + 
            <br />
            <span className="text-[hsl(var(--cyan-glow))]">
              Outcome Accountability
            </span>
          </h2>
          <p className="text-lg text-white/80">
            In-Sync transforms unstructured chaos into a high-throughput system that quantifies connectivity, 
            reduces search friction, and accelerates capital formation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/30 rounded-xl p-8 hover:bg-[hsl(var(--navy-deep))]/85 hover:border-[hsl(var(--cyan-glow))]/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-4 bg-[hsl(var(--cyan-glow))]/10 rounded-xl group-hover:bg-[hsl(var(--cyan-glow))]/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-[hsl(var(--cyan-glow))]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border-2 border-[hsl(var(--cyan-glow))]/40 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-white">
            Network Solvency: Making Every Connection Count
          </h3>
          <p className="text-white/90 text-lg">
            We increase the probability that each introduction results in a measurable outcome—
            turning random networking into strategic, data-driven relationship building.
          </p>
        </div>
      </div>
    </section>
  );
};
