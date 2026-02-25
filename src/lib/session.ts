// Session management for user authentication and onboarding state

export interface UserSession {
  email: string;
  userId?: string;
  role?: "startup" | "vc" | "analyst" | "superuser";
  onboardingType?: "startup" | "vc_admin" | "vc_analyst";
  onboardingComplete?: boolean;
  firmId?: string; // Firestore firm doc ID (VC users only)
  onboardingData?: {
    currentStep?: number;
    completedSteps?: number[];
    fields?: Record<string, any>; // Store individual field values
    [key: string]: any;
  };
}

const SESSION_KEY = "insync_user_session";

export const sessionManager = {
  // Save session data
  save: (session: Partial<UserSession>) => {
    try {
      const existing = sessionManager.get();
      const updated = { ...existing, ...session };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error("Error saving session:", error);
      return null;
    }
  },

  // Get session data
  get: (): UserSession | null => {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      if (!data) return null;
      return JSON.parse(data) as UserSession;
    } catch (error) {
      console.error("Error reading session:", error);
      return null;
    }
  },

  // Clear all app-owned storage (localStorage + sessionStorage).
  // Called on sign-out and forced auth redirects to prevent
  // data from one user leaking into another user's session.
  clear: () => {
    try {
      // ── localStorage: session ──
      localStorage.removeItem(SESSION_KEY);

      // ── localStorage: onboarding drafts ──
      const onboardingKeys = [
        "vc_onboarding_data",
        "vc_onboarding_step",
        "vc_onboarding_step_completed",
        "vc_onboarding_current_step",
        "startup_onboarding_data",
        "startup_onboarding_step",
        "startup_onboarding_step_completed",
      ];

      // ── localStorage: edit-mode drafts ──
      const editKeys = [
        "vc_edit_memo_data",
        "vc_edit_memo_step",
        "vc_edit_memo_step_completed",
        "startup_edit_memo_data",
        "startup_edit_memo_step",
        "startup_edit_memo_step_completed",
        "startup_edit_profile_data",
        "startup_edit_profile_step",
        "startup_edit_profile_step_completed",
      ];

      for (const key of [...onboardingKeys, ...editKeys]) {
        localStorage.removeItem(key);
      }

      // ── sessionStorage: dashboard caches ──
      // These are keyed like "dashboardData_{firmId}" — clear all of sessionStorage
      sessionStorage.clear();
    } catch (error) {
      console.error("Error clearing session:", error);
    }
  },

  // Update onboarding state
  updateOnboarding: (data: Partial<UserSession["onboardingData"]>) => {
    const session = sessionManager.get();
    if (!session) return null;

    return sessionManager.save({
      onboardingData: {
        ...session.onboardingData,
        ...data,
      },
    });
  },

  // Update specific onboarding field
  updateOnboardingField: (field: string, value: any) => {
    const session = sessionManager.get();
    if (!session) return null;

    return sessionManager.save({
      onboardingData: {
        ...session.onboardingData,
        fields: {
          ...session.onboardingData?.fields,
          [field]: value,
        },
      },
    });
  },

  // Mark onboarding as complete
  completeOnboarding: () => {
    const session = sessionManager.get();
    if (!session) return null;

    return sessionManager.save({
      onboardingComplete: true,
    });
  },

  // Check if user needs role selection
  needsRoleSelection: (): boolean => {
    const session = sessionManager.get();
    return !!(session?.email && !session?.role);
  },

  // Check if user needs onboarding
  needsOnboarding: (): boolean => {
    const session = sessionManager.get();
    return !!(session?.role && !session?.onboardingComplete);
  },
};
