import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AnimatedInfinity } from "./AnimatedInfinity";
import { FloatingParticles } from "./FloatingParticles";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Floating particles background */}
      <FloatingParticles />
      
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-glow/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-glow/8 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-cyan-glow/5 blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--cyan-glow)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--cyan-glow)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-glow/30 bg-navy-card/50 backdrop-blur-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-cyan-glow" />
            <span className="text-sm text-white/80">AI-Powered Investor Matching</span>
          </div>

          {/* Animated Infinity Logo */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <AnimatedInfinity />
          </div>

          {/* Tagline */}
          <p 
            className="text-xl md:text-2xl lg:text-3xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            Find investors who <span className="text-cyan-glow font-medium">actually fit</span> your startup.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-in" 
            style={{ animationDelay: '0.3s' }}
          >
            <Button
              size="lg"
              onClick={() => navigate("/founder-application")}
              className="group relative text-base px-8 py-6 font-semibold bg-cyan-glow text-navy-deep hover:bg-cyan-bright overflow-hidden transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: '0 0 30px hsl(var(--cyan-glow) / 0.4), 0 0 60px hsl(var(--cyan-glow) / 0.2)',
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Join as a Startup
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-bright to-cyan-glow opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/investor-application")}
              className="group text-base px-8 py-6 font-semibold border-2 border-cyan-glow/40 text-white bg-transparent backdrop-blur-sm hover:bg-cyan-glow/10 hover:border-cyan-glow transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: '0 0 20px hsl(var(--cyan-glow) / 0.1)',
              }}
            >
              <span className="flex items-center gap-2">
                Join as a VC
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </div>

          {/* Trust indicators */}
          <div 
            className="flex flex-wrap items-center justify-center gap-8 pt-8 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            {['Smart Matching', 'Thesis Alignment', 'Real-Time Insights'].map((item, i) => (
              <div key={item} className="flex items-center gap-2 text-white/50 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-deep to-transparent pointer-events-none" />
    </section>
  );
};
