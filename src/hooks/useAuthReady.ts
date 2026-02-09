import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { sessionManager } from "@/lib/session";

/**
 * Waits for Firebase auth to be ready and syncs session data from Firebase user.
 * Firebase SDK handles token refresh automatically via onAuthStateChanged.
 * Returns ready state so callers can avoid acting before auth state is known.
 */
export function useAuthReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Sync session data if we have a Firebase user
        const session = sessionManager.get();
        if (!session?.email) {
          sessionManager.save({ email: user.email ?? "", userId: user.uid });
        }
      }
      setReady(true);
    });
    return () => unsubscribe();
  }, []);

  return ready;
}
