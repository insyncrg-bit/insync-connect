import { UserPlus, Search, Handshake, BarChart3 } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      number: "01",
      title: "Join the Platform",
      description: "Founders complete a structured application capturing business model, traction, stage, and needs. Investors define their thesis, check size, and focus areas.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Search,
      number: "02",
      title: "Get Matched",
      description: "Our dynamic matching engine analyzes your profile and surfaces relevant connections in real-time—investors aligned with your stage, sector, and goals.",
      color: "from-cyan-500 to-teal-500"
    },
    {
      icon: Handshake,
      number: "03",
      title: "Connect & Share",
      description: "Upload your pitch deck, one-pager, and metrics to a secure dealroom. Investors access materials instantly via verified email introductions.",
      color: "from-teal-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      number: "04",
      title: "Track Outcomes",
      description: "Monitor engagement through your dashboard—see who opened your deck, who responded, and which connections led to meetings, pilots, or funding.",
      color: "from-emerald-500 to-green-500"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative" style={{ background: 'linear-gradient(180deg, hsl(195 70% 35%) 0%, hsl(180 75% 40%) 100%)' }}>
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            How It Works
          </h2>
          <p className="text-lg text-white/80">
            From profile to partnership in four strategic steps
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/30 rounded-2xl p-8 hover:bg-[hsl(var(--navy-deep))]/85 hover:border-[hsl(var(--cyan-glow))]/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Number Badge */}
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-[hsl(var(--cyan-glow))]/20 border-2 border-[hsl(var(--cyan-glow))]/40 flex items-center justify-center text-white font-bold text-xl shadow-lg backdrop-blur-sm">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="flex-shrink-0 p-4 bg-[hsl(var(--cyan-glow))]/15 rounded-xl group-hover:bg-[hsl(var(--cyan-glow))]/25 transition-colors">
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-white/80 text-lg leading-relaxed">{step.description}</p>
                </div>
              </div>

              {/* Connector Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-8 top-full w-0.5 h-8 bg-gradient-to-b from-[hsl(var(--cyan-glow))]/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
