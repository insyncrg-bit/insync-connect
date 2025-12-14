import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import infinityLogo from "@/assets/infinity-logo.png";

export const Navigation = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="fixed top-0 w-full z-50 bg-navy-deep/90 backdrop-blur-lg border-b border-cyan-glow/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img 
              src={infinityLogo} 
              alt="In∞Sync" 
              className="h-8 w-auto"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:text-cyan-glow hover:bg-white/5"
              onClick={() => navigate("/founder-application")}
            >
              For Startups
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:text-cyan-glow hover:bg-white/5"
              onClick={() => navigate("/investor-application")}
            >
              For VCs
            </Button>
            <Button 
              size="sm" 
              className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright font-semibold"
              onClick={() => navigate("/founder-application")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
