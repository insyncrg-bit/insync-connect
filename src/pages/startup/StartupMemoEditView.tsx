import { Building2, Briefcase, CircleDollarSign, Map, Swords } from "lucide-react";
import { OnboardingPage } from "@/components/onboarding";
import type { StartupOnboardingData } from "./startup-onboarding/hooks/startupMemoTypes";
import type { StepValidation } from "@/components/onboarding";
import { CompanyInfoStep } from "./startup-onboarding/components/steps/CompanyInfoStep";
import { BusinessModelStep } from "./startup-onboarding/components/steps/BusinessModelStep";
import { FundingRoundStep } from "./startup-onboarding/components/steps/FundingRoundStep";
import { CustomerMarketStep } from "./startup-onboarding/components/steps/CustomerMarketStep";
import { CompetitorsStep } from "./startup-onboarding/components/steps/CompetitorsStep";
import { uploadFile, deleteFile } from "@/lib/api";

const EDIT_MEMO_STEPS = [
  { id: 0, title: "Company Overview", icon: Building2 },
  { id: 1, title: "Business Model & Value", icon: Briefcase },
  { id: 2, title: "Funding Details", icon: CircleDollarSign },
  { id: 3, title: "Consumer & Market", icon: Map },
  { id: 4, title: "Competitors (Optional)", icon: Swords },
] as const;

const STORAGE_KEY = "startup_edit_memo_data";
const STEP_KEY = "startup_edit_memo_step";

export interface StartupMemoEditViewProps {
  defaultData: StartupOnboardingData;
  initialData?: Partial<StartupOnboardingData>;
  validateStep: (step: number, data: StartupOnboardingData) => StepValidation;
  onSubmit: (data: StartupOnboardingData) => Promise<void>;
  onComplete: () => void;
  onBack: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}

export function StartupMemoEditView({
  defaultData,
  initialData,
  validateStep,
  onSubmit,
  onComplete,
  onBack,
  onDirtyChange,
}: StartupMemoEditViewProps) {
  const handleUpdate = (onUpdate: (data: Partial<StartupOnboardingData>) => void) => (partial: Partial<StartupOnboardingData>) => {
    onDirtyChange?.(true);
    onUpdate(partial);
  };

  const renderStep = (
    step: number,
    data: StartupOnboardingData,
    onUpdate: (data: Partial<StartupOnboardingData>) => void,
    onNext: () => void,
    onBackStep: () => void,
    onSubmitStep: () => void,
    submitLabel?: string,
    isSubmitting?: boolean
  ) => {
    const update = handleUpdate(onUpdate);

    switch (step) {
      case 0:
        return (
          <CompanyInfoStep
            data={data}
            onUpdate={update}
            onLogoUpload={async (file: File) => {
              const { getAuth } = await import("firebase/auth");
              const user = getAuth().currentUser;
              if (!user) throw new Error("Not authenticated");
              const oldUrl = typeof data.startupLogoUrl === "string" ? data.startupLogoUrl : "";
              if (oldUrl) await deleteFile(oldUrl).catch(() => {});
              return uploadFile(file, "startup_logo", user.uid);
            }}
            onNext={onNext}
            onBack={onBackStep}
            isEditMode={true}
          />
        );
      case 1:
        return <BusinessModelStep data={data} onUpdate={update} onNext={onNext} onBack={onBackStep} />;
      case 2:
        return <FundingRoundStep data={data} onUpdate={update} onNext={onNext} onBack={onBackStep} />;
      case 3:
        return <CustomerMarketStep data={data} onUpdate={update} onNext={onNext} onBack={onBackStep} />;
      case 4:
        return (
          <CompetitorsStep
            data={data}
            onUpdate={update}
            onSubmit={onSubmitStep}
            onBack={onBackStep}
            submitLabel={submitLabel}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">

      <OnboardingPage
        title="Edit Memo"
        description="Update your startup memo. Changes will be saved to your profile."
        steps={[...EDIT_MEMO_STEPS]}
        storageKey={STORAGE_KEY}
        stepKey={STEP_KEY}
        defaultData={defaultData}
        initialData={initialData}
        renderStep={renderStep}
        validateStep={validateStep}
        onSubmit={onSubmit}
        onComplete={onComplete}
        requiredSteps={[0, 1, 3]}
        submitLabel="Save"
        loadingText="Saving memo..."
        successTitle="Memo saved!"
        successDescription="Your startup memo has been updated."
        isEmbed
      />
    </div>
  );
}

export default StartupMemoEditView;
