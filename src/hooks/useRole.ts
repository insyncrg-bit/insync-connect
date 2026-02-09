import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { sessionManager } from "@/lib/session";
import { useAuthReady } from "./useAuthReady";

type AllowedRole = "startup" | "vc" | "analyst" | "superuser";

interface UseRoleReturn {
  role: AllowedRole | null;
  userEmail: string;
  userId: string | null;
  loading: boolean;
}

export function useRole(): UseRoleReturn {
  const ready = useAuthReady();
  const [role, setRole] = useState<AllowedRole | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRoleFromFirebase = useCallback(async (user: typeof auth.currentUser): Promise<void> => {
    if (!user) {
      setRole(null);
      setUserEmail("");
      setUserId(null);
      sessionManager.clear();
      setLoading(false);
      return;
    }

    try {
      const { claims } = await user.getIdTokenResult();
      const userRole = (claims.role as AllowedRole) || null;
      
      setRole(userRole);
      setUserEmail(user.email || "");
      setUserId(user.uid);

      sessionManager.save({
        email: user.email || "",
        userId: user.uid,
        role: userRole || undefined,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching role from Firebase:", error);
      setRole(null);
      setUserEmail("");
      setUserId(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;

    const user = auth.currentUser;
    if (user) {
      fetchRoleFromFirebase(user);
    } else {
      setRole(null);
      setUserEmail("");
      setUserId(null);
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchRoleFromFirebase(firebaseUser);
      } else {
        setRole(null);
        setUserEmail("");
        setUserId(null);
        sessionManager.clear();
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [ready, fetchRoleFromFirebase]);

  return {
    role,
    userEmail,
    userId,
    loading,
  };
}
