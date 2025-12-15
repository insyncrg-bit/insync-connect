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
          <div className="space-y-6 animate-fade-in text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white/90 drop-shadow-lg">
              Get Ready to
            </h1>
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white animate-fade-in drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]" style={{ animationDelay: '0.2s' }}>
                Stop Networking.
              </h2>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[hsl(var(--cyan-glow))] animate-fade-in drop-shadow-[0_0_30px_rgba(0,255,255,0.5)]" style={{ animationDelay: '0.4s' }}>
                Start Connecting.
              </h2>
            </div>
          </div>

          {/* Dynamic Infinity Symbol */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <div className="relative">
              {/* 3D Grid/Mesh effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Horizontal scan lines */}
                <div className="absolute w-72 h-48 overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={`h-${i}`}
                      className="absolute w-full h-px bg-gradient-to-r from-transparent via-[hsl(var(--cyan-glow))]/40 to-transparent"
                      style={{ 
                        top: `${(i + 1) * 12}%`,
                        animation: `pulse 2s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                {/* Vertical scan lines */}
                <div className="absolute w-72 h-48 overflow-hidden">
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={`v-${i}`}
                      className="absolute h-full w-px bg-gradient-to-b from-transparent via-[hsl(var(--cyan-glow))]/30 to-transparent"
                      style={{ 
                        left: `${(i + 1) * 9}%`,
                        animation: `pulse 2.5s ease-in-out infinite`,
                        animationDelay: `${i * 0.15}s`
                      }}
                    />
                  ))}
                </div>
                {/* Perspective diamond frame */}
                <div 
                  className="absolute w-56 h-56 border border-[hsl(var(--cyan-glow))]/20 rotate-45"
                  style={{ 
                    boxShadow: '0 0 40px rgba(0, 255, 255, 0.1), inset 0 0 40px rgba(0, 255, 255, 0.05)'
                  }}
                />
                <div 
                  className="absolute w-40 h-40 border border-[hsl(var(--cyan-glow))]/30 rotate-45 animate-pulse"
                  style={{ 
                    boxShadow: '0 0 30px rgba(0, 255, 255, 0.15), inset 0 0 30px rgba(0, 255, 255, 0.1)'
                  }}
                />
              </div>
              
              {/* Infinity icon - same as navigation logo */}
              <div className="relative z-10 p-12">
                <Infinity 
                  className="w-32 h-32 md:w-40 md:h-40 text-[hsl(var(--cyan-glow))] animate-pulse drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]" 
                  strokeWidth={2.5} 
                />
              </div>
            </div>
          </div>

          {/* Loading indicator */}
          <div className="animate-fade-in space-y-4" style={{ animationDelay: '1.2s' }}>
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
