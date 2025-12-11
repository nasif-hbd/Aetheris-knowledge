import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Access environment variables safely
// We cast to any to avoid TS errors, and use a fallback object if env is undefined
const meta = import.meta as any;
const env = (meta && meta.env) ? meta.env : {};

// Your web app's Firebase configuration
// For GitHub Pages/Vite, these should be in a .env file (VITE_FIREBASE_API_KEY=...)
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const isFirebaseConfigured = () => {
    return env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_API_KEY !== "YOUR_API_KEY_HERE";
};