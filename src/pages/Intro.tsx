import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Infinity } from "lucide-react";

export default function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-transition to platform page after animation
    const timer = setTimeout(() => {
      navigate("/platform");
    }, 2500);

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
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight drop-shadow-lg">
              <span className="text-white">Get Ready to </span>
              <span className="text-white animate-fade-in" style={{ animationDelay: '0.2s' }}>Stop Networking</span>
              <span className="text-white">.</span>
            </h1>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[hsl(var(--cyan-glow))] animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Start Connecting.
            </h2>
          </div>

          {/* Dynamic Infinity Loading Symbol */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="relative">
              {/* Multiple spinning rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-[hsl(var(--cyan-glow))]/40 rounded-full animate-[spin_2s_linear_infinite]"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 border-2 border-[hsl(var(--cyan-glow))]/30 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-[hsl(var(--cyan-glow))]/20 rounded-full animate-[spin_1s_linear_infinite]"></div>
              </div>
              
              {/* Pulsing glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-56 bg-[hsl(var(--cyan-glow))]/10 rounded-full blur-3xl animate-pulse"></div>
              </div>
              
              {/* Main infinity icon with rotation */}
              <div className="relative z-10 p-12 bg-[hsl(var(--navy-deep))]/80 backdrop-blur-sm border-2 border-[hsl(var(--cyan-glow))]/60 rounded-full shadow-[0_0_100px_rgba(0,255,255,0.5)]">
                <Infinity className="w-24 h-24 md:w-32 md:h-32 text-[hsl(var(--cyan-glow))] animate-[spin_3s_ease-in-out_infinite]" strokeWidth={2.5} />
              </div>

              {/* Orbiting particles */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[hsl(var(--cyan-glow))] shadow-[0_0_20px_rgba(0,255,255,0.8)] animate-[spin_2s_linear_infinite]"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white/60 shadow-[0_0_15px_rgba(255,255,255,0.6)] animate-[spin_2s_linear_infinite]" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))]/70 shadow-[0_0_12px_rgba(0,255,255,0.7)] animate-[spin_2s_linear_infinite]" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>

          {/* Loading indicator */}
          <div className="animate-fade-in space-y-4" style={{ animationDelay: '0.8s' }}>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))] animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))] animate-pulse" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))] animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            </div>
            <p className="text-white/60 text-sm">Loading your path...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
