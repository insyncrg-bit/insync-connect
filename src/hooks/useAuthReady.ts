import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { sessionManager, SESSION_TIMEOUT_MS } from "@/lib/session";

/**
 * Waits for Firebase auth to be ready, then restores session from Firebase if we have
 * a user but no valid localStorage expiry (e.g. page refresh). Returns ready so
 * callers can avoid acting before auth state is known.
 */
export function useAuthReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !sessionManager.isSessionValid()) {
        try {
          const token = await user.getIdToken(true);
          sessionManager.setAuthToken(token, Date.now() + SESSION_TIMEOUT_MS);
          const session = sessionManager.get();
          if (!session?.email) {
            sessionManager.save({ email: user.email ?? "", userId: user.uid });
          }
        } catch {
          // leave session invalid
        }
      }
      setReady(true);
    });
    return () => unsubscribe();
  }, []);

  return ready;
}
