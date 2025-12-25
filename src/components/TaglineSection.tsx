import { FloatingParticles } from "./FloatingParticles";

export const TaglineSection = () => {
  return (
    <section className="relative min-h-[120vh] flex items-center justify-center overflow-hidden py-32 md:py-48 lg:py-64">
      {/* Floating particles background */}
      <FloatingParticles />
      
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full bg-cyan-glow/20 blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-glow/15 blur-[130px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-cyan-glow/25 blur-[100px] animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Tagline with glow */}
      <div className="relative z-10 text-center animate-fade-in">
        <div 
          className="absolute inset-0 blur-[100px] animate-glow-pulse"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.7) 0%, rgba(6,182,212,0.3) 40%, transparent 70%)',
          }}
        />
        <h2 
          className="relative text-3xl md:text-5xl lg:text-7xl font-light tracking-[0.3em] text-white/90"
          style={{ 
            filter: 'drop-shadow(0 0 60px rgba(6,182,212,0.6)) drop-shadow(0 0 120px rgba(6,182,212,0.4))',
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
