import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// TODO: Integrate with backend API for authentication
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import infinityLogo from "@/assets/infinity-logo.png";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any | null>(null);
  
  useEffect(() => {
    // TODO: Integrate with backend API for authentication state
    // For now, no user is set (placeholder)
    setUser(null);
  }, []);

  const handleHowItWorksClick = () => {
    if (location.pathname === "/") {
      const element = document.getElementById('how-it-works');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate("/#how-it-works");
    }
  };

  const handleLogout = async () => {
    // TODO: Integrate with backend API for logout
    setUser(null);
    navigate("/");
  };

  const handleDashboardClick = async () => {
    if (!user) return;
    
    // TODO: Integrate with backend API to check if user has an application
    // For now, navigate to dashboard
    navigate("/founder-dashboard");
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
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleHowItWorksClick}
              className="text-cyan-glow font-medium hover:text-cyan-glow/80 transition-colors"
            >
              How It Works
            </button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDashboardClick}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigate("/auth")}
                  size="sm"
                  className="bg-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/90 text-[hsl(var(--navy-deep))] font-medium"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In
                </Button>
                <Button
                  onClick={() => navigate("/analyst-auth")}
                  size="sm"
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  Sign in as a VC Analyst
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
