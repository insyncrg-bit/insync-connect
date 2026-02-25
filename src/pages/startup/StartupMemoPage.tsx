import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, FileText, PencilLine, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { StepValidation } from "@/components/onboarding";
import { useToast } from "@/hooks/use-toast";
import {
  defaultData,
  type StartupOnboardingData,
  type TeamMember,
} from "./startup-onboarding/hooks/useStartupOnboardingStorage";
import { uploadFile, deleteFile } from "@/lib/api";
import { onboardingToMemoPayload } from "@/lib/startupMemo";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MemoEditor = lazy(() => import("@/components/MemoEditor").then((m) => ({ default: m.MemoEditor })));
const StartupMemoEditView = lazy(() => import("./StartupMemoEditView"));

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

export function StartupMemoPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isDirtyRef = useRef(false);
  const [existingMemo, setExistingMemo] = useState<StartupMemoLike | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeded, setSeeded] = useState(false);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [refreshKey, setRefreshKey] = useState(0);
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

        // 1) Fetch memo and profile
        let memo: StartupMemoLike | null = null;
        let profile: StartupMemoLike = {};
        try {
          const [memoRes, profileRes] = await Promise.all([
            fetch(`${baseUrl}/startups/me/memo`, { headers: authHeader }),
            fetch(`${baseUrl}/startups/me`, { headers: authHeader }),
          ]);

          if (memoRes.ok) {
            const memoJson = await memoRes.json();
            memo = (memoJson.memo || null) as StartupMemoLike | null;
          } else if (memoRes.status !== 404) {
            const errText = await memoRes.text();
            console.error("[StartupMemoPage] Error fetching memo:", errText);
          }

          if (profileRes.ok) {
            const profileJson = await profileRes.json();
            profile = (profileJson.startup || {}) as StartupMemoLike;
          }
        } catch (err) {
          console.error("[StartupMemoPage] Failed to fetch data:", err);
        }

        // 2) Merge: memo is primary, profile supplies lean fields (linkedIn, etc.) for backward compat
        const source: StartupMemoLike | null = memo
          ? { ...profile, ...memo } as StartupMemoLike
          : Object.keys(profile).length ? profile : null;

        if (!source) {
          throw new Error("Failed to load startup data.");
        }

        if (mounted) {
          const prefill = buildPrefill(source);
          const onboardingData = { ...defaultData, ...prefill };

          // When source is from profile (no memo doc), it has flat fields. Build memo format for MemoEditor.
          const hasMemoStructure = !!(source as any).application_sections || (source as any).applicationSections;
          const memoFormat = hasMemoStructure
            ? source
            : onboardingToMemoPayload(onboardingData);

          const enrichedForPreview: StartupMemoLike = {
            ...memoFormat,
            company_name:
              (memoFormat as any).company_name ??
              prefill.companyName ??
              (source as any).companyName ??
              "",
            linkedIn:
              (memoFormat as any).linkedIn ??
              (source as any).linkedIn ??
              prefill.linkedIn ??
              "",
            logo_url:
              (memoFormat as any).logo_url ??
              (source as any).startupLogoUrl ??
              (source as any).companyLogoUrl ??
              prefill.startupLogoUrl ??
              null,
            pitchdeck_url:
              (memoFormat as any).pitchdeck_url ??
              (source as any).pitchdeckUrl ??
              prefill.pitchdeckUrl ??
              null,
            pitchdeck_name:
              (memoFormat as any).pitchdeck_name ??
              (source as any).pitchdeckName ??
              prefill.pitchdeckName ??
              null,
          };

          setExistingMemo(enrichedForPreview);

          const prefilled: StartupOnboardingData = onboardingData;
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
  }, [toast, baseUrl, refreshKey]);

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
      case 0: // Company Info
        if (!data.companyName.trim()) errors.push("Company name is required");
        if (!data.vertical) errors.push("Vertical is required");
        if (!data.stage) errors.push("Stage is required");
        if (!data.location.trim()) errors.push("Location is required");
        break;
      case 1: // Team & Overview
        if (countWords(data.companyOverview) < 30) {
          errors.push("Company overview needs at least 30 words");
        }
        if (!data.teamMembers[0]?.role?.trim()) {
          errors.push("Your role is required");
        }
        break;
      case 2: // Value Proposition
        if (countWords(data.currentPainPoint) < 20) errors.push("Pain point description needs at least 20 words");
        if (data.valueDrivers.length === 0) errors.push("Select at least one value driver");
        break;
      case 3: // Business Model
        if (data.customerType.length === 0) errors.push("Select at least one customer type");
        if (data.pricingStrategies.length === 0) errors.push("Select at least one pricing strategy");
        break;
      case 4: // Funding & Round (optional)
        return { isValid: true, errors: [] };
      case 5: // Go-to-Market
        if (!data.gtmAcquisition.trim()) errors.push("Customer acquisition strategy is required");
        break;
      case 6: // Customer & Market
        if (!data.targetGeography.trim()) errors.push("Target geography is required");
        if (countWords(data.targetCustomerDescription) < 20) errors.push("Customer description needs at least 20 words");
        if (!data.tamValue.trim()) errors.push("TAM value is required");
        if (!data.samValue.trim()) errors.push("SAM value is required");
        if (!data.somValue.trim()) errors.push("SOM value is required");
        break;
      case 7: // Competitors (optional)
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
        vertical: data.vertical,
        stage: data.stage,
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

      setMode("view");
      setRefreshKey((k) => k + 1);
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
    !loading && seeded && existingMemo
      ? ((existingMemo as any)?.pitchdeck_url ?? (existingMemo as any)?.pitchdeckUrl ?? null)
      : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Memo</h1>
          <p className="text-white/60 mt-1">Preview what investors see, or update your memo.</p>
        </div>
        <div className="flex items-center gap-3">
          {pitchUrl ? (
            <a
              href={pitchUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-white/20 bg-transparent px-3 py-2 text-xs sm:text-sm font-medium text-white/80 hover:text-white hover:bg-white/10"
              >
                <FileText className="h-4 w-4 mr-1.5" />
                View Deck
                <ExternalLink className="h-3 w-3 ml-1" />
              </button>
            </a>
          ) : null}
          <Tabs value={mode} onValueChange={(v) => setMode(v as "view" | "edit")}>
            <TabsList className="bg-white/10">
              <TabsTrigger
                value="view"
                className="data-[state=active]:bg-[hsl(var(--cyan-glow))] data-[state=active]:text-[hsl(var(--navy-deep))]"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Memo
              </TabsTrigger>
              <TabsTrigger
                value="edit"
                className="data-[state=active]:bg-[hsl(var(--cyan-glow))] data-[state=active]:text-[hsl(var(--navy-deep))]"
              >
                <PencilLine className="h-4 w-4 mr-2" />
                Edit Memo
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {loading || !seeded ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--cyan-glow))]" />
        </div>
      ) : mode === "edit" ? (
        <Suspense
          fallback={
            <div className="min-h-[40vh] flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--cyan-glow))]" />
            </div>
          }
        >
          <StartupMemoEditView
            defaultData={defaultData}
            validateStep={validateStep}
            onSubmit={handleSubmit}
            onComplete={() => setMode("view")}
            onBack={() => setMode("view")}
            onDirtyChange={(dirty) => {
              isDirtyRef.current = dirty;
            }}
          />
        </Suspense>
      ) : existingMemo ? (
        <Suspense
          fallback={
            <div className="min-h-[40vh] flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--cyan-glow))]" />
            </div>
          }
        >
          <MemoEditor application={existingMemo} readOnly hideHeader />
        </Suspense>
      ) : (
        <div className="min-h-[40vh] flex items-center justify-center">
          <p className="text-white/70 text-center max-w-md">
            We couldn&apos;t load your memo yet. Switch to the Edit tab to create or update your memo.
          </p>
        </div>
      )}
    </div>
  );
}

export default StartupMemoPage;

