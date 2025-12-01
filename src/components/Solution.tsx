import { CheckCircle2, Database, Target, Zap, TrendingUp } from "lucide-react";

export const Solution = () => {
  return (
    <section id="solution" className="py-20 relative overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-[15%] w-80 h-80 border border-[hsl(var(--cyan-glow))]/20 rounded-full animate-[spin_30s_linear_infinite]" />
        <div className="absolute bottom-10 right-[20%] w-64 h-64 border border-white/10 rounded-full animate-[spin_22s_linear_infinite_reverse]" />
        <div className="absolute top-40 right-[10%] w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))]/40 animate-[float_7s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-32 left-[12%] w-1.5 h-1.5 rounded-full bg-white/40 animate-[float_9s_ease-in-out_infinite]" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-[hsl(var(--navy-deep))]/60 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/30 rounded-full text-sm font-medium text-[hsl(var(--cyan-glow))]/80 mb-6 hover:scale-105 transition-transform duration-300">
              <CheckCircle2 className="h-4 w-4" />
              The Solution
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              High-Fidelity Routing +<br />
              <span className="text-[hsl(var(--cyan-glow))]/70 inline-block hover:scale-110 transition-transform duration-300">Outcome Accountability</span>
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Transform unstructured chaos into a high-throughput system that accelerates capital formation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/20 rounded-xl p-6 hover:border-[hsl(var(--cyan-glow))]/40 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] hover:scale-[1.05] transition-all duration-300 animate-fade-in group relative overflow-hidden" style={{ animationDelay: '0.3s' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--cyan-glow))]/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="flex items-center gap-3 mb-3">
                <Database className="h-6 w-6 text-[hsl(var(--cyan-glow))]/70 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white">Structured Profiles</h3>
              </div>
              <p className="text-white/70 text-sm">Detailed onboarding capturing vertical, traction, stage, and needs</p>
            </div>
            
            <div className="bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/20 rounded-xl p-6 hover:border-[hsl(var(--cyan-glow))]/40 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] hover:scale-[1.05] transition-all duration-300 animate-fade-in group relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--cyan-glow))]/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="flex items-center gap-3 mb-3">
                <Target className="h-6 w-6 text-[hsl(var(--cyan-glow))]/70 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white">Smart Matching</h3>
              </div>
              <p className="text-white/70 text-sm">AI-powered routing based on context, timing, and strategic fit</p>
            </div>
            
            <div className="bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/20 rounded-xl p-6 hover:border-[hsl(var(--cyan-glow))]/40 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] hover:scale-[1.05] transition-all duration-300 animate-fade-in group relative overflow-hidden" style={{ animationDelay: '0.5s' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--cyan-glow))]/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-[hsl(var(--cyan-glow))]/70 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-white">Instant Exchange</h3>
              </div>
              <p className="text-white/70 text-sm">Shared dealrooms with immediate access to pitch materials</p>
            </div>
            
            <div className="bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/20 rounded-xl p-6 hover:border-[hsl(var(--cyan-glow))]/40 hover:shadow-[0_0_20px_rgba(0,255,255,0.15)] hover:scale-[1.05] transition-all duration-300 animate-fade-in group relative overflow-hidden" style={{ animationDelay: '0.6s' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--cyan-glow))]/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-6 w-6 text-[hsl(var(--cyan-glow))]/70 group-hover:scale-110 transition-transform" />
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
