import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Dynamic Network Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Connection nodes */}
        <div className="absolute top-[15%] left-[12%] w-3 h-3 rounded-full bg-[hsl(var(--cyan-glow))]/40 shadow-[0_0_20px_rgba(0,255,255,0.6)] animate-pulse" />
        <div className="absolute top-[25%] right-[18%] w-2.5 h-2.5 rounded-full bg-[hsl(var(--cyan-glow))]/35 shadow-[0_0_15px_rgba(0,255,255,0.5)]" style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '0.5s' }} />
        <div className="absolute top-[45%] left-[8%] w-2 h-2 rounded-full bg-white/30 shadow-[0_0_12px_rgba(255,255,255,0.4)]" style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '1s' }} />
        <div className="absolute top-[60%] right-[15%] w-3 h-3 rounded-full bg-[hsl(var(--cyan-glow))]/40 shadow-[0_0_20px_rgba(0,255,255,0.6)]" style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '1.5s' }} />
        <div className="absolute bottom-[20%] left-[20%] w-2.5 h-2.5 rounded-full bg-[hsl(var(--cyan-glow))]/35 shadow-[0_0_15px_rgba(0,255,255,0.5)]" style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '2s' }} />
        <div className="absolute bottom-[30%] right-[25%] w-2 h-2 rounded-full bg-white/30 shadow-[0_0_12px_rgba(255,255,255,0.4)]" style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '2.5s' }} />
        <div className="absolute top-[35%] right-[35%] w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))]/30 shadow-[0_0_10px_rgba(0,255,255,0.4)]" style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '0.8s' }} />
        <div className="absolute bottom-[45%] left-[30%] w-2 h-2 rounded-full bg-white/25 shadow-[0_0_10px_rgba(255,255,255,0.3)]" style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '1.8s' }} />
        
        {/* Connection lines - using SVG for dynamic lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--cyan-glow))" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(var(--cyan-glow))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--cyan-glow))" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <line x1="12%" y1="15%" x2="82%" y2="25%" stroke="url(#line-gradient)" strokeWidth="1">
            <animate attributeName="stroke-opacity" values="0.1;0.4;0.1" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="82%" y1="25%" x2="85%" y2="60%" stroke="url(#line-gradient)" strokeWidth="1">
            <animate attributeName="stroke-opacity" values="0.1;0.4;0.1" dur="5s" repeatCount="indefinite" begin="0.5s" />
          </line>
          <line x1="12%" y1="15%" x2="8%" y2="45%" stroke="url(#line-gradient)" strokeWidth="1">
            <animate attributeName="stroke-opacity" values="0.1;0.4;0.1" dur="4.5s" repeatCount="indefinite" begin="1s" />
          </line>
          <line x1="8%" y1="45%" x2="20%" y2="80%" stroke="url(#line-gradient)" strokeWidth="1">
            <animate attributeName="stroke-opacity" values="0.1;0.4;0.1" dur="5.5s" repeatCount="indefinite" begin="1.5s" />
          </line>
          <line x1="85%" y1="60%" x2="75%" y2="70%" stroke="url(#line-gradient)" strokeWidth="1">
            <animate attributeName="stroke-opacity" values="0.1;0.4;0.1" dur="4.8s" repeatCount="indefinite" begin="2s" />
          </line>
          <line x1="20%" y1="80%" x2="65%" y2="35%" stroke="url(#line-gradient)" strokeWidth="1">
            <animate attributeName="stroke-opacity" values="0.1;0.4;0.1" dur="5.2s" repeatCount="indefinite" begin="2.5s" />
          </line>
        </svg>
        
        {/* Subtle geometric accents */}
        <div className="absolute top-[10%] right-[5%] w-[450px] h-[450px] border border-[hsl(var(--cyan-glow))]/5 rounded-full shadow-[0_0_100px_rgba(0,255,255,0.2),inset_0_0_70px_rgba(0,255,255,0.1)]" style={{ animation: 'float 40s ease-in-out infinite' }} />
        <div className="absolute bottom-[8%] left-[8%] w-[450px] h-[450px] border border-[hsl(var(--cyan-glow))]/5 rounded-full shadow-[0_0_100px_rgba(0,255,255,0.2),inset_0_0_70px_rgba(0,255,255,0.1)]" style={{ animation: 'float 45s ease-in-out infinite', animationDelay: '5s' }} />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-6 py-2 bg-[hsl(var(--navy-deep))]/60 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/40 rounded-full text-sm font-medium text-[hsl(var(--cyan-glow))] mb-4 shadow-lg">
            High-Fidelity Startup-Investor Matching
          </div>
          
          <div 
            className="cursor-pointer transition-all duration-500 hover:scale-105"
            onClick={() => navigate("/platform")}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white drop-shadow-lg hover:animate-pulse">
              In<span className="text-[hsl(var(--cyan-glow))]">∞</span>Sync
            </h1>
            <p className="text-sm text-white/50 mt-4">Click to explore</p>
          </div>
        </div>
      </div>

      {/* Energy gradient effects */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[hsl(var(--cyan-glow))]/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[10%] right-[5%] w-[300px] h-[300px] bg-[hsl(var(--cyan-glow))]/6 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
};
