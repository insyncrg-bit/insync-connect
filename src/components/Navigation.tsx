import { Button } from "@/components/ui/button";
import { Infinity } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[hsl(var(--navy-deep))]/90 backdrop-blur-lg border-b border-[hsl(var(--cyan-glow))]/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Infinity className="w-8 h-8 text-[hsl(var(--cyan-glow))]" strokeWidth={2.5} />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="/#problem" className="text-sm font-medium text-white/70 hover:text-[hsl(var(--cyan-glow))] transition-colors">
              Problem
            </a>
            <a href="/#solution" className="text-sm font-medium text-white/70 hover:text-[hsl(var(--cyan-glow))] transition-colors">
              Solution
            </a>
            <a href="/#how-it-works" className="text-sm font-medium text-white/70 hover:text-[hsl(var(--cyan-glow))] transition-colors">
              How It Works
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-white hover:text-[hsl(var(--cyan-glow))] hover:bg-white/5">
              Sign In
            </Button>
            <Button size="sm" className="bg-white text-[hsl(var(--navy-deep))] hover:bg-white/90 border-2 border-[hsl(var(--cyan-glow))]/30">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
