import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyInSync } from "@/components/WhyInSync";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(220 25% 8%) 0%, hsl(215 30% 12%) 40%, hsl(210 35% 16%) 70%, hsl(220 25% 8%) 100%)' }}>
      {/* Subtle animated background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-[10%] w-80 h-80 bg-cyan-glow/8 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 right-[10%] w-72 h-72 bg-cyan-glow/5 rounded-full blur-3xl animate-[float_15s_ease-in-out_infinite]" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10">
        <Navigation />
        <main className="pt-16">
          <Hero />
          <HowItWorks />
          <WhyInSync />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
