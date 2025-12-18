import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan-glow/8 blur-[150px]"></div>
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[300px] bg-cyan-glow/5 blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[250px] bg-cyan-glow/5 blur-[100px]"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Title */}
          <h1 
            className="text-6xl md:text-8xl lg:text-9xl font-light text-cyan-glow tracking-tight"
            style={{ 
              filter: 'drop-shadow(0 0 60px rgba(6,182,212,0.5)) drop-shadow(0 0 120px rgba(6,182,212,0.3))',
            }}
          >
            In<span className="font-bold">∞</span>Sync
          </h1>

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
              className="text-base px-10 py-6 font-semibold bg-cyan-glow text-navy-deep hover:bg-cyan-bright shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300"
            >
              Join as a Startup
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/investor-application")}
              className="text-base px-10 py-6 font-semibold border-2 border-cyan-glow/50 text-white bg-navy-deep/60 backdrop-blur-sm hover:bg-cyan-glow/20 hover:border-cyan-glow hover:text-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]"
            >
              Join as a VC
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
