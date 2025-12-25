import { FloatingParticles } from "./FloatingParticles";

export const TaglineSection = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Floating particles background */}
      <FloatingParticles />
      
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-cyan-glow/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] rounded-full bg-cyan-glow/8 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Tagline with glow */}
      <div className="relative z-10 text-center animate-fade-in">
        <div 
          className="absolute inset-0 blur-[80px] animate-glow-pulse"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.5) 0%, rgba(6,182,212,0.2) 40%, transparent 70%)',
          }}
        />
        <h2 
          className="relative text-3xl md:text-5xl lg:text-7xl font-light tracking-[0.3em] text-white/90"
          style={{ 
            filter: 'drop-shadow(0 0 40px rgba(6,182,212,0.4)) drop-shadow(0 0 80px rgba(6,182,212,0.2))',
          }}
        >
          simple. curated. effective.
        </h2>
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
