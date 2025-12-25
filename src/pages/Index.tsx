import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { TaglineSection } from "@/components/TaglineSection";
import { HowItWorks } from "@/components/HowItWorks";

import { ClosingCTA } from "@/components/ClosingCTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  const location = useLocation();

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
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(220 25% 8%) 0%, hsl(215 30% 12%) 40%, hsl(210 35% 16%) 70%, hsl(220 25% 8%) 100%)' }}>


      <div className="relative z-10">
        <Navigation />
        <main className="pt-16">
          <Hero />
          <TaglineSection />
          <HowItWorks />
          
          <ClosingCTA />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
