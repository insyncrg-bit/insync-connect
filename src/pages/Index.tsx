import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(220 20% 6%) 0%, hsl(220 20% 10%) 40%, hsl(38 30% 12%) 70%, hsl(220 20% 8%) 100%)' }}>
      {/* Subtle animated background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-[10%] w-80 h-80 bg-gold-glow/8 rounded-full blur-3xl animate-[float_12s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 right-[10%] w-72 h-72 bg-gold-glow/5 rounded-full blur-3xl animate-[float_15s_ease-in-out_infinite]" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10">
        <Navigation />
        <main className="pt-16">
          <Hero />
          <HowItWorks />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
