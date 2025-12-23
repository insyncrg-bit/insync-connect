import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import infinityLogo from "@/assets/infinity-logo.png";

export const Navigation = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="fixed top-0 w-full z-50 bg-navy-deep/90 backdrop-blur-lg border-b border-cyan-glow/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img 
              src={infinityLogo} 
              alt="In∞Sync" 
              className="h-10 w-auto"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
