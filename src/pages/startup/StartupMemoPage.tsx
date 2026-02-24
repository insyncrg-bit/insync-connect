import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Target, Briefcase, CircleDollarSign, TrendingUp, Map, Swords } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OnboardingPage, StepValidation } from "@/components/onboarding";
import { useToast } from "@/hooks/use-toast";
import {
  defaultData,
  type StartupOnboardingData,
  type TeamMember,
} from "./startup-onboarding/hooks/useStartupOnboardingStorage";
import { ValuePropositionStep } from "./startup-onboarding/components/steps/ValuePropositionStep";
import { BusinessModelStep } from "./startup-onboarding/components/steps/BusinessModelStep";
import { FundingRoundStep } from "./startup-onboarding/components/steps/FundingRoundStep";
import { GoToMarketStep } from "./startup-onboarding/components/steps/GoToMarketStep";
import { CustomerMarketStep } from "./startup-onboarding/components/steps/CustomerMarketStep";
import { CompetitorsStep } from "./startup-onboarding/components/steps/CompetitorsStep";

// Steps for Edit Memo (steps 3–8 from onboarding, re-indexed 0–5)
const EDIT_MEMO_STEPS = [
  { id: 0, title: "Value Proposition", icon: Target },
  { id: 1, title: "Business Model", icon: Briefcase },
  { id: 2, title: "Funding & Round (Optional)", icon: CircleDollarSign },
  { id: 3, title: "Go-to-Market", icon: TrendingUp },
  { id: 4, title: "Customer & Market", icon: Map },
  { id: 5, title: "Competitors (Optional)", icon: Swords },
] as const;

const STORAGE_KEY = "startup_edit_memo_data";
const STEP_KEY = "startup_edit_memo_step";

type StartupMemoLike = Record<string, unknown>;

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

function toStringOrEmpty(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function toStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
}

function toTeamMembers(v: unknown): TeamMember[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter(Boolean)
    .map((m) => (typeof m === "object" && m ? (m as Record<string, unknown>) : {}))
    .map((m) => ({
      name: toStringOrEmpty(m.name),
      role: toStringOrEmpty(m.role),
      linkedin: toStringOrEmpty(m.linkedin),
      background: toStringOrEmpty(m.background),
    }))
    .filter((m) => m.name || m.role || m.linkedin || m.background);
}

function toCompetitors(v: unknown): StartupOnboardingData["competitors"] {
  if (!Array.isArray(v)) return [];
  return v
    .filter(Boolean)
    .map((c) => (typeof c === "object" && c ? (c as Record<string, unknown>) : {}))
    .map((c) => ({
      name: toStringOrEmpty(c.name),
      description: toStringOrEmpty(c.description),
      howYouDiffer: toStringOrEmpty(c.howYouDiffer),
    }));
}

