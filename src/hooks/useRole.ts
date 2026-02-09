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

    const session = sessionManager.get();
    const user = auth.currentUser;

    if (user && session?.role && session?.email === user.email) {
      setRole(session.role as AllowedRole);
      setUserEmail(user.email || session.email);
      setUserId(user.uid);
      setLoading(false);
    } else if (user) {
      fetchRoleFromFirebase(user);
    } else {
      setRole(null);
      setUserEmail("");
      setUserId(null);
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const session = sessionManager.get();
        if (session?.role && session?.email === firebaseUser.email) {
          setRole(session.role as AllowedRole);
          setUserEmail(firebaseUser.email || session.email);
          setUserId(firebaseUser.uid);
          setLoading(false);
        } else {
          await fetchRoleFromFirebase(firebaseUser);
        }
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
