import { useEffect, useRef, useState } from "react";

export const AnimatedInfinity = () => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const offsetX = (mousePos.x - 0.5) * 20;
  const offsetY = (mousePos.y - 0.5) * 10;

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Glow layers */}
      <div 
        className="absolute inset-0 blur-[80px] opacity-60 transition-transform duration-300"
        style={{
          background: `radial-gradient(ellipse at ${50 + offsetX}% ${50 + offsetY}%, hsl(var(--cyan-glow)) 0%, transparent 70%)`,
          transform: `translate(${offsetX * 0.5}px, ${offsetY * 0.5}px)`,
        }}
      />
      
      {/* Main SVG */}
      <svg
        viewBox="0 0 400 200"
        className="w-full h-auto relative z-10"
        style={{ filter: 'drop-shadow(0 0 30px hsl(var(--cyan-glow) / 0.6))' }}
      >
        <defs>
          <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--cyan-glow))" />
            <stop offset="50%" stopColor="hsl(var(--cyan-bright))" />
            <stop offset="100%" stopColor="hsl(var(--cyan-glow))" />
          </linearGradient>
          <linearGradient id="infinityGradientAlt" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--cyan-bright))" />
            <stop offset="50%" stopColor="white" />
            <stop offset="100%" stopColor="hsl(var(--cyan-bright))" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Animated infinity path - outer glow */}
        <path
          d="M200 100 C200 60, 260 40, 300 40 C350 40, 380 70, 380 100 C380 130, 350 160, 300 160 C260 160, 200 140, 200 100 C200 60, 140 40, 100 40 C50 40, 20 70, 20 100 C20 130, 50 160, 100 160 C140 160, 200 140, 200 100"
          fill="none"
          stroke="url(#infinityGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          className="animate-infinity-draw"
          style={{
            strokeDasharray: "1200",
            strokeDashoffset: "0",
            animation: "infinityFlow 4s linear infinite",
          }}
        />

        {/* Inner bright line */}
        <path
          d="M200 100 C200 60, 260 40, 300 40 C350 40, 380 70, 380 100 C380 130, 350 160, 300 160 C260 160, 200 140, 200 100 C200 60, 140 40, 100 40 C50 40, 20 70, 20 100 C20 130, 50 160, 100 160 C140 160, 200 140, 200 100"
          fill="none"
          stroke="url(#infinityGradientAlt)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#glow)"
          style={{
            strokeDasharray: "100 1100",
            animation: "infinityPulse 4s linear infinite",
          }}
        />

        {/* Floating particles along path */}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            r="3"
            fill="hsl(var(--cyan-bright))"
            filter="url(#glow)"
            style={{
              animation: `particleFloat${i} ${3 + i * 0.5}s ease-in-out infinite`,
            }}
          >
            <animateMotion
              dur={`${4 + i}s`}
              repeatCount="indefinite"
              path="M200 100 C200 60, 260 40, 300 40 C350 40, 380 70, 380 100 C380 130, 350 160, 300 160 C260 160, 200 140, 200 100 C200 60, 140 40, 100 40 C50 40, 20 70, 20 100 C20 130, 50 160, 100 160 C140 160, 200 140, 200 100"
              begin={`${i * 0.8}s`}
            />
          </circle>
        ))}
      </svg>

      {/* Text overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="text-white">In</span>
            <span 
              className="text-cyan-glow"
              style={{ 
                textShadow: '0 0 40px hsl(var(--cyan-glow) / 0.8), 0 0 80px hsl(var(--cyan-glow) / 0.4)',
              }}
            >
              ∞
            </span>
            <span className="text-white">Sync</span>
          </h1>
        </div>
      </div>

      <style>{`
        @keyframes infinityFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -1200; }
        }
        @keyframes infinityPulse {
          0% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -1200; opacity: 1; }
        }
      `}</style>
    </div>
  );
};
