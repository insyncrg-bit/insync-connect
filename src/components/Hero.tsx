import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[8%] right-[8%] w-[500px] h-[500px] border border-[hsl(var(--cyan-glow))]/20 rounded-full shadow-[0_0_60px_rgba(0,255,255,0.25)] animate-[float_30s_ease-in-out_infinite]" />
        <div className="absolute bottom-[12%] left-[10%] w-[450px] h-[450px] border border-white/12 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.15)] animate-[float_35s_ease-in-out_infinite]" style={{ animationDelay: '10s' }} />
        <div className="absolute top-[40%] left-[45%] w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))]/40 shadow-[0_0_15px_rgba(0,255,255,0.5)] animate-[float_20s_ease-in-out_infinite]" style={{ animationDelay: '5s' }} />
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
      <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[hsl(var(--cyan-glow))]/12 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
};
