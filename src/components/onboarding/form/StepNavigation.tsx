import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepNavigationProps {
  onBack: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
  showBack?: boolean;
}

export const StepNavigation = ({
  onBack,
  onNext,
  onSubmit,
  isFirstStep = false,
  isLastStep = false,
  nextDisabled = false,
  nextLabel,
  showBack = true,
}: StepNavigationProps) => (
  <div className="flex justify-between pt-4">
    {!isFirstStep && showBack ? (
      <Button variant="outline" onClick={onBack} className="border-[hsl(var(--navy-deep))]/20 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
    ) : (
      <div />
    )}
    {isLastStep ? (
      <Button
        onClick={onSubmit}
        disabled={nextDisabled}
        className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
      >
        {nextLabel || "Submit Application"}
      </Button>
    ) : (
      <Button
        onClick={onNext}
        disabled={nextDisabled}
        className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
      >
        {nextLabel || "Next"}
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    )}
  </div>
);
