import { AlertCircle, TrendingDown, Users, Clock } from "lucide-react";

export const Problem = () => {
  const painPoints = [
    {
      icon: AlertCircle,
      title: "Low Signal, High Noise",
      description: "Founders meet dozens of people at events, but only 1-2 are actually relevant to their current needs."
    },
    {
      icon: TrendingDown,
      title: "No Follow-Up Structure",
      description: "Connections end with a handshake. No shared CRM, no accountability, no way to track outcomes."
    },
    {
      icon: Users,
      title: "Fragmented Ecosystem",
      description: "Multiple Slack groups, Eventbrite mixers, LinkedIn threads—but no central hub or validation layer."
    },
    {
      icon: Clock,
      title: "Massive Time Waste",
      description: "Networking becomes a volume game. Success requires persistence and visibility, not strategic alignment."
    }
  ];

  return (
    <section id="problem" className="py-24 relative" style={{ background: 'linear-gradient(180deg, hsl(220 60% 15%) 0%, hsl(210 65% 20%) 100%)' }}>
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            The <span className="text-[hsl(var(--cyan-glow))]">Noise Problem</span>
          </h2>
          <p className="text-lg text-white/70">
            Today's startup ecosystem is fragmented, inefficient, and built on randomness. 
            Founders hope to meet the right investor. Investors sift through irrelevant dealflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {painPoints.map((point, index) => (
            <div 
              key={index}
              className="bg-[hsl(var(--navy-deep))]/80 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/30 rounded-xl p-6 hover:bg-[hsl(var(--navy-deep))]/90 hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[hsl(var(--cyan-glow))]/10 rounded-lg">
                  <point.icon className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{point.title}</h3>
                  <p className="text-white/70">{point.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
