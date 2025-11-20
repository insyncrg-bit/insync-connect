import { Rocket, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Audience = () => {
  return (
    <section id="audience" className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Who We Serve
          </h2>
          <p className="text-lg text-muted-foreground">
            Built for serious founders and emerging VC firms in the Boston ecosystem
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Startups Card */}
          <div className="group bg-gradient-to-br from-card to-card/50 border-2 border-border rounded-2xl p-8 hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/50 transition-all duration-300">
            <div className="mb-6">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Rocket className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-2">For Startups</h3>
              <p className="text-accent font-medium">Pre-Seed to Series A</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Access curated investors</span> who match your stage, sector, and funding needs
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Upload pitch materials</span> to a secure dealroom with instant sharing
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Track engagement</span> and see which investors opened your deck
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Connect with mentors</span> and pilot opportunities aligned with your goals
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                <span className="font-semibold text-accent">Always free</span> for founders. No hidden fees.
              </p>
              <Button variant="hero" className="w-full">
                Apply as a Founder
              </Button>
            </div>
          </div>

          {/* Investors Card */}
          <div className="group bg-gradient-to-br from-card to-card/50 border-2 border-border rounded-2xl p-8 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50 transition-all duration-300">
            <div className="mb-6">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">For Investors</h3>
              <p className="text-primary font-medium">Emerging & Mid-Sized VC Firms</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Receive pre-vetted dealflow</span> that matches your thesis, stage, and check size
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Access pitch materials</span> instantly with contextual summaries
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Track conversion metrics</span> from introduction to meeting to deal close
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Build brand visibility</span> in the Boston startup ecosystem
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Partnership-based model. <span className="font-semibold text-primary">Contact us</span> for details.
              </p>
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Become a Partner
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
