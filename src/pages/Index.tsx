import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";

import { ClosingCTA } from "@/components/ClosingCTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(220 25% 8%) 0%, hsl(215 30% 12%) 40%, hsl(210 35% 16%) 70%, hsl(220 25% 8%) 100%)' }}>


      <div className="relative z-10">
        <Navigation />
        <main className="pt-16">
          <Hero />
          <HowItWorks />
          
          <ClosingCTA />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
