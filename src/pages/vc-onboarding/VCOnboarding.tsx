import { OnboardingPage, StepValidation } from "@/pages/onboarding/shared";
import { WelcomeStep } from "./components/steps/WelcomeStep";
import { AdminVerificationStep } from "./components/steps/AdminVerificationStep";
import { FundOverviewStep } from "./components/steps/FundOverviewStep";
import { InvestmentStrategyStep } from "./components/steps/InvestmentStrategyStep";
import { ValueAddStep } from "./components/steps/ValueAddStep";
import { PortfolioStep } from "./components/steps/PortfolioStep";
import { DealMechanicsStep } from "./components/steps/DealMechanicsStep";
import { STEPS } from "./constants";
import { VCOnboardingData, defaultData } from "./hooks/useVCOnboardingStorage";
import { sessionManager } from "@/lib/session";
import { useNavigate } from "react-router-dom";

export const VCOnboarding = () => {
  const navigate = useNavigate();
  
  // Validation function for each step
  const validateStep = (step: number, data: VCOnboardingData): StepValidation => {
    const errors: string[] = [];
    
    switch (step) {
      case 0: // Welcome - no validation
        return { isValid: true, errors: [] };
      case 1: // Admin & Verification
        if (!data.firmName.trim()) errors.push("Firm name is required");
        if (!data.hqLocation.trim()) errors.push("HQ location is required");
        if (data.contacts.length === 0 || !data.contacts[0]?.name.trim()) {
          errors.push("At least one contact name is required");
        }
        if (data.contacts.length === 0 || !data.contacts[0]?.email.trim()) {
          errors.push("At least one contact email is required");
        }
        break;
      case 2: // Fund Overview
        if (!data.firmDescription.trim()) errors.push("Firm description is required");
        if (!data.fundType) errors.push("Fund type is required");
        if (data.checkSizes.length === 0) errors.push("Select at least one check size");
        if (data.stageFocus.length === 0) errors.push("Select at least one stage focus");
        break;
      case 3: // Investment Strategy
        if (!data.thesisStatement.trim()) errors.push("Thesis statement is required");
        break;
      case 4: // Value-Add
        if (data.operatingSupport.length === 0) errors.push("Select at least one operating support type");
        if (!data.firmInvolvement.trim()) errors.push("Firm involvement description is required");
        break;
      case 5: // Portfolio - optional, no validation
        return { isValid: true, errors: [] };
      case 6: // Deal Mechanics - optional, no validation
        return { isValid: true, errors: [] };
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async (data: VCOnboardingData) => {
    // TODO: Integrate with backend API
    // const response = await fetch('/api/vc/onboarding', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    
    // For now, just simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mark onboarding as complete in session
    sessionManager.completeOnboarding();
    
    // Save onboarding data to session
    sessionManager.updateOnboarding({
      fields: data,
    });
  };

  const handleComplete = () => {
    // Redirect to VC admin dashboard after onboarding completion
    navigate("/vc-admin?tab=dashboard");
  };

  const renderStep = (
    step: number,
    data: VCOnboardingData,
    onUpdate: (data: Partial<VCOnboardingData>) => void,
    onNext: () => void,
    onBack: () => void,
    onSubmit: () => void
  ) => {
    switch (step) {
      case 0:
        return <WelcomeStep onNext={onNext} />;
      case 1:
        return (
          <AdminVerificationStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 2:
        return (
          <FundOverviewStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 3:
        return (
          <InvestmentStrategyStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 4:
        return (
          <ValueAddStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 5:
        return (
          <PortfolioStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 6:
        return (
          <DealMechanicsStep
            data={data}
            onUpdate={onUpdate}
            onSubmit={onSubmit}
            onBack={onBack}
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
      requiredSteps={[1, 2, 3, 4]} // Steps 0 (welcome), 5 (portfolio), and 6 (deal mechanics) are optional
    />
  );
};

export default VCOnboarding;
