import { Button } from "@/components/ui/button";
import { CircleDot } from "lucide-react";

interface WelcomeStepProps {
  title?: string;
  description?: string;
  onNext: () => void;
  features?: string[];
}

export const WelcomeStep = ({
  title = "Welcome to InSync",
  description = "Let's set up your profile. This will help us match you with the right opportunities. You can save your progress and come back anytime.",
  onNext,
  features = [
    "Complete your information and profile",
    "Your progress is saved automatically",
    "Get matched with opportunities that fit your criteria",
  ],
}: WelcomeStepProps) => (
  <div className="space-y-6">
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-glow/20 rounded-full blur-xl" />
          <CircleDot className="relative h-16 w-16 text-cyan-glow" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="text-white/60 max-w-md mx-auto">{description}</p>
    </div>
    <div className="space-y-4 pt-4">
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <h3 className="text-white font-medium mb-2">What to expect:</h3>
        <ul className="space-y-2 text-sm text-white/60">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-cyan-glow mt-1">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="flex justify-end pt-4">
      <Button onClick={onNext} className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright">
        Get Started
      </Button>
    </div>
  </div>
);
