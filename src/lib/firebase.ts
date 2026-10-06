import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.trim().length > 0 &&
  firebaseConfig.apiKey !== "your_firebase_api_key_here" &&
  !firebaseConfig.apiKey.includes("<")
);

// Initialize Firebase App safely for Next.js App Router (client and server boundaries)
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: "select_account",
    });
  } catch (err) {
    console.warn("Firebase initialization notice:", err);
  }
}

export { app, auth, googleProvider };

// Client-side Analytics Initializer (safe for SSR)
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && app && isFirebaseConfigured) {
    try {
      const { getAnalytics, isSupported } = await import("firebase/analytics");
      const supported = await isSupported();
      if (supported) {
        return getAnalytics(app);
      }
    } catch (e) {
      console.warn("Firebase analytics not supported in this environment:", e);
    }
  }
  return null;
};

// Helpful mapping for friendly error messages from Firebase error codes
export function getFirebaseErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Invalid email address format.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact platform support.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again or reset your password.";
    case "auth/invalid-credential":
      return "Invalid email or password. Please check your credentials.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in instead.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Google sign-in popup was closed before completing.";
    case "auth/popup-blocked":
      return "Popup was blocked by your browser. Please allow popups for this site.";
    case "auth/cancelled-popup-request":
      return "Sign-in popup request was cancelled.";
    case "auth/operation-not-allowed":
      return "This authentication provider is not enabled in Firebase Console.";
    case "auth/network-request-failed":
      return "Network connection issue. Please check your internet connection.";
    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Access is temporarily disabled. Try again later.";
    default:
      return errorCode?.replace("auth/", "").replace(/-/g, " ") || "Authentication error occurred.";
  }
}
