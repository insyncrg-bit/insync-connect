import { AlertCircle } from "lucide-react";

export const Problem = () => {
  return (
    <section id="problem" className="py-20 relative" style={{ background: 'linear-gradient(180deg, hsl(220 60% 15%) 0%, hsl(210 65% 20%) 100%)' }}>
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              The <span className="text-[hsl(var(--cyan-glow))]">Noise Problem</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Today's startup ecosystem is fragmented and built on randomness—founders hope to meet the right investor while investors sift through irrelevant dealflow.
            </p>
          </div>

          <div className="bg-[hsl(var(--navy-deep))]/80 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/30 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-[hsl(var(--cyan-glow))]/10 rounded-lg flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-white">Broken Networking Reality</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(var(--cyan-glow))] mt-1">•</span>
                    <span>Low signal, high noise—meet dozens but only 1-2 are relevant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(var(--cyan-glow))] mt-1">•</span>
                    <span>No follow-up structure or accountability after initial connection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(var(--cyan-glow))] mt-1">•</span>
                    <span>Fragmented ecosystem across multiple platforms with no central hub</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(var(--cyan-glow))] mt-1">•</span>
                    <span>Success requires volume and visibility, not strategic alignment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
