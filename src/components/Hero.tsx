import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] right-[10%] w-[500px] h-[500px] border border-[hsl(var(--cyan-glow))]/25 rounded-full shadow-[0_0_80px_rgba(0,255,255,0.3),inset_0_0_40px_rgba(0,255,255,0.15)] animate-[float_25s_ease-in-out_infinite]" />
        <div className="absolute bottom-[10%] left-[5%] w-[550px] h-[550px] border border-[hsl(var(--cyan-glow))]/20 rounded-full shadow-[0_0_70px_rgba(0,255,255,0.25),inset_0_0_35px_rgba(0,255,255,0.12)] animate-[float_30s_ease-in-out_infinite]" style={{ animationDelay: '8s' }} />
        <div className="absolute top-[50%] right-[5%] w-[400px] h-[400px] border border-white/15 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.2)] animate-[float_28s_ease-in-out_infinite]" style={{ animationDelay: '15s' }} />
        <div className="absolute top-[15%] left-[15%] w-[450px] h-[450px] border border-[hsl(var(--cyan-glow))]/18 rounded-full shadow-[0_0_60px_rgba(0,255,255,0.22)] animate-[float_32s_ease-in-out_infinite]" style={{ animationDelay: '5s' }} />
        <div className="absolute top-[25%] left-[48%] w-2.5 h-2.5 rounded-full bg-[hsl(var(--cyan-glow))]/50 shadow-[0_0_18px_rgba(0,255,255,0.6)] animate-[float_18s_ease-in-out_infinite]" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-[30%] right-[35%] w-2 h-2 rounded-full bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-[float_20s_ease-in-out_infinite]" style={{ animationDelay: '12s' }} />
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
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[hsl(var(--cyan-glow))]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[12%] w-[280px] h-[280px] bg-[hsl(var(--cyan-glow))]/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
};
