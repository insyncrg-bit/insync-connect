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
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-16 pb-12" style={{ background: 'var(--gradient-navy-teal)' }}>
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] border border-[hsl(var(--cyan-glow))]/30 rounded-full -translate-y-1/2" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] border border-[hsl(var(--cyan-glow))]/20 rounded-full translate-y-1/2" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
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
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section id="audience" className="py-16 relative" style={{ background: 'linear-gradient(180deg, hsl(180 75% 40%) 0%, hsl(220 60% 15%) 100%)' }}>
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white animate-scale-in">
              Choose Your <span className="text-[hsl(var(--cyan-glow))] inline-block hover:scale-110 transition-transform duration-300">Path</span>
            </h2>
            <p className="text-lg text-white/80 animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
              Built for serious founders and emerging VC firms in the Boston ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Startups Card */}
            <div className="group bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border-2 border-[hsl(var(--cyan-glow))]/40 rounded-2xl p-10 hover:bg-[hsl(var(--navy-deep))]/85 hover:border-[hsl(var(--cyan-glow))]/60 hover:shadow-[0_0_40px_rgba(0,255,255,0.3)] hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in" style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }} onClick={() => navigate("/founder-application")}>
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 bg-[hsl(var(--cyan-glow))]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[hsl(var(--cyan-glow))]/20 transition-colors">
                  <Rocket className="h-8 w-8 text-[hsl(var(--cyan-glow))]" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2 text-white">For Founders</h3>
                  <p className="text-[hsl(var(--cyan-glow))] font-medium text-lg">Pre-Seed to Series A</p>
                  <p className="text-sm text-[hsl(var(--cyan-glow))]/80 mt-2 font-semibold">Always free • No hidden fees</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--cyan-glow))] mt-2 shrink-0" />
                  <p className="text-white/90 text-sm">
                    <span className="text-white font-semibold block mb-1">Curated Investors</span>
                    Match your stage, sector, and funding needs
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--cyan-glow))] mt-2 shrink-0" />
                  <p className="text-white/90 text-sm">
                    <span className="text-white font-semibold block mb-1">Secure Dealroom</span>
                    Upload pitch materials with instant sharing
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--cyan-glow))] mt-2 shrink-0" />
                  <p className="text-white/90 text-sm">
                    <span className="text-white font-semibold block mb-1">Track Engagement</span>
                    See which investors opened your deck
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--cyan-glow))] mt-2 shrink-0" />
                  <p className="text-white/90 text-sm">
                    <span className="text-white font-semibold block mb-1">Mentor Network</span>
                    Connect with pilots aligned to your goals
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden pt-6 border-t border-[hsl(var(--cyan-glow))]/30">
                <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--cyan-glow))]/0 via-[hsl(var(--cyan-glow))]/10 to-[hsl(var(--cyan-glow))]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex items-center justify-between">
                  <span className="text-white font-semibold text-lg group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Apply as a Founder</span>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-6 w-6 text-[hsl(var(--cyan-glow))] group-hover:translate-x-2 transition-transform duration-300" />
                    <div className="w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))] animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Investors Card */}
            <div className="group bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border-2 border-white/40 rounded-2xl p-10 hover:bg-[hsl(var(--navy-deep))]/85 hover:border-white/60 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in" style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 bg-white/15 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2 text-white">For Investors</h3>
                  <p className="text-white/90 font-medium text-lg">Emerging & Mid-Sized VC Firms</p>
                  <p className="text-sm text-white/70 mt-2 font-semibold">Partnership-based model</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0" />
                  <p className="text-white/90 text-sm">
                    <span className="text-white font-semibold block mb-1">Pre-Vetted Dealflow</span>
                    Matches your thesis, stage, and check size
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0" />
                  <p className="text-white/90 text-sm">
                    <span className="text-white font-semibold block mb-1">Instant Access</span>
                    Pitch materials with contextual summaries
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0" />
                  <p className="text-white/90 text-sm">
                    <span className="text-white font-semibold block mb-1">Track Metrics</span>
                    From introduction to meeting to deal close
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0" />
                  <p className="text-white/90 text-sm">
                    <span className="text-white font-semibold block mb-1">Brand Visibility</span>
                    Build presence in Boston startup ecosystem
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden pt-6 border-t border-white/30">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex items-center justify-between">
                  <span className="text-white font-semibold text-lg group-hover:scale-105 transition-transform">Become a Partner</span>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-6 w-6 text-white group-hover:translate-x-2 transition-transform duration-300" />
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
