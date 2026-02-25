import { Button } from "@/components/ui/button";
import { FloatingParticles } from "./FloatingParticles";
import { useNavigate } from "react-router-dom";
import inSyncLogo from "../assets/in-sync-logo.png";

export const Hero = () => {
  const navigate = useNavigate();

  const handleHowItWorksClick = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        <div className="max-w-5xl mx-auto text-center space-y-1">

          {/* Tagline above logo */}
          <p className="text-sm md:text-base text-white/50 italic animate-fade-in mb-2">
            Where founders and investors sync with their perfect match
          </p>

          {/* Logo with pulsing glow */}
          <div className="relative animate-fade-in -my-2" style={{ animationDelay: '0.1s' }}>
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

          {/* Unified CTAs - For Founders + For VCs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in pt-2"
            style={{ animationDelay: '0.2s' }}
          >
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="text-base px-8 py-6 font-semibold bg-cyan-glow text-navy-deep hover:bg-cyan-bright overflow-hidden transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              style={{
                boxShadow: '0 0 30px hsl(var(--cyan-glow) / 0.4)',
              }}
            >
              Founders
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="text-base px-8 py-6 font-semibold border-cyan-glow/40 text-cyan-glow hover:bg-cyan-glow/10 hover:border-cyan-glow transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              VCs
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