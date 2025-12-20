import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FloatingParticles } from "./FloatingParticles";
import { ArrowRight, Users, Briefcase } from "lucide-react";
import inSyncLogo from "@/assets/in-sync-logo.png";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-24">
      {/* Floating particles background */}
      <FloatingParticles />
      
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-glow/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-glow/8 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid pattern overlay with fade */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--cyan-glow)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--cyan-glow)) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          opacity: 0.03,
          maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 95%)',
        }}
      />

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          
          {/* Logo with pulsing glow */}
          <div className="relative animate-fade-in">
            <div 
              className="absolute inset-0 blur-[80px] animate-glow-pulse"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.5) 0%, rgba(6,182,212,0.2) 40%, transparent 70%)',
              }}
            />
            <img 
              src={inSyncLogo} 
              alt="In∞Sync" 
              className="relative w-full max-w-2xl mx-auto"
              style={{ 
                filter: 'drop-shadow(0 0 40px rgba(6,182,212,0.4)) drop-shadow(0 0 80px rgba(6,182,212,0.2))',
              }}
            />
          </div>

          {/* Universal value proposition - works for both audiences */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white/95 leading-tight tracking-tight">
              Where founders and investors <br className="hidden sm:block" />
              <span className="text-cyan-glow font-medium">find their perfect match</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
              AI-powered matching based on thesis, stage, and sector alignment. 
              No more cold outreach. Just warm intros that make sense.
            </p>
          </div>

          {/* Dual CTA - Equal weight for both audiences */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            {/* Founder CTA */}
            <Button
              size="lg"
              onClick={() => navigate("/founder-application")}
              className="group relative text-base px-8 py-6 font-semibold bg-cyan-glow text-navy-deep hover:bg-cyan-bright overflow-hidden transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              style={{
                boxShadow: '0 0 30px hsl(var(--cyan-glow) / 0.4)',
              }}
            >
              <Users className="w-5 h-5 mr-2" />
              <span>Join as a Startup</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>

            {/* Investor CTA */}
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/investor-application")}
              className="group relative text-base px-8 py-6 font-semibold border-cyan-glow/40 text-cyan-glow hover:bg-cyan-glow/10 hover:border-cyan-glow transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              <Briefcase className="w-5 h-5 mr-2" />
              <span>Join as a VC</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Dual value props - side by side */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-8 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            {/* Founders perspective */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left hover:border-cyan-glow/30 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-glow/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-cyan-glow" />
                </div>
                <span className="text-sm font-medium text-cyan-glow">For Founders</span>
              </div>
              <h3 className="text-white font-medium mb-2">
                Stop chasing. Start matching.
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Get introduced to VCs who are actively looking for your stage, sector, and business model. Free to use.
              </p>
            </div>

            {/* Investors perspective */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left hover:border-cyan-glow/30 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-cyan-glow/20 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-cyan-glow" />
                </div>
                <span className="text-sm font-medium text-cyan-glow">For Investors</span>
              </div>
              <h3 className="text-white font-medium mb-2">
                See only what fits your thesis.
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                No more filtering through noise. Get curated deal flow that matches your investment criteria exactly.
              </p>
            </div>
          </div>

          {/* Trust element */}
          <p 
            className="text-xs text-white/40 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            5-minute setup • AI-powered matching • Quality over quantity
          </p>
        </div>
      </div>

      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        .animate-glow-pulse {
          animation: glow-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
