import { Button } from "@/components/ui/button";
import logoImage from "@/assets/insync-logo.png";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="In-Sync" className="h-8" />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#problem" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Problem
            </a>
            <a href="#solution" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Solution
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#audience" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Who We Serve
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
