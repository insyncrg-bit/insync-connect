import { OnboardingPage, StepValidation } from "@/components/onboarding";
import { PersonalProfileStep } from "./components/steps/PersonalProfileStep";
import { WelcomeStep } from "./components/steps/WelcomeStep";
import { FundOverviewStep } from "./components/steps/FundOverviewStep";
import { InvestmentStrategyStep } from "./components/steps/InvestmentStrategyStep";
import { ValueAddStep } from "./components/steps/ValueAddStep";
import { PortfolioStep } from "./components/steps/PortfolioStep";
import { DealMechanicsStep } from "./components/steps/DealMechanicsStep";
import { STEPS } from "./constants";
import { VCOnboardingData, defaultData } from "./hooks/vcMemoTypes";
import { sessionManager } from "@/lib/session";
import { useNavigate } from "react-router-dom";

export const VCOnboarding = () => {
  const navigate = useNavigate();
  
  // Validation function for each step
  const validateStep = (step: number, data: VCOnboardingData): StepValidation => {
    const errors: string[] = [];
    
    switch (step) {
      case 0: // Welcome
        return { isValid: true, errors: [] };
      // case x: // Personal Profile (Temporarily hidden)
      //   if (data.investingSectors.length === 0) errors.push("Add at least one investing sector");
      //   break;
      case 1: // Fund Overview (Merged Admin & Verification)
        if (!data.firmName.trim()) errors.push("Firm name is required");
        if (!data.hqLocation.trim()) errors.push("HQ location is required");
        if (!data.firmDescription.trim()) errors.push("Firm description is required");
        if (!data.fundType) errors.push("Fund type is required");
        if (data.checkSizes.length === 0) errors.push("Select at least one check size");
        if (data.stageFocus.length === 0) errors.push("Select at least one stage focus");
        break;
      case 2: // Investment Strategy
        if (!data.thesisStatement.trim()) errors.push("Thesis statement is required");
        break;
      case 3: // Value-Add
        if (data.operatingSupport.length === 0) errors.push("Select at least one operating support type");
        if (!data.firmInvolvement.trim()) errors.push("Firm involvement description is required");
        break;
      case 4: // Portfolio - optional, no validation
        return { isValid: true, errors: [] };
      case 5: // Deal Mechanics - optional, no validation
        return { isValid: true, errors: [] };
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async (data: VCOnboardingData) => {
    try {
      const session = sessionManager.get();
      const firmId = session?.firmId;

      if (!firmId) {
        console.error("No firm ID in session");
        return;
      }

      // Get auth token
      const { getAuth } = await import("firebase/auth");
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      const token = await user.getIdToken();
      const apiUrl = import.meta.env.VITE_FIREBASE_API;
      const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      };

      // Explicitly destructure to omit them from memoData
      const {
        fullName,
        email,
        linkedIn,
        title,
        profileImage,
        profileImagePreview,
        investingSectors,
        funFact,
        ...memoData
      } = data;

      // 4. Update Firm Memo
      const memoRes = await fetch(`${apiUrl}/api/firms/${firmId}/memo`, {
        method: "POST",
        headers,
        body: JSON.stringify(memoData)
      });

      if (!memoRes.ok) {
        throw new Error("Failed to save memo");
      }
      
      // Mark onboarding as complete in session
      sessionManager.completeOnboarding();
      
      // Save onboarding data to session (legacy/backup)
      sessionManager.updateOnboarding({
        fields: data,
      });

      // Force token refresh to get new claims (onboarding_complete)
      await user.getIdToken(true);

      navigate("/vc-dashboard");
    } catch (error) {
      console.error("Error submitting onboarding:", error);
      // Show error toast
    }
  };

  const handleComplete = () => {
    // This function might be redundant if handleSubmit handles navigation, 
    // but keep it if the OnboardingPage component uses it for the "Finish" button action separate from submit?
    // In OnboardingPage, `onSubmit` is called on the final step. `onComplete` might be called after?
    // Looking at OnboardingPage usage in other files, onSubmit is usually the main handler.
    // We'll keep handleComplete as a fallback or for the "Next" button on the final step if it acts as submit.
    navigate("/vc-dashboard");
  };

  const renderStep = (
    step: number,
    data: VCOnboardingData,
    onUpdate: (data: Partial<VCOnboardingData>) => void,
    onNext: () => void,
    onBack: () => void,
    onSubmit: () => void,
    submitLabel?: string,
    isSubmitting?: boolean
  ) => {
    switch (step) {
      case 0:
        return <WelcomeStep onNext={onNext} />;
      // case x: 
      //   return <PersonalProfileStep data={data} onUpdate={onUpdate} onNext={onNext} />;
      case 1:
        return (
          <FundOverviewStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 2:
        return (
          <InvestmentStrategyStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 3:
        return (
          <ValueAddStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 4:
        return (
          <PortfolioStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 5:
        return (
          <DealMechanicsStep
            data={data}
            onUpdate={onUpdate}
            onSubmit={onSubmit}
            onBack={onBack}
            submitLabel={submitLabel}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <OnboardingPage
      title="VC Onboarding"
      description="Complete your firm profile to start matching with startups"
      steps={STEPS}
      storageKey="vc_onboarding_data"
      stepKey="vc_onboarding_step"
      defaultData={defaultData}
      renderStep={renderStep}
      validateStep={validateStep}
      onSubmit={handleSubmit}
      onComplete={handleComplete}
      requiredSteps={[1, 2, 3]} // Welcome (0) is implicit. Fund Overview (1) to Value Add (3) required.
    />
  );
};

export default VCOnboarding;
