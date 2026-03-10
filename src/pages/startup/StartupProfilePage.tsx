import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Building2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OnboardingPage, StepValidation } from "@/components/onboarding";
import { deleteFile, uploadFile } from "@/lib/api";

import {
  defaultData,
  type StartupOnboardingData,
} from "./startup-onboarding/hooks/startupMemoTypes";
import { CompanyInfoStep } from "./startup-onboarding/components/steps/CompanyInfoStep";

// Steps for Edit Profile (steps 1–2 from onboarding, re-indexed 0–1)
const EDIT_PROFILE_STEPS = [
  { id: 0, title: "Company Overview", icon: Building2 },
] as const;

const STORAGE_KEY = "startup_edit_profile_data";
const STEP_KEY = "startup_edit_profile_step";

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

function toStringOrEmpty(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function buildPrefillFromProfile(source: Record<string, unknown> | null): Partial<StartupOnboardingData> {
  if (!source) return {};
  const applicationSections = (source.applicationSections ?? source.application_sections) as Record<string, any> | undefined;
  const startupLogoUrl = toStringOrEmpty(
    source.startupLogoUrl ?? source.startup_logo_url ?? source.companyLogoUrl ?? source.company_logo_url
  );
  const pitchdeckUrl = toStringOrEmpty(source.pitchdeckUrl ?? source.pitchdeck_url);
  const pitchdeckName = toStringOrEmpty(source.pitchdeckName ?? source.pitchdeck_name);

  return {
    companyName: toStringOrEmpty(source.companyName ?? source.company_name),
    website: toStringOrEmpty(source.website),
    linkedIn: toStringOrEmpty(source.linkedIn ?? source.companyLinkedIn ?? source.company_linkedin),
    vertical: toStringOrEmpty(source.vertical),
    stage: toStringOrEmpty(source.stage),
    location: toStringOrEmpty(source.location),
    startupLogoUrl: startupLogoUrl || null,
    logoPreview: startupLogoUrl || null,
    pitchdeckUrl: pitchdeckUrl || null,
    pitchdeckName: pitchdeckName || null,
    companyOverview: toStringOrEmpty(
      source.companyOverview ??
        source.company_overview ??
        source.business_model ??
        applicationSections?.section1?.companyOverview
    ),
  };
}

export function StartupProfilePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isDirtyRef = useRef(false);
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
        if (!user) throw new Error("You must be logged in to edit your profile.");
        if (!baseUrl) throw new Error("API base URL is not configured.");

        const token = await user.getIdToken();
        const authHeader = { Authorization: `Bearer ${token}` };

        // Load profile (lean) + memo (overview, team, logo, pitch deck)
        const [profileRes, memoRes] = await Promise.all([
          fetch(`${baseUrl}/startups/me`, { headers: authHeader }),
          fetch(`${baseUrl}/startups/me/memo`, { headers: authHeader }),
        ]);

        const profile = profileRes.ok ? ((await profileRes.json()).startup || {}) as Record<string, unknown> : {};
        const memo = memoRes.ok ? ((await memoRes.json()).memo || null) as Record<string, unknown> | null : null;

        if (!profileRes.ok && !memoRes.ok) {
          throw new Error("Failed to load startup data.");
        }

        // Merge profile + memo for display (memo has overview, team, logo, pitch deck)
        const source = { ...profile, ...memo } as Record<string, unknown>;

        if (mounted) {
          const prefilled: StartupOnboardingData = {
            ...defaultData,
            ...buildPrefillFromProfile(source),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(prefilled));
          localStorage.setItem(STEP_KEY, "0");
          localStorage.removeItem(`${STEP_KEY}_completed`);
          setSeeded(true);
        }
      } catch (err: any) {
        console.error("[StartupProfilePage] Error loading profile:", err);
        toast({
          title: "Error",
          description: err?.message || "Failed to load your profile.",
          variant: "destructive",
        });
        setSeeded(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, [toast, baseUrl]);

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
        if (countWords(data.companyOverview) < 30) errors.push("Company overview needs at least 30 words");
        break;
    }
    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async (data: StartupOnboardingData) => {
    try {
      const { getAuth } = await import("firebase/auth");
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      if (!baseUrl) throw new Error("API base URL is not configured.");

      const token = await user.getIdToken();

      // Upload new files (if any) first, optionally deleting old ones.
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

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // 1) PATCH lean profile (identifier fields only)
      const profilePayload = {
        companyName: data.companyName,
        vertical: data.vertical,
        stage: data.stage,
        location: data.location,
        website: data.website,
        linkedIn: data.linkedIn,
      };

      let profileRes = await fetch(`${baseUrl}/startups/me`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(profilePayload),
      });
      if (profileRes.status === 404) {
        profileRes = await fetch(`${baseUrl}/startups/me`, {
          method: "POST",
          headers,
          body: JSON.stringify(profilePayload),
        });
      }
      if (!profileRes.ok) {
        const errText = await profileRes.text();
        throw new Error(errText || "Failed to save profile.");
      }

      // 2) PATCH memo (only fields we edit: identifiers, overview, team, logo, pitch deck)
      const logoUrl = startupLogoUrl ?? (typeof data.startupLogoUrl === "string" ? data.startupLogoUrl : undefined);
      const memoPayload: Record<string, unknown> = {
        company_name: data.companyName,
        vertical: data.vertical,
        stage: data.stage,
        location: data.location,
        website: data.website,
        linkedIn: data.linkedIn ?? "",
        business_model: data.companyOverview,
      };
      if (logoUrl) memoPayload.logo_url = logoUrl;
      if (pitchdeckUrl) memoPayload.pitchdeck_url = pitchdeckUrl;
      if (pitchdeckName) memoPayload.pitchdeck_name = pitchdeckName;

      let memoRes = await fetch(`${baseUrl}/startups/me/memo`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(memoPayload),
      });
      if (memoRes.status === 404) {
        memoRes = await fetch(`${baseUrl}/startups/me/memo`, {
          method: "POST",
          headers,
          body: JSON.stringify(memoPayload),
        });
      }
      if (!memoRes.ok) {
        const errText = await memoRes.text();
        throw new Error(errText || "Failed to save memo.");
      }

      isDirtyRef.current = false;
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STEP_KEY);
      localStorage.removeItem(`${STEP_KEY}_completed`);

      toast({ title: "Profile saved!", description: "Your startup profile has been updated." });
    } catch (err: any) {
      console.error("[StartupProfilePage] Error saving profile:", err);
      toast({
        title: "Error",
        description: err?.message || "Failed to save profile.",
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
    onSubmit: () => void
  ) => {
    const handleUpdate = (partial: Partial<StartupOnboardingData>) => {
      isDirtyRef.current = true;
      onUpdate(partial);
    };

    switch (step) {
      case 0:
        return (
          <CompanyInfoStep
            data={data}
            onUpdate={handleUpdate}
            onLogoUpload={async (file: File) => {
              const { getAuth } = await import("firebase/auth");
              const user = getAuth().currentUser;
              if (!user) throw new Error("Not authenticated");
              const oldUrl = typeof data.startupLogoUrl === "string" ? data.startupLogoUrl : "";
              if (oldUrl) await deleteFile(oldUrl).catch(() => {});
              return uploadFile(file, "startup_logo", user.uid);
            }}
            onNext={onSubmit}
            onBack={onBack}
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
      title="Edit Profile"
      description="Update your startup profile information."
      steps={[...EDIT_PROFILE_STEPS]}
      storageKey={STORAGE_KEY}
      stepKey={STEP_KEY}
      defaultData={defaultData}
      renderStep={renderStep}
      validateStep={validateStep}
      onSubmit={handleSubmit}
      onComplete={() => navigate("/startup-dashboard")}
      requiredSteps={[0]}
      submitLabel="Save"
      loadingText="Saving profile..."
      successTitle="Profile saved!"
      successDescription="Your startup profile has been updated."
    />
  );
}

export default StartupProfilePage;
