import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export const FloatingParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 95%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 95%)',
      }}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-cyan-glow"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `floatParticle ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--cyan-glow))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--cyan-glow))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--cyan-glow))" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[...Array(8)].map((_, i) => (
          <line
            key={i}
            x1={`${10 + i * 12}%`}
            y1="0%"
            x2={`${20 + i * 10}%`}
            y2="100%"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            style={{
              animation: `linePulse ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </svg>

      <style>{`
        @keyframes floatParticle {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(10px, -20px) scale(1.2);
          }
          50% {
            transform: translate(-5px, -40px) scale(0.8);
          }
          75% {
            transform: translate(15px, -20px) scale(1.1);
          }
        }
        @keyframes linePulse {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
};
