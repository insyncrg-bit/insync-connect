import { useNavigate, useLocation } from "react-router-dom";
import infinityLogo from "@/assets/infinity-logo.png";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleHowItWorksClick = () => {
    if (location.pathname === "/") {
      // Already on home page, just scroll
      const element = document.getElementById('how-it-works');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home page with hash
      navigate("/#how-it-works");
    }
  };
  
  return (
    <nav className="fixed top-0 w-full z-50 bg-navy-deep/90 backdrop-blur-lg border-b border-cyan-glow/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img 
              src={infinityLogo} 
              alt="In∞Sync" 
              className="h-16 w-auto"
            />
          </div>
          
          <button
            onClick={handleHowItWorksClick}
            className="text-cyan-glow font-medium"
          >
            How It Works
          </button>
        </div>
      </div>
    </nav>
  );
};