function buildPrefill(source: StartupMemoLike | null): Partial<StartupOnboardingData> {
  if (!source) return {};
  const s = source as Record<string, unknown>;
  const sections = (s.application_sections ?? s.applicationSections) as Record<string, any> | undefined;
  const section2 = (sections?.section2 ?? {}) as Record<string, unknown>;
  const section3 = (sections?.section3 ?? {}) as Record<string, unknown>;
  const section4 = (sections?.section4 ?? {}) as Record<string, unknown>;
  const section5 = (sections?.section5 ?? {}) as Record<string, unknown>;
  const section6 = (sections?.section6 ?? {}) as Record<string, unknown>;

  const teamMembers = toTeamMembers(s.team_members ?? s.teamMembers);

  return {
    companyName: toStringOrEmpty(s.companyName ?? s.company_name ?? s.company),
    website: toStringOrEmpty(s.website),
    linkedIn: toStringOrEmpty(s.linkedIn ?? s.companyLinkedIn ?? s.company_linkedin),
    vertical: toStringOrEmpty(s.vertical),
    stage: toStringOrEmpty(s.stage),
    location: toStringOrEmpty(s.location),

    companyOverview: toStringOrEmpty(
      s.companyOverview ?? s.company_overview ?? s.business_model ?? s.businessModel
    ),
    teamMembers: teamMembers.length ? teamMembers : defaultData.teamMembers,

    currentPainPoint: toStringOrEmpty(s.currentPainPoint ?? section2.currentPainPoint),
    valueDrivers: toStringArray(s.valueDrivers ?? section2.valueDrivers),
    valueDriverExplanations:
      (typeof (s.valueDriverExplanations ?? section2.valueDriverExplanations) === "object" &&
      (s.valueDriverExplanations ?? section2.valueDriverExplanations))
        ? ((s.valueDriverExplanations ?? section2.valueDriverExplanations) as Record<string, string>)
        : {},

    customerType: toStringArray(s.customerType ?? section3.customerType),
    customerTypeExplanation: toStringOrEmpty(s.customerTypeExplanation ?? section3.customerTypeExplanation),
    businessStructure: toStringOrEmpty(s.businessStructure ?? section3.businessStructure),
    pricingStrategies: toStringArray(s.pricingStrategies ?? section3.pricingStrategies),

    previousInvestors: toStringOrEmpty(s.previousInvestors ?? section3.previousInvestors),
    leadInvestor: toStringOrEmpty(s.leadInvestor ?? section3.leadInvestor),
    roundDetails: toStringOrEmpty(s.roundDetails ?? section3.roundDetails),
    fundingUse: toStringOrEmpty(s.fundingUse ?? section3.fundingUse),

    subscriptionType: toStringOrEmpty(s.subscriptionType ?? section3.subscriptionType),
    subscriptionBillingCycle: toStringOrEmpty(s.subscriptionBillingCycle ?? section3.subscriptionBillingCycle),
    subscriptionTiers: toStringOrEmpty(s.subscriptionTiers ?? section3.subscriptionTiers),
    transactionFeeType: toStringOrEmpty(s.transactionFeeType ?? section3.transactionFeeType),
    transactionFeePercentage: toStringOrEmpty(s.transactionFeePercentage ?? section3.transactionFeePercentage),
    licensingModel: toStringOrEmpty(s.licensingModel ?? section3.licensingModel),
    adRevenueModel: toStringOrEmpty(s.adRevenueModel ?? section3.adRevenueModel),
    serviceType: toStringOrEmpty(s.serviceType ?? section3.serviceType),
    revenueMetrics: toStringArray(s.revenueMetrics ?? section3.revenueMetrics),
    revenueMetricsValues: toStringOrEmpty(s.revenueMetricsValues ?? section3.revenueMetricsValues),

    gtmAcquisition: toStringOrEmpty(s.gtmAcquisition ?? section4.gtmAcquisition),
    gtmTimeline: toStringOrEmpty(s.gtmTimeline ?? section4.gtmTimeline),

    targetGeography: toStringOrEmpty(s.targetGeography ?? section5.targetGeography),
    targetCustomerDescription: toStringOrEmpty(
      s.targetCustomerDescription ?? section5.targetCustomerDescription
    ),
    tamValue: toStringOrEmpty(s.tamValue ?? section5.tamValue),
    tamCalculationMethod: toStringOrEmpty(s.tamCalculationMethod ?? section5.tamCalculationMethod),
    tamBreakdown: toStringOrEmpty(s.tamBreakdown ?? section5.tamBreakdown),
    samValue: toStringOrEmpty(s.samValue ?? section5.samValue),
    samBreakdown: toStringOrEmpty(s.samBreakdown ?? section5.samBreakdown),
    somValue: toStringOrEmpty(s.somValue ?? section5.somValue),
    somTimeframe: toStringOrEmpty(s.somTimeframe ?? section5.somTimeframe),
    somBreakdown: toStringOrEmpty(s.somBreakdown ?? section5.somBreakdown),

    competitors: (() => {
      const fromTop = toCompetitors(s.competitors);
      const fromSection = toCompetitors(section6.competitors);
      const base = (fromTop.length ? fromTop : fromSection) as StartupOnboardingData["competitors"];
      return base.length ? base : defaultData.competitors;
    })(),
    competitiveMoat: toStringOrEmpty(s.competitiveMoat ?? section6.competitiveMoat),
  };
}

