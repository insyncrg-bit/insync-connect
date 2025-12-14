import { Mail, Linkedin, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-navy-deep/50 border-t border-cyan-glow/10 py-12">
      <div className="container px-4 md:px-6">
        <div className="max-w-md mx-auto text-center space-y-8">
          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4 text-white text-lg">Connect</h3>
            <div className="flex gap-3 justify-center">
              <a 
                href="#" 
                className="w-10 h-10 bg-white/5 hover:bg-cyan-glow/20 text-white/70 hover:text-cyan-glow rounded-lg flex items-center justify-center transition-all border border-cyan-glow/20 hover:border-cyan-glow/40 hover:scale-110 duration-300"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/5 hover:bg-cyan-glow/20 text-white/70 hover:text-cyan-glow rounded-lg flex items-center justify-center transition-all border border-cyan-glow/20 hover:border-cyan-glow/40 hover:scale-110 duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/5 hover:bg-cyan-glow/20 text-white/70 hover:text-cyan-glow rounded-lg flex items-center justify-center transition-all border border-cyan-glow/20 hover:border-cyan-glow/40 hover:scale-110 duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            © 2024 inSync. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/50">
            <a href="#" className="hover:text-cyan-glow transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-glow transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
