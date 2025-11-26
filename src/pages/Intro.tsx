import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Infinity } from "lucide-react";

export default function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-transition to platform page after animation
    const timer = setTimeout(() => {
      navigate("/platform");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{ background: 'linear-gradient(180deg, hsl(220 60% 15%) 0%, hsl(200 65% 25%) 25%, hsl(180 65% 35%) 50%, hsl(200 65% 25%) 75%, hsl(220 60% 15%) 100%)' }}>
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-[10%] w-96 h-96 bg-[hsl(var(--cyan-glow))]/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]"></div>
        <div className="absolute top-1/3 right-[15%] w-80 h-80 bg-[hsl(var(--cyan-glow))]/5 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-[20%] w-72 h-72 bg-white/5 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite]" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-16">
          {/* Main message */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-lg">
              Get Ready to
            </h1>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-white animate-fade-in" style={{ animationDelay: '0.5s' }}>Stop Networking.</span>
              <br />
              <span className="text-[hsl(var(--cyan-glow))] animate-fade-in" style={{ animationDelay: '1s' }}>Start Connecting.</span>
            </h2>
          </div>

          {/* Dynamic Infinity Sign */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '1.5s' }}>
            <div className="relative">
              {/* Pulsing glow rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 border-2 border-[hsl(var(--cyan-glow))]/30 rounded-full animate-ping"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center" style={{ animationDelay: '0.5s' }}>
                <div className="w-32 h-32 border-2 border-[hsl(var(--cyan-glow))]/20 rounded-full animate-ping"></div>
              </div>
              
              {/* Main infinity icon */}
              <div className="relative z-10 p-12 bg-[hsl(var(--navy-deep))]/60 backdrop-blur-sm border-2 border-[hsl(var(--cyan-glow))]/50 rounded-full shadow-[0_0_80px_rgba(0,255,255,0.4)]">
                <Infinity className="w-24 h-24 md:w-32 md:h-32 text-[hsl(var(--cyan-glow))] animate-pulse" strokeWidth={2} />
              </div>

              {/* Orbiting particles */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[hsl(var(--cyan-glow))] shadow-[0_0_20px_rgba(0,255,255,0.8)]" style={{ animation: 'spin 4s linear infinite' }}></div>
            </div>
          </div>

          {/* Loading indicator */}
          <div className="animate-fade-in space-y-4" style={{ animationDelay: '2s' }}>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))] animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-white/60 text-sm">Preparing your experience...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
