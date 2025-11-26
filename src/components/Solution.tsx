import { CheckCircle2, Database, Target, Zap, TrendingUp } from "lucide-react";

export const Solution = () => {
  return (
    <section id="solution" className="py-20 relative" style={{ background: 'linear-gradient(180deg, hsl(210 65% 20%) 0%, hsl(195 70% 35%) 100%)' }}>
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-[hsl(var(--navy-deep))]/60 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/40 rounded-full text-sm font-medium text-[hsl(var(--cyan-glow))] mb-6">
              <CheckCircle2 className="h-4 w-4" />
              The Solution
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              High-Fidelity Routing +<br />
              <span className="text-[hsl(var(--cyan-glow))]">Outcome Accountability</span>
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Transform unstructured chaos into a high-throughput system that accelerates capital formation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/30 rounded-xl p-6 hover:border-[hsl(var(--cyan-glow))]/50 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Database className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                <h3 className="text-lg font-semibold text-white">Structured Profiles</h3>
              </div>
              <p className="text-white/70 text-sm">Detailed onboarding capturing vertical, traction, stage, and needs</p>
            </div>
            
            <div className="bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/30 rounded-xl p-6 hover:border-[hsl(var(--cyan-glow))]/50 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Target className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                <h3 className="text-lg font-semibold text-white">Smart Matching</h3>
              </div>
              <p className="text-white/70 text-sm">AI-powered routing based on context, timing, and strategic fit</p>
            </div>
            
            <div className="bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/30 rounded-xl p-6 hover:border-[hsl(var(--cyan-glow))]/50 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                <h3 className="text-lg font-semibold text-white">Instant Exchange</h3>
              </div>
              <p className="text-white/70 text-sm">Shared dealrooms with immediate access to pitch materials</p>
            </div>
            
            <div className="bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/30 rounded-xl p-6 hover:border-[hsl(var(--cyan-glow))]/50 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                <h3 className="text-lg font-semibold text-white">Track Outcomes</h3>
              </div>
              <p className="text-white/70 text-sm">Monitor engagement and conversion from intro to deal</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
