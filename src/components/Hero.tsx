import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import inSyncLogo from "@/assets/in-sync-logo.png";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] border border-[hsl(var(--cyan-glow))]/5 rounded-full shadow-[0_0_80px_rgba(83,209,214,0.15)]" style={{ animation: 'float 40s ease-in-out infinite' }} />
        <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] border border-[hsl(var(--cyan-glow))]/5 rounded-full shadow-[0_0_80px_rgba(83,209,214,0.15)]" style={{ animation: 'float 45s ease-in-out infinite', animationDelay: '5s' }} />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Logo */}
          <div className="transition-all duration-500 relative">
            <img 
              src={inSyncLogo} 
              alt="In∞Sync" 
              className="w-full max-w-2xl mx-auto"
              style={{ 
                filter: 'drop-shadow(0 0 40px rgba(83,209,214,0.5)) drop-shadow(0 0 80px rgba(83,209,214,0.3))',
              }}
            />
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-xl mx-auto leading-relaxed">
            Find investors who actually fit your startup.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button
              variant="hero"
              size="lg"
              onClick={() => navigate("/founder-application")}
              className="text-base px-10 py-6 font-semibold shadow-[0_0_30px_rgba(83,209,214,0.3)] hover:shadow-[0_0_50px_rgba(83,209,214,0.5)] hover:scale-105 transition-all duration-300"
            >
              Join as a Startup
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/investor-application")}
              className="text-base px-10 py-6 font-semibold border-2 border-[hsl(var(--cyan-glow))]/50 text-white bg-[hsl(var(--navy-deep))]/60 backdrop-blur-sm hover:bg-[hsl(var(--cyan-glow))]/20 hover:border-[hsl(var(--cyan-glow))] hover:text-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(83,209,214,0.2)] hover:shadow-[0_0_40px_rgba(83,209,214,0.4)]"
            >
              Join as a VC
            </Button>
          </div>
        </div>
      </div>

      {/* Subtle glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[hsl(var(--cyan-glow))]/6 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
};
