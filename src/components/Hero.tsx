import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FloatingParticles } from "./FloatingParticles";
import inSyncLogo from "@/assets/in-sync-logo.png";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-16">
      {/* Floating particles background */}
      <FloatingParticles />
      
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-glow/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-glow/8 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>


      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-2">
          
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
              className="relative w-full max-w-4xl mx-auto"
              style={{ 
                filter: 'drop-shadow(0 0 40px rgba(6,182,212,0.4)) drop-shadow(0 0 80px rgba(6,182,212,0.2))',
              }}
            />
          </div>

          {/* Single tagline */}
          <p className="text-sm md:text-base text-white/50 italic animate-fade-in -mt-6" style={{ animationDelay: '0.1s' }}>
            Where founders and investors sync with their perfect match
          </p>

          {/* Dual CTA */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <Button
              size="lg"
              onClick={() => navigate("/founder-application")}
              className="text-base px-8 py-6 font-semibold bg-cyan-glow text-navy-deep hover:bg-cyan-bright overflow-hidden transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              style={{
                boxShadow: '0 0 30px hsl(var(--cyan-glow) / 0.4)',
              }}
            >
              Join as a Startup
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/investor-application")}
              className="text-base px-8 py-6 font-semibold border-cyan-glow/40 text-cyan-glow hover:bg-cyan-glow/10 hover:border-cyan-glow transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Join as a VC
            </Button>
          </div>

          {/* Login buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in pt-6"
            style={{ animationDelay: '0.3s' }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/auth")}
              className="text-sm text-white/60 hover:text-white hover:bg-white/10"
            >
              Log In
            </Button>
            <span className="text-white/30 hidden sm:inline">|</span>
            <Button
              variant="ghost"
              onClick={() => navigate("/analyst-auth")}
              className="text-sm text-white/60 hover:text-white hover:bg-white/10"
            >
              Log In as a VC Analyst
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
