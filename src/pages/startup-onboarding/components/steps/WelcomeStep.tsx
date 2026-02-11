import { WelcomeStep as SharedWelcomeStep } from "@/components/onboarding";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <SharedWelcomeStep
      title="Welcome to InSync"
      description="Let's set up your startup profile. This will help us match you with the right investors. You can save your progress and come back anytime."
      onNext={onNext}
      features={[
        "Complete your company information and pitch",
        "Your progress is saved automatically",
        "Get matched with investors that fit your stage and sector",
      ]}
    />
  );
};
