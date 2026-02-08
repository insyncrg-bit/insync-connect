// Session management for user authentication and onboarding state

export interface UserSession {
  email: string;
  userId?: string;
  role?: "startup" | "vc" | "analyst" | "superuser";
  onboardingType?: "startup" | "vc_admin" | "vc_analyst";
  onboardingComplete?: boolean;
  onboardingData?: {
    currentStep?: number;
    completedSteps?: number[];
    fields?: Record<string, any>; // Store individual field values
    [key: string]: any;
  };
}

const SESSION_KEY = "insync_user_session";
const AUTH_EXPIRY_KEY = "insync_auth_expiry";
/** Token is held in memory only; expiry is in localStorage for persistence across reloads */
const SESSION_TIMEOUT_MS = 55 * 60 * 1000; // 55 minutes (refresh before 1h)
const REFRESH_BUFFER_MS = 5 * 60 * 1000; // Consider refresh when within 5 min of expiry

export { SESSION_TIMEOUT_MS };

export const sessionManager = {
  // Auth token expiry (token itself is not stored in localStorage for security)
  setAuthToken: (_token: string, expiryMs: number) => {
    try {
      localStorage.setItem(AUTH_EXPIRY_KEY, String(expiryMs));
    } catch (e) {
      console.error("Error saving auth expiry:", e);
    }
  },

  isSessionValid: (): boolean => {
    try {
      const expiry = localStorage.getItem(AUTH_EXPIRY_KEY);
      if (!expiry) return false;
      const expiryMs = parseInt(expiry, 10);
      if (Number.isNaN(expiryMs)) return false;
      return Date.now() < expiryMs;
    } catch {
      return false;
    }
  },

  shouldRefreshToken: (): boolean => {
    try {
      const expiry = localStorage.getItem(AUTH_EXPIRY_KEY);
      if (!expiry) return false;
      const expiryMs = parseInt(expiry, 10);
      if (Number.isNaN(expiryMs)) return false;
      return Date.now() >= expiryMs - REFRESH_BUFFER_MS;
    } catch {
      return false;
    }
  },

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

  // Clear session (including auth expiry)
  clear: () => {
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(AUTH_EXPIRY_KEY);
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
