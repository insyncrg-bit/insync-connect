import { OnboardingStep } from "./hooks/useOnboardingStorage";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: OnboardingStep[];
  currentStep: number;
  completedSteps: number[];
  invalidSteps?: number[];
  onStepClick?: (stepIndex: number) => void;
}

export const StepIndicator = ({ steps, currentStep, completedSteps, invalidSteps = [], onStepClick }: StepIndicatorProps) => (
  <div className="flex items-center justify-between mb-8">
    {steps.map((step, index) => {
      const Icon = step.icon;
      const isCompleted = completedSteps.includes(index);
      const isCurrent = currentStep === index;
      const isPast = index < currentStep;
      const isInvalid = invalidSteps.includes(index);
      const isClickable = onStepClick !== undefined;
      return (
        <div key={step.id} className="flex items-center flex-1">
          <div className={cn("flex flex-col items-center flex-1", isClickable && "cursor-pointer")} onClick={() => isClickable && onStepClick?.(index)}>
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all relative",
                isCurrent ? "bg-cyan-glow text-navy-deep" : isInvalid ? "bg-red-500/20 text-red-400 border-2 border-red-500" : isCompleted || isPast ? "bg-cyan-glow/20 text-cyan-glow border-2 border-cyan-glow" : "bg-white/10 text-white/40 border-2 border-white/20",
                isClickable && "hover:scale-110"
              )}
            >
              <Icon className="h-5 w-5" />
              {isInvalid && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-navy-card" />}
            </div>
            <span className={cn("text-xs mt-2 text-center", isCurrent ? "text-cyan-glow font-medium" : isInvalid ? "text-red-400 font-medium" : isCompleted || isPast ? "text-white/60" : "text-white/40")}>
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && <div className={cn("h-0.5 flex-1 mx-2 -mt-6", isPast || isCompleted ? "bg-cyan-glow/30" : "bg-white/10")} />}
        </div>
      );
    })}
  </div>
);
