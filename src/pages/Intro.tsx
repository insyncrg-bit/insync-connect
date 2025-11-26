import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-lg">
              Get Ready to
            </h1>
            <div className="space-y-2">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white animate-fade-in" style={{ animationDelay: '0.3s' }}>
                Stop Networking.
              </h2>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[hsl(var(--cyan-glow))] animate-fade-in" style={{ animationDelay: '0.6s' }}>
                Start Connecting.
              </h2>
            </div>
          </div>

          {/* Dynamic Infinity with Moving Gradient */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <div className="relative">
              {/* Subtle pulsing glow background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-[hsl(var(--cyan-glow))]/15 rounded-full blur-3xl animate-pulse"></div>
              </div>
              
              {/* Infinity icon with animated gradient */}
              <div className="relative z-10 p-12">
                <svg 
                  className="w-32 h-32 md:w-40 md:h-40" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--cyan-glow))" stopOpacity="0.4">
                        <animate attributeName="offset" values="0;1;0" dur="3s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="50%" stopColor="hsl(var(--cyan-glow))" stopOpacity="1">
                        <animate attributeName="offset" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="100%" stopColor="hsl(var(--cyan-glow))" stopOpacity="0.4">
                        <animate attributeName="offset" values="1;0;1" dur="3s" repeatCount="indefinite" />
                      </stop>
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <path 
                    d="M18.178 8c1.038 0 1.922.67 2.078 1.66.158 1.001-.635 1.84-1.648 1.84-1.933 0-3.326 1.555-3.326 3.5s1.393 3.5 3.326 3.5c1.013 0 1.806.839 1.648 1.84-.156.99-1.04 1.66-2.078 1.66-3.435 0-6.178-2.685-6.178-6s2.743-6 6.178-6zm-12.356 0c3.435 0 6.178 2.685 6.178 6s-2.743 6-6.178 6c-1.038 0-1.922-.67-2.078-1.66-.158-1.001.635-1.84 1.648-1.84 1.933 0 3.326-1.555 3.326-3.5s-1.393-3.5-3.326-3.5c-1.013 0-1.806-.839-1.648-1.84.156-.99 1.04-1.66 2.078-1.66z" 
                    stroke="url(#infinityGradient)" 
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                  />
                </svg>
              </div>

              {/* Flowing particles */}
              <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))]/70 shadow-[0_0_15px_rgba(0,255,255,0.8)]" style={{ animation: 'float 4s ease-in-out infinite' }}></div>
              <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))]/70 shadow-[0_0_15px_rgba(0,255,255,0.8)]" style={{ animation: 'float 4s ease-in-out infinite', animationDelay: '2s' }}></div>
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
