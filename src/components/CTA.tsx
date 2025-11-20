import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-accent relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Ready to Transform Your Network?
          </h2>
          <p className="text-xl text-white/90">
            Join the founders and investors who are building the future of the Boston startup ecosystem—
            with precision, accountability, and measurable outcomes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto shadow-xl"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary text-lg px-8 py-6 h-auto"
            >
              Schedule a Demo
            </Button>
          </div>

          <p className="text-sm text-white/70 pt-4">
            Free for founders • Partnership model for investors • Boston-focused
          </p>
        </div>
      </div>
    </section>
  );
};
