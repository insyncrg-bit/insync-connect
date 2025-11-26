import { Rocket, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Audience = () => {
  return (
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
          <div className="group bg-white/5 backdrop-blur-sm border-2 border-[hsl(var(--cyan-glow))]/30 rounded-2xl p-8 hover:bg-white/10 hover:border-[hsl(var(--cyan-glow))]/50 hover:shadow-[0_0_40px_rgba(0,255,255,0.3)] transition-all duration-300">
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
              <Button className="w-full bg-white text-[hsl(var(--navy-deep))] hover:bg-white/90 border-2 border-[hsl(var(--cyan-glow))]/30">
                Apply as a Founder
              </Button>
            </div>
          </div>

          {/* Investors Card */}
          <div className="group bg-white/5 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-8 hover:bg-white/10 hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300">
            <div className="mb-6">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
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
  );
};
