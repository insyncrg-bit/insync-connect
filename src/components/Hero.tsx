import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FloatingParticles } from "./FloatingParticles";
import { ArrowRight, Target, Zap, Shield } from "lucide-react";
import inSyncLogo from "@/assets/in-sync-logo.png";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-24">
      {/* Floating particles background */}
      <FloatingParticles />
      
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-glow/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-glow/8 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid pattern overlay with fade */}
      <div 
        className="absolute inset-0 pointer-events-none"
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

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          {/* Who it's for - instant clarity */}
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-glow/10 border border-cyan-glow/20 text-cyan-glow text-sm font-medium">
              <Target className="w-4 h-4" />
              For early-stage founders raising their first round
            </span>
          </div>

          {/* Logo with pulsing glow */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {/* Pulsing glow behind logo */}
            <div 
              className="absolute inset-0 blur-[80px] animate-glow-pulse"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.5) 0%, rgba(6,182,212,0.2) 40%, transparent 70%)',
              }}
            />
            <img 
              src={inSyncLogo} 
              alt="In∞Sync" 
              className="relative w-full max-w-3xl mx-auto"
              style={{ 
                filter: 'drop-shadow(0 0 40px rgba(6,182,212,0.4)) drop-shadow(0 0 80px rgba(6,182,212,0.2))',
              }}
            />
          </div>

          {/* Clear outcome statement */}
          <div 
            className="space-y-4 animate-fade-in"
            style={{ animationDelay: '0.15s' }}
          >
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
              Stop chasing VCs who'll never invest. <br className="hidden sm:block" />
              <span className="text-cyan-glow font-medium">Get matched with investors actively looking for you.</span>
            </p>
          </div>

          {/* How it's different - mini value props */}
          <div 
            className="flex flex-wrap justify-center gap-6 text-sm text-white/60 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-glow" />
              <span>Thesis-matched intros</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-glow" />
              <span>No cold outreach</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-glow" />
              <span>Stage & sector aligned</span>
            </div>
          </div>

          {/* Primary CTA - Single clear action */}
          <div 
            className="flex flex-col items-center gap-4 pt-4 animate-fade-in" 
            style={{ animationDelay: '0.25s' }}
          >
            <Button
              size="lg"
              onClick={() => navigate("/founder-application")}
              className="group relative text-lg px-12 py-7 font-semibold bg-cyan-glow text-navy-deep hover:bg-cyan-bright overflow-hidden transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: '0 0 30px hsl(var(--cyan-glow) / 0.4), 0 0 60px hsl(var(--cyan-glow) / 0.2)',
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Matched with VCs
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            
            {/* Secondary option - less prominent */}
            <button
              onClick={() => navigate("/investor-application")}
              className="text-sm text-white/50 hover:text-cyan-glow transition-colors underline-offset-4 hover:underline"
            >
              I'm an investor looking for startups →
            </button>
          </div>

          {/* Trust element - process transparency */}
          <p 
            className="text-xs text-white/40 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            Takes 5 minutes • Free for founders • Only see investors who match your stage & sector
          </p>

          {/* Visual product preview */}
          <div 
            className="relative mt-12 animate-fade-in"
            style={{ animationDelay: '0.35s' }}
          >
            <div className="relative mx-auto max-w-4xl">
              {/* Glow behind the preview */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-glow/20 via-cyan-glow/5 to-transparent blur-3xl" />
              
              {/* Mock dashboard preview */}
              <div className="relative bg-navy-deep/80 backdrop-blur-xl border border-cyan-glow/20 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                  </div>
                  <span className="text-xs text-white/40 ml-2">Your Matched Investors</span>
                </div>
                
                {/* Mock investor cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "Sequoia Capital", match: "94%", focus: "B2B SaaS • Series A" },
                    { name: "a]6z", match: "91%", focus: "AI/ML • Seed" },
                    { name: "First Round", match: "88%", focus: "Consumer • Pre-seed" },
                  ].map((investor, i) => (
                    <div 
                      key={i}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-cyan-glow/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-glow/30 to-cyan-glow/10" />
                        <span className="text-cyan-glow font-bold text-sm">{investor.match}</span>
                      </div>
                      <p className="text-white font-medium text-sm">{investor.name}</p>
                      <p className="text-white/50 text-xs mt-1">{investor.focus}</p>
                    </div>
                  ))}
                </div>
                
                <p className="text-center text-white/30 text-xs mt-4">
                  Preview of your personalized investor matches
                </p>
              </div>
            </div>
          </div>
        </div>
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
