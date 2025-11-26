import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function Platform() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-16" style={{ background: 'var(--gradient-navy-teal)' }}>
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] border border-[hsl(var(--cyan-glow))]/30 rounded-full -translate-y-1/2" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] border border-[hsl(var(--cyan-glow))]/20 rounded-full translate-y-1/2" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
              Stop Networking.
              <br />
              <span className="text-[hsl(var(--cyan-glow))]">
                Start Connecting.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              The centralized routing system that matches founders with the right investors at the right time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 h-auto bg-white text-[hsl(var(--navy-deep))] hover:bg-white/90 shadow-xl border-2 border-[hsl(var(--cyan-glow))]/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all"
                onClick={() => navigate("/founder-application")}
              >
                Join as a Founder
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" className="text-lg px-8 py-6 h-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-[hsl(var(--navy-deep))] transition-all">
                Partner as an Investor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section id="audience" className="py-24 relative" style={{ background: 'linear-gradient(180deg, hsl(180 75% 40%) 0%, hsl(220 60% 15%) 100%)' }}>
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Who We Serve
            </h2>
            <p className="text-lg text-white/80">
              Built for serious founders and emerging VC firms in the Boston ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Startups Card */}
            <div className="group bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border-2 border-[hsl(var(--cyan-glow))]/40 rounded-2xl p-8 hover:bg-[hsl(var(--navy-deep))]/85 hover:border-[hsl(var(--cyan-glow))]/60 hover:shadow-[0_0_40px_rgba(0,255,255,0.3)] transition-all duration-300">
              <div className="mb-6">
                <div className="w-14 h-14 bg-[hsl(var(--cyan-glow))]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[hsl(var(--cyan-glow))]/20 transition-colors">
                  <Rocket className="h-7 w-7 text-[hsl(var(--cyan-glow))]" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">For Startups</h3>
                <p className="text-[hsl(var(--cyan-glow))] font-medium">Pre-Seed to Series A</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--cyan-glow))] mt-2" />
                  <p className="text-white/70">
                    <span className="text-white font-medium">Access curated investors</span> who match your stage, sector, and funding needs
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--cyan-glow))] mt-2" />
                  <p className="text-white/70">
                    <span className="text-white font-medium">Upload pitch materials</span> to a secure dealroom with instant sharing
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--cyan-glow))] mt-2" />
                  <p className="text-white/70">
                    <span className="text-white font-medium">Track engagement</span> and see which investors opened your deck
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--cyan-glow))] mt-2" />
                  <p className="text-white/70">
                    <span className="text-white font-medium">Connect with mentors</span> and pilot opportunities aligned with your goals
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[hsl(var(--cyan-glow))]/30">
                <p className="text-sm text-white/70 mb-4">
                  <span className="font-semibold text-[hsl(var(--cyan-glow))]">Always free</span> for founders. No hidden fees.
                </p>
                <Button 
                  className="w-full bg-white text-[hsl(var(--navy-deep))] hover:bg-white/90 border-2 border-[hsl(var(--cyan-glow))]/30"
                  onClick={() => navigate("/founder-application")}
                >
                  Apply as a Founder
                </Button>
              </div>
            </div>

            {/* Investors Card */}
            <div className="group bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border-2 border-white/40 rounded-2xl p-8 hover:bg-[hsl(var(--navy-deep))]/85 hover:border-white/60 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300">
              <div className="mb-6">
                <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/25 transition-colors">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">For Investors</h3>
                <p className="text-white/90 font-medium">Emerging & Mid-Sized VC Firms</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-2" />
                  <p className="text-white/70">
                    <span className="text-white font-medium">Receive pre-vetted dealflow</span> that matches your thesis, stage, and check size
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-2" />
                  <p className="text-white/70">
                    <span className="text-white font-medium">Access pitch materials</span> instantly with contextual summaries
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-2" />
                  <p className="text-white/70">
                    <span className="text-white font-medium">Track conversion metrics</span> from introduction to meeting to deal close
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-2" />
                  <p className="text-white/70">
                    <span className="text-white font-medium">Build brand visibility</span> in the Boston startup ecosystem
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/30">
                <p className="text-sm text-white/70 mb-4">
                  Partnership-based model. <span className="font-semibold text-white">Contact us</span> for details.
                </p>
                <Button className="w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-[hsl(var(--navy-deep))]">
                  Become a Partner
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
