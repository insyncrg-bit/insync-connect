import { useEffect, useRef, useState } from "react";

import { OnboardingPage, StepValidation } from "@/components/onboarding";
import { FundOverviewStep } from "./vc-onboarding/components/steps/FundOverviewStep";
import { InvestmentStrategyStep } from "./vc-onboarding/components/steps/InvestmentStrategyStep";
import { ValueAddStep } from "./vc-onboarding/components/steps/ValueAddStep";
import { PortfolioStep } from "./vc-onboarding/components/steps/PortfolioStep";
import { DealMechanicsStep } from "./vc-onboarding/components/steps/DealMechanicsStep";
import { VCOnboardingData, defaultData } from "./vc-onboarding/hooks/useVCOnboardingStorage";
import { Building2, Target, Handshake, FolderOpen, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Steps for Edit Memo (steps 2–6 from onboarding, re-indexed 0–4)
const EDIT_MEMO_STEPS = [
  { id: 0, title: "Fund Overview", icon: Building2 },
  { id: 1, title: "Investment Strategy", icon: Target },
  { id: 2, title: "Value-Add", icon: Handshake },
  { id: 3, title: "Portfolio", icon: FolderOpen },
  { id: 4, title: "Deal Mechanics (Optional)", icon: Briefcase },
];

const STORAGE_KEY = "vc_edit_memo_data";
const STEP_KEY = "vc_edit_memo_step";

interface EditMemoTabProps {
  memoData: Partial<VCOnboardingData> | null;
  firmId: string | null;
  onSaved: () => void;
}

export function EditMemoTab({ memoData, firmId, onSaved }: EditMemoTabProps) {
  const { toast } = useToast();
  const isDirtyRef = useRef(false);
  const [seeded, setSeeded] = useState(false);

  // Seed localStorage with memo data on mount so OnboardingPage picks it up
  useEffect(() => {
    if (memoData) {
      const prefilled: VCOnboardingData = { ...defaultData, ...memoData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefilled));
      localStorage.setItem(STEP_KEY, "0");
      // Clear completed steps so all steps are accessible
      localStorage.removeItem(`${STEP_KEY}_completed`);
    }
    setSeeded(true);
  }, []); // Only run on mount

  // Browser back/refresh guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);


  const validateStep = (step: number, data: VCOnboardingData): StepValidation => {
    const errors: string[] = [];
    switch (step) {
      case 0: // Fund Overview
        if (!data.firmName.trim()) errors.push("Firm name is required");
        if (!data.hqLocation.trim()) errors.push("HQ location is required");
        if (!data.firmDescription.trim()) errors.push("Firm description is required");
        if (!data.fundType) errors.push("Fund type is required");
        if (data.checkSizes.length === 0) errors.push("Select at least one check size");
        if (data.stageFocus.length === 0) errors.push("Select at least one stage focus");
        break;
      case 1: // Investment Strategy
        if (!data.thesisStatement.trim()) errors.push("Thesis statement is required");
        break;
      case 2: // Value-Add
        if (data.operatingSupport.length === 0) errors.push("Select at least one operating support type");
        if (!data.firmInvolvement.trim()) errors.push("Firm involvement description is required");
        break;
      case 3: // Portfolio - optional
        return { isValid: true, errors: [] };
      case 4: // Deal Mechanics - optional
        return { isValid: true, errors: [] };
    }
    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async (data: VCOnboardingData) => {
    if (!firmId) {
      toast({ title: "Error", description: "No firm ID found. Please refresh and try again.", variant: "destructive" });
      return;
    }

    try {
      const { getAuth } = await import("firebase/auth");
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");

      const token = await user.getIdToken();
      const apiUrl = import.meta.env.VITE_FIREBASE_API;

      // Exclude personal profile fields — same as original onboarding submit
      const {
        fullName,
        email,
        linkedIn,
        title,
        profileImage,
        profileImagePreview,
        investingSectors,
        funFact,
        ...memoPayload
      } = data;

      const res = await fetch(`${apiUrl}/api/firms/${firmId}/memo`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memoPayload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to save memo: ${errText}`);
      }

      // Clear dirty flag and cached edit data
      isDirtyRef.current = false;
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STEP_KEY);
      localStorage.removeItem(`${STEP_KEY}_completed`);

      // Bust the dashboard cache so fresh data is fetched next time
      const session = (await import("@/lib/session")).sessionManager.get();
      if (session?.firmId) {
        sessionStorage.removeItem(`dashboardData_${session.firmId}`);
      }

      toast({ title: "Memo saved!", description: "Your investment memo has been updated." });
      onSaved();
    } catch (err: any) {
      console.error("Error saving memo:", err);
      toast({ title: "Error", description: err.message || "Failed to save memo.", variant: "destructive" });
    }
  };

  const renderStep = (
    step: number,
    data: VCOnboardingData,
    onUpdate: (data: Partial<VCOnboardingData>) => void,
    onNext: () => void,
    onBack: () => void,
    onSubmit: () => void,
    submitLabel?: string
  ) => {
    // Mark dirty on any update
    const handleUpdate = (partial: Partial<VCOnboardingData>) => {
      isDirtyRef.current = true;
      onUpdate(partial);
    };

    switch (step) {
      case 0:
        return <FundOverviewStep data={data} onUpdate={handleUpdate} onNext={onNext} onBack={onBack} />;
      case 1:
        return <InvestmentStrategyStep data={data} onUpdate={handleUpdate} onNext={onNext} onBack={onBack} />;
      case 2:
        return <ValueAddStep data={data} onUpdate={handleUpdate} onNext={onNext} onBack={onBack} />;
      case 3:
        return <PortfolioStep data={data} onUpdate={handleUpdate} onNext={onNext} onBack={onBack} />;
      case 4:
        return <DealMechanicsStep data={data} onUpdate={handleUpdate} onSubmit={onSubmit} onBack={onBack} submitLabel={submitLabel} />;
      default:
        return null;
    }
  };

  if (!seeded) return null;

  return (
    <OnboardingPage
      title="Edit Investment Memo"
      description="Update your firm's investment memo. Changes will be saved to your profile."
      steps={EDIT_MEMO_STEPS}
      storageKey={STORAGE_KEY}
      stepKey={STEP_KEY}
      defaultData={defaultData}
      renderStep={renderStep}
      validateStep={validateStep}
      onSubmit={handleSubmit}
      onComplete={onSaved}
      requiredSteps={[0, 1, 2]}
      submitLabel="Save"
      loadingText="Saving memo..."
      successTitle="Memo saved!"
      successDescription="Your investment memo has been updated."
    />
  );
}
