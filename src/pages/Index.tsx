import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyInSync } from "@/components/WhyInSync";
import { ClosingCTA } from "@/components/ClosingCTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(220 25% 8%) 0%, hsl(215 30% 12%) 40%, hsl(210 35% 16%) 70%, hsl(220 25% 8%) 100%)' }}>
      {/* Subtle background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-[10%] w-[600px] h-[400px] bg-cyan-glow/6 blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-[10%] w-[500px] h-[350px] bg-cyan-glow/4 blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        <Navigation />
        <main className="pt-16">
          <Hero />
          <HowItWorks />
          <WhyInSync />
          <ClosingCTA />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
