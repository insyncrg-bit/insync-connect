import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function Platform() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(220 60% 15%) 0%, hsl(200 65% 25%) 25%, hsl(180 65% 35%) 50%, hsl(200 65% 25%) 75%, hsl(220 60% 15%) 100%)' }}>
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-[10%] w-96 h-96 bg-[hsl(var(--cyan-glow))]/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]"></div>
        <div className="absolute top-1/3 right-[15%] w-80 h-80 bg-[hsl(var(--cyan-glow))]/5 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-[20%] w-72 h-72 bg-white/5 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite]" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        <Navigation />
      
      {/* Choose Your Path Section */}
      <section className="relative overflow-hidden pt-24 pb-20">
        <div className="container px-4 md:px-6">
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-[10%] w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))]/30 animate-[float_6s_ease-in-out_infinite]"></div>
            <div className="absolute top-40 right-[15%] w-1.5 h-1.5 rounded-full bg-white/30 animate-[float_8s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-40 left-[20%] w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))]/20 animate-[float_7s_ease-in-out_infinite]" style={{ animationDelay: '4s' }}></div>
          </div>

          <div className="max-w-3xl mx-auto text-center mb-16 relative">
            <div className="inline-block animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white relative">
                <span className="relative inline-block">
                  Choose Your 
                  <span className="absolute -inset-1 bg-[hsl(var(--cyan-glow))]/10 blur-xl rounded-lg -z-10"></span>
                </span>
                {" "}
                <span className="text-[hsl(var(--cyan-glow))] inline-block hover:scale-110 transition-transform duration-300 relative">
                  Path
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                    <path d="M0,4 Q25,0 50,4 T100,4" stroke="currentColor" strokeWidth="2" fill="none" className="animate-[draw_2s_ease-in-out_infinite]" />
                  </svg>
                </span>
              </h2>
            </div>
            <p className="text-lg md:text-xl text-white/80 animate-fade-in max-w-2xl mx-auto" style={{ animationDelay: '0.5s' }}>
              Built for serious founders and emerging VC firms in the Boston ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Startups Card */}
            <div className="group bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border-2 border-[hsl(var(--cyan-glow))]/40 rounded-2xl p-10 hover:bg-[hsl(var(--navy-deep))]/85 hover:border-[hsl(var(--cyan-glow))]/60 hover:shadow-[0_0_60px_rgba(0,255,255,0.4)] hover:scale-[1.03] transition-all duration-500 cursor-pointer animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.7s' }} onClick={() => navigate("/")}>
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--cyan-glow))]/0 via-[hsl(var(--cyan-glow))]/5 to-[hsl(var(--cyan-glow))]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[hsl(var(--cyan-glow))] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
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

              <div className="relative overflow-hidden mt-8">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/founder-application");
                  }}
                  className="w-full group/btn relative bg-[hsl(var(--cyan-glow))]/10 hover:bg-[hsl(var(--cyan-glow))]/20 border border-[hsl(var(--cyan-glow))]/50 hover:border-[hsl(var(--cyan-glow))] rounded-xl px-6 py-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(var(--cyan-glow))]/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-between">
                    <span className="text-white font-semibold text-lg tracking-wide">Apply as a Founder</span>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5 text-[hsl(var(--cyan-glow))] group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Investors Card */}
            <div className="group bg-[hsl(var(--navy-deep))]/70 backdrop-blur-sm border-2 border-white/40 rounded-2xl p-10 hover:bg-[hsl(var(--navy-deep))]/85 hover:border-white/60 hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:scale-[1.03] transition-all duration-500 cursor-pointer animate-fade-in relative overflow-hidden" style={{ animationDelay: '0.9s' }}>
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
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

              <div className="relative overflow-hidden mt-8">
                <button className="w-full group/btn relative bg-white/10 hover:bg-white/20 border border-white/50 hover:border-white rounded-xl px-6 py-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-between">
                    <span className="text-white font-semibold text-lg tracking-wide">Become a Partner</span>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5 text-white group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
}
