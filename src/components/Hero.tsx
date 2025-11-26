import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroNetwork from "@/assets/hero-network.jpg";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" style={{ background: 'var(--gradient-navy-teal)' }}>
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] border border-[hsl(var(--cyan-glow))]/30 rounded-full -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] border border-[hsl(var(--cyan-glow))]/20 rounded-full translate-y-1/2" />
        <div className="absolute top-1/4 right-1/3 w-2 h-32 bg-gradient-to-b from-[hsl(var(--cyan-glow))]/50 to-transparent blur-sm" />
        <div className="absolute bottom-1/3 left-1/3 w-32 h-2 bg-gradient-to-r from-[hsl(var(--cyan-glow))]/50 to-transparent blur-sm" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-6 py-2 bg-[hsl(var(--navy-deep))]/60 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/40 rounded-full text-sm font-medium text-[hsl(var(--cyan-glow))] mb-4 shadow-lg">
            High-Fidelity Startup-Investor Matching
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
            Stop Networking.
            <br />
            <span className="text-[hsl(var(--cyan-glow))]">
              Start Connecting.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            In-Sync is the centralized routing system that matches founders with the right investors at the right time—turning random networking into measurable outcomes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 h-auto bg-white text-[hsl(var(--navy-deep))] hover:bg-white/90 shadow-xl border-2 border-[hsl(var(--cyan-glow))]/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all"
              onClick={() => navigate("/founder-application")}
            >
              Join as a Founder
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" className="text-lg px-8 py-6 h-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-[hsl(var(--navy-deep))] transition-all">
              Partner as an Investor
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-[hsl(var(--cyan-glow))]">10x</div>
              <div className="text-sm text-white/70">Connection Quality</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-[hsl(var(--cyan-glow))]">75%</div>
              <div className="text-sm text-white/70">Time Saved</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-[hsl(var(--cyan-glow))]">3x</div>
              <div className="text-sm text-white/70">Deal Flow</div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Orb Effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[hsl(var(--cyan-glow))]/20 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
};
