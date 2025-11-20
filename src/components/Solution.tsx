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
    <section id="solution" className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-sm font-medium text-accent mb-6">
            <CheckCircle2 className="h-4 w-4" />
            The Solution
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            High-Fidelity Routing + 
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Outcome Accountability
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            In-Sync transforms unstructured chaos into a high-throughput system that quantifies connectivity, 
            reduces search friction, and accelerates capital formation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-card border border-border rounded-xl p-8 hover:shadow-xl hover:shadow-accent/10 hover:border-accent/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-4 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-accent/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Network Solvency: Making Every Connection Count
          </h3>
          <p className="text-muted-foreground text-lg">
            We increase the probability that each introduction results in a measurable outcome—
            turning random networking into strategic, data-driven relationship building.
          </p>
        </div>
      </div>
    </section>
  );
};
