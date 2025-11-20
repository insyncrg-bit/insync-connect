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
    <section id="problem" className="py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            The <span className="text-destructive">Noise Problem</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Today's startup ecosystem is fragmented, inefficient, and built on randomness. 
            Founders hope to meet the right investor. Investors sift through irrelevant dealflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {painPoints.map((point, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-accent/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <point.icon className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                  <p className="text-muted-foreground">{point.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
