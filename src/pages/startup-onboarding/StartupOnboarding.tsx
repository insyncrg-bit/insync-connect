import { OnboardingPage, StepValidation } from "@/pages/onboarding/shared";
import { WelcomeStep } from "./components/steps/WelcomeStep";
import { CompanyInfoStep } from "./components/steps/CompanyInfoStep";
import { TeamOverviewStep } from "./components/steps/TeamOverviewStep";
import { ValuePropositionStep } from "./components/steps/ValuePropositionStep";
import { BusinessModelStep } from "./components/steps/BusinessModelStep";
import { GoToMarketStep } from "./components/steps/GoToMarketStep";
import { CustomerMarketStep } from "./components/steps/CustomerMarketStep";
import { CompetitorsStep } from "./components/steps/CompetitorsStep";
import { STEPS } from "./constants";
import { StartupOnboardingData, defaultData } from "./hooks/useStartupOnboardingStorage";
import { sessionManager } from "@/lib/session";

// Word count helper
const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export const StartupOnboarding = () => {
  // Validation function for each step
  const validateStep = (step: number, data: StartupOnboardingData): StepValidation => {
    const errors: string[] = [];
    
    switch (step) {
      case 0: // Welcome - no validation
        return { isValid: true, errors: [] };
      case 1: // Company Info
        if (!data.companyName.trim()) errors.push("Company name is required");
        if (!data.vertical) errors.push("Vertical is required");
        if (!data.stage) errors.push("Stage is required");
        if (!data.location.trim()) errors.push("Location is required");
        if (!data.founderName.trim()) errors.push("Your name is required");
        if (!data.founderEmail.trim()) errors.push("Your email is required");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.founderEmail)) {
          errors.push("Please enter a valid email address");
        }
        break;
      case 2: // Team & Overview
        if (countWords(data.companyOverview) < 30) {
          errors.push("Company overview needs at least 30 words");
        }
        if (!data.teamMembers[0]?.role?.trim()) {
          errors.push("Your role is required");
        }
        break;
      case 3: // Value Proposition
        if (countWords(data.currentPainPoint) < 20) {
          errors.push("Pain point description needs at least 20 words");
        }
        if (data.valueDrivers.length === 0) {
          errors.push("Select at least one value driver");
        }
        break;
      case 4: // Business Model
        if (data.customerType.length === 0) {
          errors.push("Select at least one customer type");
        }
        if (data.pricingStrategies.length === 0) {
          errors.push("Select at least one pricing strategy");
        }
        break;
      case 5: // Go-to-Market
        if (!data.gtmAcquisition.trim()) {
          errors.push("Customer acquisition strategy is required");
        }
        break;
      case 6: // Customer & Market
        if (!data.targetGeography.trim()) {
          errors.push("Target geography is required");
        }
        if (countWords(data.targetCustomerDescription) < 20) {
          errors.push("Customer description needs at least 20 words");
        }
        if (!data.tamValue.trim()) errors.push("TAM value is required");
        if (!data.samValue.trim()) errors.push("SAM value is required");
        if (!data.somValue.trim()) errors.push("SOM value is required");
        break;
      case 7: // Competitors - optional
        return { isValid: true, errors: [] };
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async (data: StartupOnboardingData) => {
    // TODO: Integrate with backend API
    // const response = await fetch('/api/startup/onboarding', {
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

  const renderStep = (
    step: number,
    data: StartupOnboardingData,
    onUpdate: (data: Partial<StartupOnboardingData>) => void,
    onNext: () => void,
    onBack: () => void,
    onSubmit: () => void
  ) => {
    switch (step) {
      case 0:
        return <WelcomeStep onNext={onNext} />;
      case 1:
        return (
          <CompanyInfoStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 2:
        return (
          <TeamOverviewStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 3:
        return (
          <ValuePropositionStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 4:
        return (
          <BusinessModelStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 5:
        return (
          <GoToMarketStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 6:
        return (
          <CustomerMarketStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 7:
        return (
          <CompetitorsStep
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
      title="Startup Onboarding"
      description="Complete your startup profile to get matched with investors"
      steps={STEPS}
      storageKey="startup_onboarding_data"
      stepKey="startup_onboarding_step"
      defaultData={defaultData}
      renderStep={renderStep}
      validateStep={validateStep}
      onSubmit={handleSubmit}
      requiredSteps={[1, 2, 3, 4, 5, 6]} // Step 7 (competitors) is optional
    />
  );
};

export default StartupOnboarding;