function onboardingToMemoPayload(data: StartupOnboardingData): StartupMemoLike {
  const teamMembers = data.teamMembers.filter((m) => m.name || m.role || m.linkedin || m.background);
  const competitors = data.competitors.filter((c) => c.name || c.description || c.howYouDiffer);

  const applicationSections = {
    section2: {
      currentPainPoint: data.currentPainPoint,
      valueDrivers: data.valueDrivers,
      valueDriverExplanations: data.valueDriverExplanations,
    },
    section3: {
      customerType: data.customerType,
      customerTypeExplanation: data.customerTypeExplanation,
      businessStructure: data.businessStructure,
      pricingStrategies: data.pricingStrategies,

      previousInvestors: data.previousInvestors,
      leadInvestor: data.leadInvestor,
      roundDetails: data.roundDetails,
      fundingUse: data.fundingUse,

      subscriptionType: data.subscriptionType,
      subscriptionBillingCycle: data.subscriptionBillingCycle,
      subscriptionTiers: data.subscriptionTiers,
      transactionFeeType: data.transactionFeeType,
      transactionFeePercentage: data.transactionFeePercentage,
      licensingModel: data.licensingModel,
      adRevenueModel: data.adRevenueModel,
      serviceType: data.serviceType,
      revenueMetrics: data.revenueMetrics,
      revenueMetricsValues: data.revenueMetricsValues,
    },
    section4: {
      gtmAcquisition: data.gtmAcquisition,
      gtmTimeline: data.gtmTimeline,
    },
    section5: {
      targetGeography: data.targetGeography,
      targetCustomerDescription: data.targetCustomerDescription,
      tamValue: data.tamValue,
      tamCalculationMethod: data.tamCalculationMethod,
      tamBreakdown: data.tamBreakdown,
      samValue: data.samValue,
      samBreakdown: data.samBreakdown,
      somValue: data.somValue,
      somTimeframe: data.somTimeframe,
      somBreakdown: data.somBreakdown,
    },
    section6: {
      competitors,
      competitiveMoat: data.competitiveMoat,
    },
  };

  return {
    company_name: data.companyName,
    vertical: data.vertical,
    stage: data.stage,
    location: data.location,
    website: data.website,
    business_model: data.companyOverview,
    team_members: teamMembers,
    application_sections: applicationSections,
  };
}

