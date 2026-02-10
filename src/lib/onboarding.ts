import { User } from "firebase/auth";

const FIREBASE_API = import.meta.env.VITE_FIREBASE_API || "";

/**
 * Determines the correct path to redirect a user based on their role and onboarding status.
 * 
 * @param user The Firebase User object
 * @param role The user's role (from custom claims)
 * @returns The absolute path to redirect to
 */
export async function getSmartRedirectPath(user: User, role: string): Promise<string> {
    if (!user || !role) return "/select-role";

    // Default paths
    const defaultPaths: Record<string, string> = {
        superuser: "/admin",
        analyst: "/analyst",
        vc: "/vc-onboarding",
        startup: "/startup-onboarding",
    };

    const defaultPath = defaultPaths[role] || "/select-role";

    // If no API, we can't check smart status, so return default
    if (!FIREBASE_API) {
        console.warn("FIREBASE_API not set, smart routing disabled.");
        return defaultPath;
    }

    try {
        const token = await user.getIdToken();
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        };

        if (role === "vc") {
            // 1. Get VC User details (to find firmId)
            const userRes = await fetch(`${FIREBASE_API}/users/vc-users/${user.uid}`, { headers });

            // If user doc not found (404), they probably haven't finished creating/joining a firm? 
            // Actually SelectRole creates a user doc. So if 404, valid state is obscure.
            // But safe to send to onboarding.
            if (!userRes.ok) return "/vc-onboarding";

            const userData = await userRes.json();
            const firmId = userData.user?.firmId;

            if (!firmId) return "/vc-onboarding";

            // 2. Get Firm details (to check onboarding status)
            const firmRes = await fetch(`${FIREBASE_API}/firms/${firmId}`, { headers });
            if (!firmRes.ok) return "/vc-onboarding";

            const firmData = await firmRes.json();
            const onboardingComplete = firmData.firm?.onboardingComplete;

            return onboardingComplete ? "/vc-admin" : "/vc-onboarding";
        }

        if (role === "startup") {
            // 1. Get Founder User details
            const userRes = await fetch(`${FIREBASE_API}/users/founder-users/${user.uid}`, { headers });

            // If no user doc, they definitely haven't onboarded
            if (!userRes.ok) return "/startup-onboarding";

            const userData = await userRes.json();

            // Check if they have marked onboarding as complete
            // (Assuming we save this flag on the user or a related company doc)
            if (userData.user?.onboardingComplete) {
                return "/startup";
            }
            return "/startup-onboarding";
        }

    } catch (error) {
        console.error("Smart routing check failed:", error);
        // On error, fall back to safe default (usually onboarding)
    }

    return defaultPath;
}
