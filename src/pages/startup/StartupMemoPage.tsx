import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Loader2, FileText, PencilLine, ExternalLink } from "lucide-react";
import type { StepValidation } from "@/components/onboarding";
import { useToast } from "@/hooks/use-toast";
import {
  defaultData,
  type StartupOnboardingData,
} from "./startup-onboarding/hooks/startupMemoTypes";
import { uploadFile, deleteFile } from "@/lib/api";
import { onboardingToMemoPayload } from "@/lib/startupMemoUtils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MemoEditor = lazy(() => import("@/components/MemoEditor").then((m) => ({ default: m.MemoEditor })));
const StartupMemoEditView = lazy(() => import("./StartupMemoEditView.tsx"));

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


  const startupLogoUrl =
    toStringOrEmpty(
      (s as any).startupLogoUrl ??
        (s as any).startup_logo_url ??
        (s as any).companyLogoUrl ??
        (s as any).logo_url
    ) || null;
  const pitchdeckUrl =
    toStringOrEmpty(
      (s as any).pitchdeckUrl ??
        (s as any).pitchdeck_url
    ) || null;
  const pitchdeckName =
    toStringOrEmpty(
      (s as any).pitchdeckName ??
        (s as any).pitchdeck_name
    ) || null;

  return {
    companyName: toStringOrEmpty(s.companyName ?? s.company_name ?? s.company),
    website: toStringOrEmpty(s.website),
    linkedIn: toStringOrEmpty(s.linkedIn ?? s.companyLinkedIn ?? s.company_linkedin),
    vertical: toStringOrEmpty(s.vertical),
    stage: toStringOrEmpty(s.stage),
    location: toStringOrEmpty(s.location),
    startupLogoUrl,
    logoPreview: startupLogoUrl,
    pitchdeckUrl,
    pitchdeckName,

    companyOverview: toStringOrEmpty(
      s.companyOverview ?? s.company_overview ?? s.business_model ?? s.businessModel
    ),

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

export function StartupMemoPage() {
  const { toast } = useToast();
  const isDirtyRef = useRef(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const baseUrl = useMemo(() => {
    const apiUrl = import.meta.env.VITE_FIREBASE_API as string | undefined;
    return apiUrl ? apiUrl.replace(/\/$/, "") : "";
  }, []);

  const [memoQuery, profileQuery] = useQueries({
    queries: [
      {
        queryKey: ["startup-memo", baseUrl, refreshKey],
        queryFn: async (): Promise<StartupMemoLike | null> => {
          const { getAuth } = await import("firebase/auth");
          const user = getAuth().currentUser;
          if (!user) throw new Error("You must be logged in to edit your memo.");
          if (!baseUrl) throw new Error("API base URL is not configured.");
          const token = await user.getIdToken();
          const res = await fetch(`${baseUrl}/startups/me/memo`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.status === 404) return null;
          if (!res.ok) throw new Error(await res.text());
          const json = await res.json();
          return (json.memo ?? null) as StartupMemoLike | null;
        },
        enabled: !!baseUrl,
      },
      {
        queryKey: ["startup-profile", baseUrl, refreshKey],
        queryFn: async (): Promise<StartupMemoLike> => {
          const { getAuth } = await import("firebase/auth");
          const user = getAuth().currentUser;
          if (!user) throw new Error("You must be logged in to edit your memo.");
          if (!baseUrl) throw new Error("API base URL is not configured.");
          const token = await user.getIdToken();
          const res = await fetch(`${baseUrl}/startups/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error(await res.text());
          const json = await res.json();
          return (json.startup ?? {}) as StartupMemoLike;
        },
        enabled: !!baseUrl,
      },
    ],
  });

  const loading = memoQuery.isPending || profileQuery.isPending;
  const memoData = memoQuery.data;
  const profileData = profileQuery.data;

  const existingMemo = useMemo(() => {
    if (memoQuery.isError || profileQuery.isError) return null;
    if (memoData === undefined || profileData === undefined) return null;
    const memo = memoData;
    const profile = profileData;
    const source: StartupMemoLike | null = memo
      ? { ...profile, ...memo } as StartupMemoLike
      : Object.keys(profile).length ? profile : null;
    if (!source) return null;
    const prefill = buildPrefill(source);
    const onboardingData = { ...defaultData, ...prefill };
    const hasMemoStructure = !!(source as any).application_sections || (source as any).applicationSections;
    const memoFormat = hasMemoStructure ? source : onboardingToMemoPayload(onboardingData);
    return {
      ...memoFormat,
      company_name:
        (memoFormat as any).company_name ?? prefill.companyName ?? (source as any).companyName ?? "",
      linkedIn:
        (memoFormat as any).linkedIn ?? (source as any).linkedIn ?? prefill.linkedIn ?? "",
      logo_url:
        (memoFormat as any).logo_url ??
        (source as any).startupLogoUrl ??
        (source as any).companyLogoUrl ??
        prefill.startupLogoUrl ??
        null,
      pitchdeck_url:
        (memoFormat as any).pitchdeck_url ?? (source as any).pitchdeckUrl ?? prefill.pitchdeckUrl ?? null,
      pitchdeck_name:
        (memoFormat as any).pitchdeck_name ?? (source as any).pitchdeckName ?? prefill.pitchdeckName ?? null,
    } as StartupMemoLike;
  }, [memoData, profileData, memoQuery.isError, profileQuery.isError]);


  // Compute initialData for the edit view from fetched data
  const editInitialData = useMemo<Partial<StartupOnboardingData> | undefined>(() => {
    if (loading || !existingMemo) return undefined;
    return buildPrefill(existingMemo);
  }, [loading, existingMemo]);

  useEffect(() => {
    if (memoQuery.isError || profileQuery.isError) {
      const err = memoQuery.error ?? profileQuery.error;
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to load your memo.",
        variant: "destructive",
      });
    }
  }, [memoQuery.isError, profileQuery.isError, memoQuery.error, profileQuery.error, toast]);

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
      case 0: // Company Overview
        if (!data.companyName.trim()) errors.push("Company name is required");
        if (!data.vertical) errors.push("Vertical is required");
        if (!data.stage) errors.push("Stage is required");
        if (!data.location.trim()) errors.push("Location is required");
        if (countWords(data.companyOverview) < 30) {
          errors.push("Company overview needs at least 30 words");
        }
        break;
      case 1: // Business Model & Value
        if (data.customerType.length === 0) {
          errors.push("Select at least one customer type");
        }
        if (data.pricingStrategies.length === 0) {
          errors.push("Select at least one pricing strategy");
        }
        if (countWords(data.currentPainPoint) < 20) {
          errors.push("Problem statement needs at least 20 words");
        }
        if (data.valueDrivers.length === 0) {
          errors.push("Select at least one value driver");
        }
        break;
      case 2: // Funding Details (optional)
        return { isValid: true, errors: [] };
      case 3: // Consumer & Market
        if (!data.targetGeography.trim()) errors.push("Target geography is required");
        if (countWords(data.targetCustomerDescription) < 20) errors.push("Customer description needs at least 20 words");
        if (!data.tamValue.trim()) errors.push("TAM value is required");
        if (!data.samValue.trim()) errors.push("SAM value is required");
        if (!data.somValue.trim()) errors.push("SOM value is required");
        if (!data.gtmAcquisition.trim()) errors.push("Customer acquisition strategy is required");
        break;
      case 4: // Competitors (optional)
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

      // First, handle startup-level assets (logo, pitch deck) on the profile.
      let startupLogoUrl: string | undefined;
      if (data.companyLogo instanceof File) {
        const oldUrl = typeof data.startupLogoUrl === "string" ? data.startupLogoUrl : "";
        if (oldUrl) {
          await deleteFile(oldUrl).catch(() => {});
        }
        startupLogoUrl = await uploadFile(data.companyLogo, "startup_logo", user.uid);
      }

      let pitchdeckUrl: string | undefined;
      let pitchdeckName: string | undefined;
      if (data.pitchdeck instanceof File) {
        const oldUrl = typeof data.pitchdeckUrl === "string" ? data.pitchdeckUrl : "";
        if (oldUrl) {
          await deleteFile(oldUrl).catch(() => {});
        }
        pitchdeckUrl = await uploadFile(data.pitchdeck, "pitchdeck", user.uid);
        pitchdeckName = data.pitchdeck.name;
      }

      // Lean profile: identifier fields only (for search/filtering)
      const profilePayload: Record<string, unknown> = {
        companyName: data.companyName,
        location: data.location,
        website: data.website,
        linkedIn: data.linkedIn,
      };

      // Apply profile updates (PATCH-first, POST fallback).
      let profileRes = await fetch(`${baseUrl}/startups/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profilePayload),
      });

      if (profileRes.status === 404) {
        profileRes = await fetch(`${baseUrl}/startups/me`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profilePayload),
        });
      }

      if (!profileRes.ok) {
        const errText = await profileRes.text();
        throw new Error(errText || "Failed to save profile fields.");
      }

      // Full memo: identifiers + logo + pitch deck + overview + team + sections
      const logoUrl = startupLogoUrl ?? (typeof data.startupLogoUrl === "string" ? data.startupLogoUrl : undefined);
      const memoPayload = onboardingToMemoPayload(data, {
        logo_url: logoUrl,
        pitchdeck_url: pitchdeckUrl,
        pitchdeck_name: pitchdeckName,
      });

      // PATCH first (preserve unknown memo fields), fall back to POST if memo doesn't exist yet
      let res = await fetch(`${baseUrl}/startups/me/memo`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memoPayload),
      });

      if (res.status === 404) {
        res = await fetch(`${baseUrl}/startups/me/memo`, {
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

      setRefreshKey((k) => k + 1);
      toast({
        title: "Success",
        description: "Your memo has been updated.",
      });
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

  // Shell always visible: title, subtitle, tabs; spinner only in content area when loading
  const pitchUrl =
    !loading && existingMemo
      ? ((existingMemo as any)?.pitchdeck_url ?? (existingMemo as any)?.pitchdeckUrl ?? null)
      : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Edit Startup Memo</h1>
        <p className="text-white/60 mt-1">Update your company details and pitch deck for investors.</p>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--cyan-glow))]" />
        </div>
      ) : (
        <div className="bg-navy-card/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
          <Suspense
            fallback={
              <div className="min-h-[40vh] flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--cyan-glow))]" />
              </div>
            }
          >
            <StartupMemoEditView
              defaultData={defaultData}
              initialData={editInitialData}
              validateStep={validateStep}
              onSubmit={handleSubmit}
              onComplete={() => {
                toast({ title: "Success", description: "Memo updated successfully" });
              }}
              onBack={() => {}}
              onDirtyChange={(dirty) => {
                isDirtyRef.current = dirty;
              }}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}

export default StartupMemoPage;

