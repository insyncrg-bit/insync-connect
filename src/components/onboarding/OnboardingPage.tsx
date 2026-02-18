import { useState, useEffect, ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import { OnboardingStep, useOnboardingStorage } from "./hooks/useOnboardingStorage";
import { StepIndicator } from "./StepIndicator";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingParticles } from "@/components/FloatingParticles";
import inSyncLogo from "@/landing/assets/in-sync-logo.png";

export interface StepValidation {
  isValid: boolean;
  errors: string[];
}

interface OnboardingPageProps<T extends Record<string, any>> {
  title: string;
  description: string;
  steps: OnboardingStep[];
  storageKey: string;
  stepKey: string;
  defaultData: T;
  renderStep: (
    step: number,
    data: T,
    onUpdate: (data: Partial<T>) => void,
    onNext: () => void,
    onBack: () => void,
    onSubmit: () => void,
    submitLabel?: string
  ) => ReactNode;
  validateStep: (step: number, data: T) => StepValidation;
  onSubmit: (data: T) => Promise<void>;
  onComplete?: () => void;
  requiredSteps?: number[];
  submitLabel?: string;
  loadingText?: string;
  successTitle?: string;
  successDescription?: string;
}

export const OnboardingPage = <T extends Record<string, any>>({
  title,
  description,
  steps,
  storageKey,
  stepKey,
  defaultData,
  renderStep,
  validateStep,
  onSubmit,
  onComplete,
  requiredSteps,
  submitLabel = "Submit Application",
  loadingText = "Submitting application...",
  successTitle = "Application Submitted!",
  successDescription = "Your onboarding has been completed successfully.",
}: OnboardingPageProps<T>) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, currentStep, isLoaded, saveData, saveStep, clearData } = useOnboardingStorage<T>(storageKey, stepKey, defaultData);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invalidSteps, setInvalidSteps] = useState<number[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<Array<{ step: number; errors: string[] }>>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`${stepKey}_completed`);
    if (saved) {
      try {
        setCompletedSteps(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading completed steps:", error);
      }
    }
  }, [stepKey]);

  const markStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      const updated = [...completedSteps, step];
      setCompletedSteps(updated);
      localStorage.setItem(`${stepKey}_completed`, JSON.stringify(updated));
    }
  };

  const handleNext = () => {
    markStepComplete(currentStep);
    if (currentStep < steps.length - 1) saveStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) saveStep(currentStep - 1);
  };

  const validateAllSteps = (): { isValid: boolean; warnings: Array<{ step: number; errors: string[] }> } => {
    const stepsToValidate = requiredSteps || steps.map((_, i) => i);
    const warnings: Array<{ step: number; errors: string[] }> = [];
    stepsToValidate.forEach((stepIndex) => {
      const validation = validateStep(stepIndex, data);
      if (!validation.isValid) warnings.push({ step: stepIndex, errors: validation.errors });
    });
    return { isValid: warnings.length === 0, warnings };
  };

  const handleSubmit = async () => {
    const validation = validateAllSteps();
    if (!validation.isValid) {
      setInvalidSteps(validation.warnings.map((w) => w.step));
      setValidationWarnings(validation.warnings);
      saveStep(validation.warnings[0].step);
      toast({ title: "Please Complete Required Sections", description: `${validation.warnings.length} section(s) need to be completed before submission.`, variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      clearData();
      localStorage.removeItem(`${stepKey}_completed`);
      toast({ title: successTitle, description: successDescription });
      onComplete ? onComplete() : navigate("/landing");
    } catch (error) {
      console.error("Error submitting:", error);
      toast({ title: "Error", description: `Failed to ${submitLabel.toLowerCase()}. Please try again.`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (invalidSteps.length > 0) {
      const validation = validateStep(currentStep, data);
      if (validation.isValid && invalidSteps.includes(currentStep)) {
        setInvalidSteps((prev) => prev.filter((step) => step !== currentStep));
        setValidationWarnings((prev) => prev.filter((w) => w.step !== currentStep));
      }
    }
  }, [data, currentStep, invalidSteps, validateStep]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-navy-deep flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-deep relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-glow/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-glow/5 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      <FloatingParticles />
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6 flex justify-center">
          <Link to="/landing" className="block">
            <div className="relative">
              <div className="absolute inset-0 blur-[60px] animate-pulse" style={{ background: "radial-gradient(ellipse at center, rgba(6,182,212,0.4) 0%, rgba(6,182,212,0.2) 40%, transparent 70%)" }} />
              <img src={inSyncLogo} alt="InSync" className="relative h-40 w-auto max-w-[500px] mx-auto" style={{ filter: "drop-shadow(0 0 30px rgba(6,182,212,0.5)) drop-shadow(0 0 60px rgba(6,182,212,0.3))" }} />
            </div>
          </Link>
        </div>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-white/60">{description}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
          <StepIndicator steps={steps} currentStep={currentStep} completedSteps={completedSteps} invalidSteps={invalidSteps} onStepClick={saveStep} />
        </div>
        {validationWarnings.length > 0 && (
          <div className="mb-6 space-y-2">
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Incomplete Sections</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1">
                  {validationWarnings.map((warning, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-bold">{steps[warning.step].title}:</span> {warning.errors.join(", ")}
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
        <div className={cn("bg-white/95 backdrop-blur-sm border-2 rounded-2xl p-8 md:p-10 shadow-2xl transition-all", invalidSteps.includes(currentStep) ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "border-[hsl(var(--cyan-glow))]/20")}>
          {renderStep(currentStep, data, saveData, handleNext, handleBack, handleSubmit, submitLabel)}
        </div>
        <div className="mt-4 text-center text-white/40 text-sm">Your progress is saved automatically</div>
      </div>

      {/* Submission Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-glow/20" />
              <div className="absolute inset-0 rounded-full border-4 border-t-cyan-glow animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{loadingText}</h3>
            <p className="text-white/60">This will only take a moment</p>
          </div>
        </div>
      )}
    </div>
  );
};
