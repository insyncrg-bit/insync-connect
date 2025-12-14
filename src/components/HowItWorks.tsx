import { FileText, Sparkles, Handshake } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Apply",
    description: "Quick application form",
  },
  {
    icon: Sparkles,
    title: "Get Reviewed",
    description: "Analysts vet every startup",
  },
  {
    icon: Handshake,
    title: "Get Matched",
    description: "Hand-picked VC intros",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 px-4 md:px-6">
      <div className="container max-w-4xl mx-auto">
        <h2 className="text-center text-white/60 text-sm font-medium uppercase tracking-widest mb-12">
          How it works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(var(--cyan-glow))]/10 border border-[hsl(var(--cyan-glow))]/20 mb-4 group-hover:bg-[hsl(var(--cyan-glow))]/20 group-hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300">
                <step.icon className="w-6 h-6 text-[hsl(var(--cyan-glow))]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {step.title}
              </h3>
              <p className="text-white/60 text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
