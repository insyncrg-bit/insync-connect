import { User } from "firebase/auth";

const FIREBASE_API = import.meta.env.VITE_FIREBASE_API || "";

/**
 * Determines the correct path to redirect a user based on their role and onboarding status.
 * 
 * @param user The Firebase User object
 * @param role The user's role (from custom claims)
 * @returns The absolute path to redirect to
 */
export async function getSmartRedirectPath(user: User, claims: any): Promise<string> {
    const userType = claims?.user_type;
    const requestStatus = claims?.request_status;

    if (!user || !userType) return "/select-role";

    // Default paths based on user_type
    const defaultPaths: Record<string, string> = {
        superuser: "/admin",
        "vc-user": "/vc-onboarding",
        "founder-user": "/startup-onboarding",
    };

    const defaultPath = defaultPaths[userType] || "/select-role";

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

        if (userType === "vc-user") {
            // Check request_status
            if (requestStatus === "sent") {
                return "/request-sent";
            }
            if (requestStatus === "rejected") {
                return "/request-rejected";
            }
            if (requestStatus === "accepted") {
                // If accepted, check if they finished onboarding (via firm data)
                // 1. Get VC User details (to find firmId)
                const userRes = await fetch(`${FIREBASE_API}/users/vc-users/${user.uid}`, { headers });
                if (!userRes.ok) return "/vc-onboarding";

                const userData = await userRes.json();
                const firmId = userData.user?.firmId;

                if (!firmId) return "/vc-onboarding";

                // 2. Get Firm details (to check onboarding status)
                const firmRes = await fetch(`${FIREBASE_API}/firms/${firmId}`, { headers });
                if (!firmRes.ok) return "/vc-onboarding";

                const firmData = await firmRes.json();
                const firmOnboardingComplete = firmData.firm?.onboardingComplete;

                if (firmOnboardingComplete) {
                    // Auto-sync user status if firm is already done
                    if (!userData.user?.onboardingComplete) {
                        try {
                            await fetch(`${FIREBASE_API}/api/users/vc-users/${user.uid}`, {
                                method: "PATCH",
                                headers,
                                body: JSON.stringify({ onboardingComplete: true })
                            });
                            // Force token refresh to pick up new claims
                            await user.getIdToken(true);
                        } catch (e) {
                            console.error("Auto-sync onboarding failed:", e);
                        }
                    }
                    return "/vc-dashboard";
                }

                return "/vc-onboarding";
            }

            // If request_status is null, they haven't joined/created a firm yet
            return "/select-role";
        }

        if (userType === "founder-user") {
            // 1. Get Founder User details
            const userRes = await fetch(`${FIREBASE_API}/users/founder-users/${user.uid}`, { headers });

            // If no user doc, they definitely haven't onboarded
            if (!userRes.ok) return "/startup-onboarding";

            const userData = await userRes.json();
            const startupId = userData.user?.startupId;

            if (!startupId) return "/startup-onboarding";

            // 2. Get Startup details
            const startupRes = await fetch(`${FIREBASE_API}/startups/${startupId}`, { headers });

            if (!startupRes.ok) return "/startup-onboarding";

            const startupData = await startupRes.json();
            const onboardingComplete = startupData.startup?.onboardingComplete;

            // Check if they have marked onboarding as complete
            if (onboardingComplete) {
                // Startup dashboard is currently a "coming soon" placeholder
                return "/startup-dashboard";
            }
            return "/startup-onboarding";
        }

    } catch (error) {
        console.error("Smart routing check failed:", error);
        // On error, fall back to safe default (usually onboarding)
    }

    return defaultPath;
}
