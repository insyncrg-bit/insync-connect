import { UserPlus, Handshake, BarChart3 } from "lucide-react";

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 relative" style={{ background: 'linear-gradient(180deg, hsl(195 70% 35%) 0%, hsl(180 75% 40%) 100%)' }}>
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              How It Works
            </h2>
            <p className="text-lg text-white/80">
              Three strategic steps from profile to partnership
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/30 rounded-xl p-6 hover:border-[hsl(var(--cyan-glow))]/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/20 border-2 border-[hsl(var(--cyan-glow))]/40 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Join & Profile</h3>
              <p className="text-white/80 text-sm">Complete structured application capturing your stage, sector, and goals</p>
            </div>

            <div className="bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/30 rounded-xl p-6 hover:border-[hsl(var(--cyan-glow))]/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/20 border-2 border-[hsl(var(--cyan-glow))]/40 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <Handshake className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Get Matched</h3>
              <p className="text-white/80 text-sm">AI-powered matching surfaces relevant connections in real-time</p>
            </div>

            <div className="bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/30 rounded-xl p-6 hover:border-[hsl(var(--cyan-glow))]/50 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/20 border-2 border-[hsl(var(--cyan-glow))]/40 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Track Results</h3>
              <p className="text-white/80 text-sm">Monitor engagement and outcomes through your dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
