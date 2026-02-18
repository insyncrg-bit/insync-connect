import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { sessionManager } from "@/lib/session";
import { useAuthReady } from "./useAuthReady";

export type UserType = "vc-user" | "founder-user" | "superuser" | null;
export type RequestStatus = "sent" | "accepted" | "rejected" | null;

interface UseUserClaimsReturn {
    userType: UserType;
    isAdmin: boolean;
    requestStatus: RequestStatus;
    userEmail: string;
    userId: string | null;
    loading: boolean;
}

export function useUserClaims(): UseUserClaimsReturn {
    const ready = useAuthReady();
    const [userType, setUserType] = useState<UserType>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);

    const [userEmail, setUserEmail] = useState<string>("");
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchClaimsFromFirebase = useCallback(async (user: typeof auth.currentUser): Promise<void> => {
        if (!user) {
            setUserType(null);
            setIsAdmin(false);
            setRequestStatus(null);
            setUserEmail("");
            setUserId(null);
            sessionManager.clear();
            setLoading(false);
            return;
        }

        try {
            const { claims } = await user.getIdTokenResult(true); // Force refresh to get latest claims

            const type = (claims.user_type as UserType) || null;
            // Handle legacy 'role' claim for superuser if needed, or if superuser is a user_type
            // If user_type is missing but role is 'superuser', map it?
            // For hard refactor, we assume user_type is the source of truth.
            // But let's handle the superuser edge case if the admin tool sets 'role'.
            const legacyRole = claims.role;
            const finalUserType = (legacyRole === 'superuser') ? 'superuser' : type;

            const adminById = claims.is_admin === true;
            const status = (claims.request_status as RequestStatus) || null;

            setUserType(finalUserType);
            setIsAdmin(adminById);
            setRequestStatus(status);

            setUserEmail(user.email || "");
            setUserId(user.uid);

            // We don't necessarily need sessionManager for role anymore if we rely on Firebase auth state
            // But if sessionManager is used elsewhere, we might need to update it.
            // For now, let's keep sessionManager cleared on logout but maybe not strictly rely on it for claims.

            setLoading(false);
        } catch (error) {
            console.error("Error fetching claims from Firebase:", error);
            setUserType(null);
            setIsAdmin(false);
            setRequestStatus(null);
            setUserEmail("");
            setUserId(null);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!ready) return;

        const user = auth.currentUser;
        if (user) {
            fetchClaimsFromFirebase(user);
        } else {
            setLoading(false);
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                await fetchClaimsFromFirebase(firebaseUser);
            } else {
                setUserType(null);
                setIsAdmin(false);
                setRequestStatus(null);
                setUserEmail("");
                setUserId(null);
                sessionManager.clear();
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [ready, fetchClaimsFromFirebase]);

    return {
        userType,
        isAdmin,
        requestStatus,
        userEmail,
        userId,
        loading,
    };
}
