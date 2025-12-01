import { AlertCircle } from "lucide-react";

export const Problem = () => {
  return (
    <section id="problem" className="py-20 relative overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[20%] w-72 h-72 border border-[hsl(var(--cyan-glow))]/20 rounded-full animate-[spin_25s_linear_infinite]" />
        <div className="absolute bottom-20 left-[15%] w-60 h-60 border border-white/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
        <div className="absolute top-1/2 left-[10%] w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))]/30 animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute top-1/3 right-[25%] w-1.5 h-1.5 rounded-full bg-white/30 animate-[float_8s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              The <span className="text-[hsl(var(--cyan-glow))] inline-block hover:scale-110 transition-transform duration-300">Noise Problem</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Today's startup ecosystem is fragmented and built on randomness—founders hope to meet the right investor while investors sift through irrelevant dealflow.
            </p>
          </div>

          <div className="bg-[hsl(var(--navy-deep))]/80 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/20 rounded-2xl p-8 hover:border-[hsl(var(--cyan-glow))]/30 hover:shadow-[0_0_30px_rgba(83,209,214,0.15)] transition-all duration-500 hover:scale-[1.02] animate-fade-in relative overflow-hidden group" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--cyan-glow))]/0 via-[hsl(var(--cyan-glow))]/5 to-[hsl(var(--cyan-glow))]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-[hsl(var(--cyan-glow))]/10 rounded-lg flex-shrink-0 group-hover:bg-[hsl(var(--cyan-glow))]/15 transition-colors">
                  <AlertCircle className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Broken Networking Reality</h3>
                  <ul className="space-y-3 text-white/70">
                    <li className="flex items-start gap-2 hover:text-white/90 transition-colors">
                      <span className="text-[hsl(var(--cyan-glow))] mt-1">•</span>
                      <span>Low signal, high noise—meet dozens but only 1-2 are relevant</span>
                    </li>
                    <li className="flex items-start gap-2 hover:text-white/90 transition-colors">
                      <span className="text-[hsl(var(--cyan-glow))] mt-1">•</span>
                      <span>No follow-up structure or accountability after initial connection</span>
                    </li>
                    <li className="flex items-start gap-2 hover:text-white/90 transition-colors">
                      <span className="text-[hsl(var(--cyan-glow))] mt-1">•</span>
                      <span>Fragmented ecosystem across multiple platforms with no central hub</span>
                    </li>
                    <li className="flex items-start gap-2 hover:text-white/90 transition-colors">
                      <span className="text-[hsl(var(--cyan-glow))] mt-1">•</span>
                      <span>Success requires volume and visibility, not strategic alignment</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
