import { Button } from "@/components/ui/button";

export const ClosingCTA = () => {
  // TODO: Integrate real signup flows here
  const handleStartupSignup = () => {
    // Will be connected to real signup flow
  };

  const handleVCSignup = () => {
    // Will be connected to real signup flow
  };

  return (
    <section className="py-20 px-4 md:px-6">
      <div className="container max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
          Ready to get matched?
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          Join founders who skip the cold outreach and get direct intros to investors who fit.
        </p>

        {/* Placeholder for real signup integration */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={handleStartupSignup}
            className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright font-semibold px-8 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all duration-300"
          >
            Apply as a Startup
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleVCSignup}
            className="border-2 border-cyan-glow/40 text-white bg-transparent hover:bg-cyan-glow/10 hover:border-cyan-glow font-semibold px-8 transition-all duration-300"
          >
            Join as a VC
          </Button>
        </div>
      </div>
    </section>
  );
};