export function StartupMemoPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isDirtyRef = useRef(false);
  const [existingMemo, setExistingMemo] = useState<StartupMemoLike | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeded, setSeeded] = useState(false);
  const baseUrl = useMemo(() => {
    const apiUrl = import.meta.env.VITE_FIREBASE_API as string | undefined;
    return apiUrl ? apiUrl.replace(/\/$/, "") : "";
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const { getAuth } = await import("firebase/auth");
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error("You must be logged in to edit your memo.");
        }

        const token = await user.getIdToken();
        const authHeader = { Authorization: `Bearer ${token}` };

        if (!baseUrl) {
          throw new Error("API base URL is not configured.");
        }

        // 1) Prefer existing memo
        let source: StartupMemoLike | null = null;
        try {
          const memoRes = await fetch(`${baseUrl}/api/startups/me/memo`, {
            headers: authHeader,
          });

          if (memoRes.ok) {
            const memoJson = await memoRes.json();
            source = (memoJson.memo || null) as StartupMemoLike | null;
          } else if (memoRes.status !== 404) {
            const errText = await memoRes.text();
            console.error("[StartupMemoPage] Error fetching memo:", errText);
          }
        } catch (err) {
          console.error("[StartupMemoPage] Failed to fetch memo:", err);
        }

        // 2) If no memo exists yet, fall back to startup profile (so we can still prefill)
        if (!source) {
          const profileRes = await fetch(`${baseUrl}/api/startups/me`, {
            headers: authHeader,
          });

          if (!profileRes.ok) {
            const errText = await profileRes.text();
            throw new Error(errText || "Failed to load startup profile.");
          }

          const profileJson = await profileRes.json();
          const p = (profileJson.startup || {}) as StartupMemoLike;
          source = p;
        }

        if (mounted) {
          setExistingMemo(source);
          const prefilled: StartupOnboardingData = {
            ...defaultData,
            ...buildPrefill(source),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(prefilled));
          localStorage.setItem(STEP_KEY, "0");
          localStorage.removeItem(`${STEP_KEY}_completed`);
          setSeeded(true);
        }
      } catch (err: any) {
        console.error("[StartupMemoPage] Error loading data:", err);
        toast({
          title: "Error",
          description: err?.message || "Failed to load your memo.",
          variant: "destructive",
        });
        setSeeded(true);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [toast]);

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

  const validateStep = (step: number, data: StartupOnboardingData): StepValidation => {
    const errors: string[] = [];
    switch (step) {
      case 0: // Value Proposition
        if (countWords(data.currentPainPoint) < 20) errors.push("Pain point description needs at least 20 words");
        if (data.valueDrivers.length === 0) errors.push("Select at least one value driver");
        break;
      case 1: // Business Model
        if (data.customerType.length === 0) errors.push("Select at least one customer type");
        if (data.pricingStrategies.length === 0) errors.push("Select at least one pricing strategy");
        break;
      case 2: // Funding & Round (optional)
        return { isValid: true, errors: [] };
      case 3: // Go-to-Market
        if (!data.gtmAcquisition.trim()) errors.push("Customer acquisition strategy is required");
        break;
      case 4: // Customer & Market
        if (!data.targetGeography.trim()) errors.push("Target geography is required");
        if (countWords(data.targetCustomerDescription) < 20) errors.push("Customer description needs at least 20 words");
        if (!data.tamValue.trim()) errors.push("TAM value is required");
        if (!data.samValue.trim()) errors.push("SAM value is required");
        if (!data.somValue.trim()) errors.push("SOM value is required");
        break;
      case 5: // Competitors (optional)
        return { isValid: true, errors: [] };
    }
    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async (data: StartupOnboardingData) => {
    try {
      const { getAuth } = await import("firebase/auth");
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      if (!baseUrl) throw new Error("API base URL is not configured.");

      const memoPayload = onboardingToMemoPayload(data);

      // PATCH first (preserve unknown memo fields), fall back to POST if memo doesn't exist yet
      let res = await fetch(`${baseUrl}/api/startups/me/memo`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memoPayload),
      });

      if (res.status === 404) {
        res = await fetch(`${baseUrl}/api/startups/me/memo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(memoPayload),
        });
      }

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to save memo.");
      }

      isDirtyRef.current = false;
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STEP_KEY);
      localStorage.removeItem(`${STEP_KEY}_completed`);

      toast({ title: "Memo saved!", description: "Your startup memo has been updated." });
    } catch (err: any) {
      console.error("[StartupMemoPage] Error saving memo:", err);
      toast({
        title: "Error",
        description: err?.message || "Failed to save memo.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const renderStep = (
    step: number,
    data: StartupOnboardingData,
    onUpdate: (data: Partial<StartupOnboardingData>) => void,
    onNext: () => void,
    onBack: () => void,
    onSubmit: () => void,
    submitLabel?: string
  ) => {
    const handleUpdate = (partial: Partial<StartupOnboardingData>) => {
      isDirtyRef.current = true;
      onUpdate(partial);
    };

    switch (step) {
      case 0:
        return <ValuePropositionStep data={data} onUpdate={handleUpdate} onNext={onNext} onBack={onBack} />;
      case 1:
        return <BusinessModelStep data={data} onUpdate={handleUpdate} onNext={onNext} onBack={onBack} />;
      case 2:
        return <FundingRoundStep data={data} onUpdate={handleUpdate} onNext={onNext} onBack={onBack} />;
      case 3:
        return <GoToMarketStep data={data} onUpdate={handleUpdate} onNext={onNext} onBack={onBack} />;
      case 4:
        return <CustomerMarketStep data={data} onUpdate={handleUpdate} onNext={onNext} onBack={onBack} />;
      case 5:
        return (
          <CompetitorsStep
            data={data}
            onUpdate={handleUpdate}
            onSubmit={onSubmit}
            onBack={onBack}
            submitLabel={submitLabel}
          />
        );
      default:
        return null;
    }
  };

  if (loading || !seeded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--cyan-glow))]" />
      </div>
    );
  }

  return (
    <OnboardingPage
      title="Edit Memo"
      description="Update your startup memo. Changes will be saved to your profile."
      steps={[...EDIT_MEMO_STEPS]}
      storageKey={STORAGE_KEY}
      stepKey={STEP_KEY}
      defaultData={defaultData}
      renderStep={renderStep}
      validateStep={validateStep}
      onSubmit={handleSubmit}
      onComplete={() => navigate("/startup-dashboard")}
      requiredSteps={[0, 1, 3, 4]}
      submitLabel="Save"
      loadingText="Saving memo..."
      successTitle="Memo saved!"
      successDescription="Your startup memo has been updated."
    />
  );
}

export default StartupMemoPage;

