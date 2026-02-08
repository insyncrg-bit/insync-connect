import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Firebase configuration
// Get from environment variables - these should be set in .env file
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "insync-backend-bd86e.firebaseapp.com";
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || "insync-backend-bd86e";
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "insync-backend-bd86e.appspot.com";
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

// Validate required Firebase config
if (!apiKey || apiKey === "placeholder") {
  console.error(
    "⚠️ Firebase API Key is missing or invalid.\n" +
    "Please set VITE_FIREBASE_API_KEY in your .env file.\n" +
    "You can find your Web App config in Firebase Console > Project Settings > General > Your apps > Web app"
  );
}

if (!messagingSenderId || messagingSenderId === "placeholder") {
  console.warn(
    "⚠️ Firebase Messaging Sender ID is missing.\n" +
    "Please set VITE_FIREBASE_MESSAGING_SENDER_ID in your .env file."
  );
}

if (!appId || appId === "placeholder") {
  console.warn(
    "⚠️ Firebase App ID is missing.\n" +
    "Please set VITE_FIREBASE_APP_ID in your .env file."
  );
}

const firebaseConfig = {
  apiKey: apiKey || "placeholder",
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId || "placeholder",
  appId: appId || "placeholder",
};

// Initialize Firebase (only if not already initialized)
let app: FirebaseApp;
if (getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    throw new Error(
      "Firebase initialization failed. Please check your .env file and ensure all Firebase configuration values are set correctly."
    );
  }
} else {
  app = getApps()[0];
}

// Initialize Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;
