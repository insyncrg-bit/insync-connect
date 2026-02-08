import { STEPS } from "../constants";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
}

export const StepIndicator = ({ currentStep, completedSteps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = completedSteps.includes(index);
        const isCurrent = currentStep === index;
        const isPast = index < currentStep;

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  isCurrent
                    ? "bg-cyan-glow text-navy-deep"
                    : isCompleted || isPast
                    ? "bg-cyan-glow/20 text-cyan-glow border-2 border-cyan-glow"
                    : "bg-white/10 text-white/40 border-2 border-white/20"
                )}
              >
                {isCompleted ? (
                  <Icon className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs mt-2 text-center",
                  isCurrent
                    ? "text-cyan-glow font-medium"
                    : isCompleted || isPast
                    ? "text-white/60"
                    : "text-white/40"
                )}
              >
                {step.title}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2 -mt-6",
                  isPast || isCompleted ? "bg-cyan-glow/30" : "bg-white/10"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
