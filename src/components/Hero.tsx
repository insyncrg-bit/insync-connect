import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] border border-[hsl(var(--cyan-glow))]/20 rounded-full -translate-y-1/2 shadow-[0_0_60px_rgba(0,255,255,0.2)] animate-[float_30s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] border border-[hsl(var(--cyan-glow))]/15 rounded-full translate-y-1/2 shadow-[0_0_50px_rgba(0,255,255,0.15)] animate-[float_35s_ease-in-out_infinite]" style={{ animationDelay: '10s' }} />
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
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[hsl(var(--cyan-glow))]/10 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
};
