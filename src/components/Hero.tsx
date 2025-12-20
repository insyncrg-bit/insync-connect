import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FloatingParticles } from "./FloatingParticles";
import { ArrowRight } from "lucide-react";
import inSyncLogo from "@/assets/in-sync-logo.png";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
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
          maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          
          {/* Logo with pulsing glow */}
          <div className="relative animate-fade-in">
            {/* Pulsing glow behind logo */}
            <div 
              className="absolute inset-0 blur-[80px] animate-glow-pulse"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.5) 0%, rgba(6,182,212,0.2) 40%, transparent 70%)',
              }}
            />
            <img 
              src={inSyncLogo} 
              alt="In∞Sync" 
              className="relative w-full max-w-4xl mx-auto"
              style={{ 
                filter: 'drop-shadow(0 0 40px rgba(6,182,212,0.4)) drop-shadow(0 0 80px rgba(6,182,212,0.2))',
              }}
            />
          </div>

          {/* Tagline */}
          <p 
            className="text-xl md:text-2xl text-white/80 font-light max-w-xl mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: '0.15s' }}
          >
            Find investors who <span className="text-cyan-glow font-medium">actually fit</span> your startup.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in" 
            style={{ animationDelay: '0.25s' }}
          >
            <Button
              size="lg"
              onClick={() => navigate("/founder-application")}
              className="group relative text-base px-10 py-6 font-semibold bg-cyan-glow text-navy-deep hover:bg-cyan-bright overflow-hidden transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: '0 0 30px hsl(var(--cyan-glow) / 0.4), 0 0 60px hsl(var(--cyan-glow) / 0.2)',
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Join as a Startup
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/investor-application")}
              className="group text-base px-10 py-6 font-semibold border-2 border-cyan-glow/40 text-white bg-navy-deep/60 backdrop-blur-sm hover:bg-cyan-glow/15 hover:border-cyan-glow transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: '0 0 20px hsl(var(--cyan-glow) / 0.15)',
              }}
            >
              <span className="flex items-center gap-2">
                Join as a VC
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </div>
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
