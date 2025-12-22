import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import inSyncLogo from "@/assets/in-sync-logo.png";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Soft gradient background - Atlas inspired */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(200 80% 70% / 0.3) 0%, hsl(var(--navy-deep)) 50%, hsl(var(--navy-deep)) 100%)',
        }}
      />
      
      {/* Floating preview windows - left side */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none">
        <div 
          className="relative -left-20 xl:-left-10"
          style={{ transform: 'perspective(1000px) rotateY(15deg) translateY(-20px)' }}
        >
          <div className="w-72 h-48 rounded-xl bg-gradient-to-br from-cyan-glow/20 to-cyan-glow/5 backdrop-blur-sm border border-white/10 p-4 shadow-2xl">
            <div className="flex gap-1.5 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
            </div>
            <div className="space-y-2">
              <div className="text-xs text-cyan-glow font-medium">🚀 Founder Dashboard</div>
              <div className="h-2 w-3/4 rounded bg-white/10" />
              <div className="h-2 w-1/2 rounded bg-white/10" />
              <div className="flex gap-2 mt-4">
                <div className="h-8 w-16 rounded bg-cyan-glow/30 flex items-center justify-center">
                  <span className="text-[10px] text-cyan-glow">92%</span>
                </div>
                <div className="h-8 flex-1 rounded bg-white/5" />
              </div>
            </div>
          </div>
        </div>
        <div 
          className="relative -left-8 xl:left-4 mt-6"
          style={{ transform: 'perspective(1000px) rotateY(10deg)' }}
        >
          <div className="w-64 h-36 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 p-4 shadow-xl">
            <div className="flex gap-1.5 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
            </div>
            <div className="text-xs text-white/60 mb-2">Match Found</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-glow/20" />
              <div>
                <div className="h-2 w-20 rounded bg-white/20" />
                <div className="h-1.5 w-14 rounded bg-white/10 mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating preview windows - right side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none">
        <div 
          className="relative -right-20 xl:-right-10"
          style={{ transform: 'perspective(1000px) rotateY(-15deg) translateY(-20px)' }}
        >
          <div className="w-72 h-48 rounded-xl bg-gradient-to-br from-cyan-glow/20 to-cyan-glow/5 backdrop-blur-sm border border-white/10 p-4 shadow-2xl">
            <div className="flex gap-1.5 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
            </div>
            <div className="space-y-2">
              <div className="text-xs text-cyan-glow font-medium">💼 Investor Dashboard</div>
              <div className="h-2 w-3/4 rounded bg-white/10" />
              <div className="h-2 w-1/2 rounded bg-white/10" />
              <div className="flex gap-2 mt-4">
                <div className="h-8 w-20 rounded bg-cyan-glow/30 flex items-center justify-center">
                  <span className="text-[10px] text-cyan-glow">12 matches</span>
                </div>
                <div className="h-8 flex-1 rounded bg-white/5" />
              </div>
            </div>
          </div>
        </div>
        <div 
          className="relative -right-8 xl:right-4 mt-6"
          style={{ transform: 'perspective(1000px) rotateY(-10deg)' }}
        >
          <div className="w-64 h-36 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 p-4 shadow-xl">
            <div className="flex gap-1.5 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
            </div>
            <div className="text-xs text-white/60 mb-2">Thesis Match</div>
            <div className="flex flex-wrap gap-1">
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-glow/20 text-cyan-glow">SaaS</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-glow/20 text-cyan-glow">Seed</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-glow/20 text-cyan-glow">B2B</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - centered */}
      <div className="relative z-10 px-4 md:px-6 max-w-3xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <img 
            src={inSyncLogo} 
            alt="In∞Sync" 
            className="w-full max-w-md mx-auto"
            style={{ 
              filter: 'drop-shadow(0 0 60px rgba(6,182,212,0.3))',
            }}
          />
        </div>

        {/* Single clear headline */}
        <h1 
          className="text-xl md:text-2xl lg:text-3xl font-light text-white/90 leading-relaxed mb-8 animate-fade-in"
          style={{ animationDelay: '0.1s' }}
        >
          The AI-powered platform where <span className="text-cyan-glow font-medium">founders</span> meet <span className="text-cyan-glow font-medium">VCs</span> who actually fit their thesis, stage, and sector.
        </h1>

        {/* Dual CTAs - clean and minimal */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          <Button
            size="lg"
            onClick={() => navigate("/founder-application")}
            className="group text-base px-8 py-6 font-medium bg-foreground text-background hover:bg-foreground/90 rounded-full transition-all duration-300 w-full sm:w-auto"
          >
            I'm a Founder
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/investor-application")}
            className="group text-base px-8 py-6 font-medium border-white/20 text-white hover:bg-white/10 rounded-full transition-all duration-300 w-full sm:w-auto"
          >
            I'm an Investor
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Simple trust line */}
        <p 
          className="text-sm text-white/40 mb-16 animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          5-minute setup · Free for founders
        </p>

        {/* Value props - horizontal pills */}
        <div 
          className="flex flex-wrap items-center justify-center gap-3 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="text-cyan-glow">✓</span>
            <span className="text-sm text-white/70">Thesis-matched intros</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="text-cyan-glow">✓</span>
            <span className="text-sm text-white/70">No cold outreach</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="text-cyan-glow">✓</span>
            <span className="text-sm text-white/70">Stage & sector aligned</span>
          </div>
        </div>
      </div>
    </section>
  );
};
