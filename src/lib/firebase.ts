/**
 * Firebase Configuration - Auth Only
 * 
 * Minimal setup for Firebase Authentication.
 * Add more services (Firestore, Storage, etc.) as needed.
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export only Auth (keeping it lightweight)
export const auth = getAuth(app);
