import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { ClosingCTA } from "./components/ClosingCTA";
import { AboutContact } from "./components/AboutContact";
import { Footer } from "./components/Footer";
import { DemoStartupFlow, DemoVCFlow } from "./demo";

type DemoMode = "none" | "startup" | "vc";

export const Landing = () => {
  const location = useLocation();
  const [demoMode, setDemoMode] = useState<DemoMode>("none");

  useEffect(() => {
    if (location.hash === '#how-it-works') {
      const element = document.getElementById('how-it-works');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const handleTryDemo = (type: "founder" | "investor") => {
    // Map to new naming
    setDemoMode(type === "founder" ? "startup" : "vc");
  };

  const handleCloseDemo = () => {
    setDemoMode("none");
  };

  return (
    <>
      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, hsl(220 25% 8%) 0%, hsl(215 30% 12%) 40%, hsl(210 35% 16%) 70%, hsl(220 25% 8%) 100%)'
        }}
      >
        <div className="relative z-10">
          <Navigation />
          <main className="pt-16">
            <Hero />
            <HowItWorks onTryDemo={handleTryDemo} />
            <ClosingCTA />
            <AboutContact />
          </main>
          <Footer />
        </div>
      </div>

      {/* Demo Flows */}
      {demoMode === "startup" && <DemoStartupFlow onClose={handleCloseDemo} />}
      {demoMode === "vc" && <DemoVCFlow onClose={handleCloseDemo} />}
    </>
  );
};
