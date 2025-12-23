import { FloatingParticles } from "./FloatingParticles";

export const DashboardBackground = () => {
  return (
    <>
      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FloatingParticles />
      </div>
      
      {/* Gradient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-glow/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-glow/8 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid pattern overlay with fade */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
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
    </>
  );
};
