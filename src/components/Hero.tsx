import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] border-2 border-[hsl(var(--cyan-glow))]/30 rounded-full -translate-y-1/2 animate-[spin_25s_linear_infinite] shadow-[0_0_100px_rgba(0,255,255,0.4),inset_0_0_60px_rgba(0,255,255,0.2)]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] border-2 border-[hsl(var(--cyan-glow))]/25 rounded-full translate-y-1/2 animate-[spin_18s_linear_infinite_reverse] shadow-[0_0_80px_rgba(0,255,255,0.3),inset_0_0_50px_rgba(0,255,255,0.15)]" />
        <div className="absolute top-1/3 left-[40%] w-[350px] h-[350px] border border-white/15 rounded-full animate-[float_12s_ease-in-out_infinite] shadow-[0_0_60px_rgba(255,255,255,0.2)]" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/4 right-1/3 w-3 h-3 rounded-full bg-[hsl(var(--cyan-glow))]/70 animate-[float_7s_ease-in-out_infinite] shadow-[0_0_25px_rgba(0,255,255,0.8)] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 rounded-full bg-[hsl(var(--cyan-glow))]/50 animate-[float_9s_ease-in-out_infinite] shadow-[0_0_20px_rgba(0,255,255,0.6)]" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-[15%] w-2 h-2 rounded-full bg-white/40 animate-[float_8s_ease-in-out_infinite] shadow-[0_0_18px_rgba(255,255,255,0.5)]" style={{ animationDelay: '4s' }} />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-6 py-2 bg-[hsl(var(--navy-deep))]/60 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/40 rounded-full text-sm font-medium text-[hsl(var(--cyan-glow))] mb-4 shadow-lg">
            High-Fidelity Startup-Investor Matching
          </div>
          
          <div 
            className="cursor-pointer transition-all duration-500 hover:scale-105"
            onClick={() => navigate("/platform")}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white drop-shadow-lg hover:animate-pulse">
              In<span className="text-[hsl(var(--cyan-glow))]">∞</span>Sync
            </h1>
            <p className="text-sm text-white/50 mt-4">Click to explore</p>
          </div>
        </div>
      </div>

      {/* Gradient Orb Effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[hsl(var(--cyan-glow))]/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/4 right-[10%] w-[300px] h-[300px] bg-[hsl(var(--cyan-glow))]/10 rounded-full blur-[100px] pointer-events-none animate-[float_12s_ease-in-out_infinite]" style={{ animationDelay: '3s' }} />
    </section>
  );
};
