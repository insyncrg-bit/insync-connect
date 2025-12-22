import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(220 25% 6%) 0%, hsl(220 28% 10%) 50%, hsl(220 25% 6%) 100%)',
        }}
      />

      {/* Content */}
      <div className="container relative z-10 px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* Minimal badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
            <span className="text-sm text-white/60">AI-powered matching</span>
          </div>

          {/* Clean headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.1] mb-6">
            Find your perfect
            <br />
            <span className="text-cyan-glow">investor-founder match</span>
          </h1>

          {/* Simple, clear subheadline */}
          <p className="text-lg md:text-xl text-white/50 max-w-xl mx-auto mb-12 leading-relaxed">
            We match startups with VCs based on thesis, stage, and sector. 
            No cold outreach. Just introductions that make sense.
          </p>

          {/* Clean CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              onClick={() => navigate("/founder-application")}
              className="text-base px-8 py-6 font-medium bg-cyan-glow text-navy-deep hover:bg-cyan-bright transition-all duration-200 rounded-xl"
            >
              Get matched as a founder
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              size="lg"
              variant="ghost"
              onClick={() => navigate("/investor-application")}
              className="text-base px-8 py-6 font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 rounded-xl"
            >
              I'm an investor
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Value props - minimal cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] text-left">
              <p className="text-xs uppercase tracking-wider text-cyan-glow/80 mb-2">For Founders</p>
              <p className="text-white/80 font-medium mb-1">Stop chasing, start matching</p>
              <p className="text-sm text-white/40">Get introduced to VCs actively seeking your stage and sector. Free to use.</p>
            </div>

            <div className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] text-left">
              <p className="text-xs uppercase tracking-wider text-cyan-glow/80 mb-2">For Investors</p>
              <p className="text-white/80 font-medium mb-1">See only what fits your thesis</p>
              <p className="text-sm text-white/40">Curated deal flow that matches your investment criteria exactly.</p>
            </div>
          </div>

          {/* Minimal trust line */}
          <p className="text-sm text-white/30 mt-12">
            5-minute setup · Quality over quantity
          </p>
        </div>
      </div>
    </section>
  );
};
