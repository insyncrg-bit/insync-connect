import { OnboardingPage, StepValidation } from "@/components/onboarding";
import { WelcomeStep } from "./components/steps/WelcomeStep";
import { CompanyInfoStep } from "./components/steps/CompanyInfoStep";
import { TeamOverviewStep } from "./components/steps/TeamOverviewStep";
import { ValuePropositionStep } from "./components/steps/ValuePropositionStep";
import { BusinessModelStep } from "./components/steps/BusinessModelStep";
import { FundingRoundStep } from "./components/steps/FundingRoundStep";
import { GoToMarketStep } from "./components/steps/GoToMarketStep";
import { CustomerMarketStep } from "./components/steps/CustomerMarketStep";
import { CompetitorsStep } from "./components/steps/CompetitorsStep";
import { STEPS } from "./constants";
import { StartupOnboardingData, defaultData } from "./hooks/useStartupOnboardingStorage";
import { sessionManager } from "@/lib/session";
import { useNavigate } from "react-router-dom";

// Word count helper
const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export const StartupOnboarding = () => {
  const navigate = useNavigate();
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
      case 5: // Funding & Round (optional for now)
        return { isValid: true, errors: [] };
      case 6: // Go-to-Market
        if (!data.gtmAcquisition.trim()) {
          errors.push("Customer acquisition strategy is required");
        }
        break;
      case 7: // Customer & Market
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
      case 8: // Competitors - optional
        return { isValid: true, errors: [] };
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async (data: StartupOnboardingData) => {
    try {
      const { getAuth } = await import("firebase/auth");
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Not authenticated");
      }
      const token = await user.getIdToken();
      const apiUrl = import.meta.env.VITE_FIREBASE_API;
      if (!apiUrl) {
        throw new Error("API not configured");
      }
      // Strip File fields so JSON is serializable; uploads can be handled separately later
      const payload = { ...data } as Record<string, unknown>;
      (["companyLogo", "logoPreview", "pitchdeck"] as const).forEach((k) => {
        if (payload[k] instanceof File) delete payload[k];
      });
      const baseUrl = apiUrl.replace(/\/$/, "");
      const profileUrl = `${baseUrl}/api/startups/me`;
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/5ce772b9-3080-4ec6-94ac-b8b4c43f9b0e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3d819f'},body:JSON.stringify({sessionId:'3d819f',location:'StartupOnboarding.tsx:handleSubmit',message:'before profile POST',data:{apiUrlLen:apiUrl?.length,hasUser:!!user,payloadKeys:Object.keys(payload).length},hypothesisId:'H2,H5',timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      const response = await fetch(profileUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      // #region agent log
      let errBody: unknown = null;
      if (!response.ok) {
        errBody = await response.json().catch(() => ({}));
        fetch('http://127.0.0.1:7243/ingest/5ce772b9-3080-4ec6-94ac-b8b4c43f9b0e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3d819f'},body:JSON.stringify({sessionId:'3d819f',location:'StartupOnboarding.tsx:handleSubmit',message:'after profile POST',data:{ok:response.ok,status:response.status,errorMsg:(errBody as {error?:string})?.error},hypothesisId:'H2,H3,H4',timestamp:Date.now()})}).catch(()=>{});
      } else {
        fetch('http://127.0.0.1:7243/ingest/5ce772b9-3080-4ec6-94ac-b8b4c43f9b0e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3d819f'},body:JSON.stringify({sessionId:'3d819f',location:'StartupOnboarding.tsx:handleSubmit',message:'after profile POST',data:{ok:response.ok,status:response.status},hypothesisId:'H2,H3,H4',timestamp:Date.now()})}).catch(()=>{});
      }
      // #endregion
      if (!response.ok) {
        const err = errBody ?? {};
        throw new Error((err as { error?: string }).error || "Failed to save profile");
      }
      sessionManager.completeOnboarding();
      sessionManager.updateOnboarding({ fields: data });
      await user.getIdToken(true);
      // Navigation happens in handleComplete after OnboardingPage shows success toast
    } catch (error) {
      console.error("Error submitting startup onboarding:", error);
      throw error;
    }
  };

  const handleComplete = () => {
    // Redirect founders to the coming-soon startup dashboard placeholder
    navigate("/startup-dashboard");
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
          <FundingRoundStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 6:
        return (
          <GoToMarketStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 7:
        return (
          <CustomerMarketStep
            data={data}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        );
      case 8:
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
      onComplete={handleComplete}
      requiredSteps={[1, 2, 3, 4, 6, 7]} // Funding & Round and Competitors are optional
    />
  );
};

export default StartupOnboarding;
