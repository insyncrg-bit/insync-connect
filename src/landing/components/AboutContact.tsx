import { Mail, Linkedin, Twitter, Users, Target, Zap } from "lucide-react";

export const AboutContact = () => {
  return (
    <section id="about" className="relative py-24 px-4 md:px-6">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[400px] bg-cyan-glow/5 blur-[150px] rounded-full" />
      </div>

      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-white/60 text-sm font-medium uppercase tracking-widest mb-4">
            About Us
          </h2>
          <p className="text-2xl md:text-3xl text-white font-light max-w-2xl mx-auto">
            We're on a mission to make fundraising more efficient for everyone
          </p>
        </div>

        {/* About Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Our Story */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Our Story</h3>
            <p className="text-white/60 leading-relaxed">
              InSync was born from firsthand experience with the frustrations of fundraising.
              We've seen talented founders waste countless hours chasing investors who were never
              the right fit, and investors sift through thousands of pitches to find the few that
              match their thesis.
            </p>
            <p className="text-white/60 leading-relaxed">
              We built InSync to solve this problem: a platform that uses intelligent matching
              to connect founders with investors who are genuinely aligned on stage, sector,
              and vision. No more cold outreach into the void. No more endless pitch decks
              that go nowhere.
            </p>
          </div>

          {/* Values */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">What We Believe</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-glow/10 flex items-center justify-center flex-shrink-0">
                  <Target className="h-5 w-5 text-cyan-glow" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Quality Over Quantity</h4>
                  <p className="text-sm text-white/50">
                    One great match is worth more than a hundred bad fits.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-glow/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-cyan-glow" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Mutual Benefit</h4>
                  <p className="text-sm text-white/50">
                    The best deals happen when both sides find exactly what they're looking for.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-glow/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-cyan-glow" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Time is Precious</h4>
                  <p className="text-sm text-white/50">
                    Founders should be building, not endlessly pitching. We respect your time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-navy-card border border-white/10 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Get in Touch</h3>
              <p className="text-white/60 mb-6">
                Have questions about InSync? Want to learn more about how we can help your
                fundraising journey? We'd love to hear from you.
              </p>
              <a
                href="mailto:insync.rg@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-glow text-navy-deep font-medium rounded-lg hover:bg-cyan-bright transition-all"
                style={{
                  boxShadow: '0 0 20px hsl(var(--cyan-glow) / 0.3)',
                }}
              >
                <Mail className="h-4 w-4" />
                Contact Us
              </a>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <p className="text-white/50 text-sm mb-4">Follow us for updates</p>
              <div className="flex gap-3">
                <a
                  href="mailto:insync.rg@gmail.com"
                  className="w-12 h-12 bg-white/5 hover:bg-cyan-glow/20 text-white/70 hover:text-cyan-glow rounded-xl flex items-center justify-center transition-all border border-cyan-glow/20 hover:border-cyan-glow/40 hover:scale-110 duration-300"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/in-sync-rg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/5 hover:bg-cyan-glow/20 text-white/70 hover:text-cyan-glow rounded-xl flex items-center justify-center transition-all border border-cyan-glow/20 hover:border-cyan-glow/40 hover:scale-110 duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://x.com/insyncrg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/5 hover:bg-cyan-glow/20 text-white/70 hover:text-cyan-glow rounded-xl flex items-center justify-center transition-all border border-cyan-glow/20 hover:border-cyan-glow/40 hover:scale-110 duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
