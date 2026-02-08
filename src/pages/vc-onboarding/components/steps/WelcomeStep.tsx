import { Button } from "@/components/ui/button";
import { CircleDot } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-glow/20 rounded-full blur-xl" />
            <CircleDot className="relative h-16 w-16 text-cyan-glow" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white">Welcome to InSync</h2>
        <p className="text-white/60 max-w-md mx-auto">
          Let's set up your VC firm profile. This will help us match you with the right startups.
          You can save your progress and come back anytime.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-white font-medium mb-2">What to expect:</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li className="flex items-start gap-2">
              <span className="text-cyan-glow mt-1">•</span>
              <span>Complete your firm information and investment thesis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-glow mt-1">•</span>
              <span>Your progress is saved automatically</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-glow mt-1">•</span>
              <span>Get matched with startups that fit your criteria</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={onNext}
          className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};
