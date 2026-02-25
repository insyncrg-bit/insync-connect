import type { VCOnboardingData } from "@/pages/vc/vc-onboarding/hooks/vcMemoTypes";

/**
 * Extracts the memo-only fields from VCOnboardingData by stripping personal profile fields.
 * Used by both onboarding and edit flows to prepare the payload for POST/PATCH /api/firms/:firmId/memo.
 */
export function extractVCMemoPayload(data: VCOnboardingData): Omit<VCOnboardingData, "fullName" | "email" | "linkedIn" | "title" | "profileImage" | "profileImagePreview" | "investingSectors" | "funFact"> {
    const {
        fullName,
        email,
        linkedIn,
        title,
        profileImage,
        profileImagePreview,
        investingSectors,
        funFact,
        ...memoData
    } = data;
    return memoData;
}

/**
 * Extracts the personal profile fields from VCOnboardingData.
 * Used to PATCH /api/users/vc-users/:uid during onboarding.
 */
export function extractVCProfilePayload(data: VCOnboardingData) {
    return {
        profileImage: data.profileImage,
        investingSectors: data.investingSectors,
        funFact: data.funFact,
    };
}
