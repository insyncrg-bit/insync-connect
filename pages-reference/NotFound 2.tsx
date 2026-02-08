import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, hsl(220 25% 8%) 0%, hsl(215 30% 12%) 40%, hsl(210 35% 16%) 70%, hsl(220 25% 8%) 100%)' }}>
      <Navigation />
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <a href="/" className="text-cyan-glow underline hover:text-cyan-glow/90">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
