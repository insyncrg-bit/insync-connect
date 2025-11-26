import { UserPlus, Handshake, BarChart3 } from "lucide-react";

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 relative overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-[25%] w-72 h-72 border border-[hsl(var(--cyan-glow))]/20 rounded-full animate-[spin_28s_linear_infinite]" />
        <div className="absolute bottom-20 right-[18%] w-56 h-56 border border-white/10 rounded-full animate-[spin_24s_linear_infinite_reverse]" />
        <div className="absolute top-1/3 left-[8%] w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))]/35 animate-[float_6.5s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/3 right-[12%] w-1.5 h-1.5 rounded-full bg-white/35 animate-[float_8.5s_ease-in-out_infinite]" style={{ animationDelay: '2.5s' }}></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              <span className="inline-block hover:scale-110 transition-transform duration-300">How It</span> <span className="text-[hsl(var(--cyan-glow))] inline-block hover:scale-110 transition-transform duration-300">Works</span>
            </h2>
            <p className="text-lg text-white/80 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Three strategic steps from profile to partnership
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border-2 border-[hsl(var(--cyan-glow))]/30 rounded-xl p-6 hover:border-[hsl(var(--cyan-glow))]/60 hover:shadow-[0_0_40px_rgba(0,255,255,0.3)] hover:scale-[1.05] transition-all duration-500 animate-fade-in group relative overflow-hidden" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--cyan-glow))]/0 via-[hsl(var(--cyan-glow))]/5 to-[hsl(var(--cyan-glow))]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/20 border-2 border-[hsl(var(--cyan-glow))]/40 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <UserPlus className="h-6 w-6 text-white group-hover:text-[hsl(var(--cyan-glow))] transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Join & Profile</h3>
                <p className="text-white/80 text-sm">Complete structured application capturing your stage, sector, and goals</p>
              </div>
            </div>

            <div className="bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border-2 border-[hsl(var(--cyan-glow))]/30 rounded-xl p-6 hover:border-[hsl(var(--cyan-glow))]/60 hover:shadow-[0_0_40px_rgba(0,255,255,0.3)] hover:scale-[1.05] transition-all duration-500 animate-fade-in group relative overflow-hidden" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--cyan-glow))]/0 via-[hsl(var(--cyan-glow))]/5 to-[hsl(var(--cyan-glow))]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/20 border-2 border-[hsl(var(--cyan-glow))]/40 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                    2
                  </div>
                  <Handshake className="h-6 w-6 text-white group-hover:text-[hsl(var(--cyan-glow))] transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Get Matched</h3>
                <p className="text-white/80 text-sm">AI-powered matching surfaces relevant connections in real-time</p>
              </div>
            </div>

            <div className="bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border-2 border-[hsl(var(--cyan-glow))]/30 rounded-xl p-6 hover:border-[hsl(var(--cyan-glow))]/60 hover:shadow-[0_0_40px_rgba(0,255,255,0.3)] hover:scale-[1.05] transition-all duration-500 animate-fade-in group relative overflow-hidden" style={{ animationDelay: '0.7s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--cyan-glow))]/0 via-[hsl(var(--cyan-glow))]/5 to-[hsl(var(--cyan-glow))]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/20 border-2 border-[hsl(var(--cyan-glow))]/40 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                    3
                  </div>
                  <BarChart3 className="h-6 w-6 text-white group-hover:text-[hsl(var(--cyan-glow))] transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Track Results</h3>
                <p className="text-white/80 text-sm">Monitor engagement and outcomes through your dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
