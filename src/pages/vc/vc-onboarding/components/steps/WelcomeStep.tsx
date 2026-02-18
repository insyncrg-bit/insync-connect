import { WelcomeStep as SharedWelcomeStep } from "@/components/onboarding";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <SharedWelcomeStep
      title="Welcome to InSync"
      description="Let's set up your VC firm profile. This will help us match you with the right startups. You can save your progress and come back anytime."
      onNext={onNext}
      features={[
        "Complete your firm information and investment thesis",
        "Your progress is saved automatically",
        "Get matched with startups that fit your criteria",
      ]}
    />
  );
};
