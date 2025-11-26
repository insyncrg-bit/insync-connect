import { Mail, Linkedin, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[hsl(var(--navy-deep))] border-t border-[hsl(var(--cyan-glow))]/20 py-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg" />
              <span className="text-xl font-bold text-white">In-Sync</span>
            </div>
            <p className="text-sm text-white/70">
              High-fidelity startup-investor matching for the Boston ecosystem
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Platform</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-[hsl(var(--cyan-glow))] transition-colors">For Founders</a></li>
              <li><a href="#" className="hover:text-[hsl(var(--cyan-glow))] transition-colors">For Investors</a></li>
              <li><a href="#" className="hover:text-[hsl(var(--cyan-glow))] transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-[hsl(var(--cyan-glow))] transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-[hsl(var(--cyan-glow))] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[hsl(var(--cyan-glow))] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[hsl(var(--cyan-glow))] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[hsl(var(--cyan-glow))] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Connect</h3>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 hover:bg-[hsl(var(--cyan-glow))]/20 text-white hover:text-[hsl(var(--cyan-glow))] rounded-lg flex items-center justify-center transition-all border border-[hsl(var(--cyan-glow))]/20"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 hover:bg-[hsl(var(--cyan-glow))]/20 text-white hover:text-[hsl(var(--cyan-glow))] rounded-lg flex items-center justify-center transition-all border border-[hsl(var(--cyan-glow))]/20"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 hover:bg-[hsl(var(--cyan-glow))]/20 text-white hover:text-[hsl(var(--cyan-glow))] rounded-lg flex items-center justify-center transition-all border border-[hsl(var(--cyan-glow))]/20"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[hsl(var(--cyan-glow))]/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/70">
            © 2024 In-Sync. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/70">
            <a href="#" className="hover:text-[hsl(var(--cyan-glow))] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[hsl(var(--cyan-glow))] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[hsl(var(--cyan-glow))] transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
