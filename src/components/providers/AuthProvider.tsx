"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import { auth, googleProvider, getFirebaseErrorMessage, initAnalytics } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (role?: "client" | "freelancer") => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; role: "client" | "freelancer" }) => Promise<{ success: boolean; error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize analytics on mount
  useEffect(() => {
    initAnalytics().catch(() => {});
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setUser(json.data);
          return;
        }
      }
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen to Firebase auth state changes safely
  useEffect(() => {
    if (!auth) {
      refreshUser();
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // If we don't have our TaskFlow user session synced yet, verify / sync
        try {
          const res = await fetch("/api/auth/me");
          if (!res.ok) {
            // Sync with backend
            const syncRes = await fetch("/api/auth/firebase", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                uid: fbUser.uid,
                email: fbUser.email,
                name: fbUser.displayName || undefined,
                avatar: fbUser.photoURL || undefined,
              }),
            });
            if (syncRes.ok) {
              const syncData = await syncRes.json();
              if (syncData.success && syncData.data) {
                setUser(syncData.data);
              }
            }
          } else {
            const data = await res.json();
            if (data.success && data.data) {
              setUser(data.data);
            }
          }
        } catch {
          // fallback
        }
      } else {
        // If Firebase user is null, check the backend session
        refreshUser();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [refreshUser]);

  // Sync Firebase User with Taskflow Backend
  const syncFirebaseUser = async (
    fbUser: FirebaseUser,
    role?: "client" | "freelancer",
    customName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = await fbUser.getIdToken();
      const res = await fetch("/api/auth/firebase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: fbUser.uid,
          email: fbUser.email,
          name: customName || fbUser.displayName || fbUser.email?.split("@")[0] || "TaskFlow User",
          avatar: fbUser.photoURL || undefined,
          role: role || "client",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.data);
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to synchronize profile" };
    } catch (err: any) {
      return { success: false, error: err.message || "Network synchronization error" };
    }
  };

  // Login: Try Firebase Auth if configured, then fallback to TaskFlow database session.
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Try Firebase Authentication if initialized
      if (auth) {
        try {
          const credential = await signInWithEmailAndPassword(auth, email, password);
          if (credential.user) {
            const syncResult = await syncFirebaseUser(credential.user);
            if (syncResult.success) {
              return { success: true };
            }
          }
        } catch (fbErr: any) {
          if (fbErr.code === "auth/wrong-password" || fbErr.code === "auth/invalid-credential") {
            if (!email.endsWith("@taskflow.com")) {
              return { success: false, error: getFirebaseErrorMessage(fbErr.code) };
            }
          }
        }
      }

      // 2. Direct database session login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.data);
        return { success: true };
      }
      return { success: false, error: data.error || "Invalid email or password" };
    } catch (err: any) {
      return { success: false, error: err.message || "Login request failed" };
    }
  };

  // Register with Firebase or direct backend fallback
  const register = async (formData: {
    name: string;
    email: string;
    password: string;
    role: "client" | "freelancer";
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      if (auth) {
        const credential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        if (credential.user && formData.name) {
          try {
            await updateProfile(credential.user, { displayName: formData.name });
          } catch {}
        }
        return await syncFirebaseUser(credential.user, formData.role, formData.name);
      }

      // Fallback direct register via backend
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.data);
        return { success: true };
      }
      return { success: false, error: data.error || "Registration failed" };
    } catch (err: any) {
      return { success: false, error: getFirebaseErrorMessage(err.code || err.message) };
    }
  };

  // Google OAuth Login / Registration with Firebase
  const loginWithGoogle = async (role?: "client" | "freelancer"): Promise<{ success: boolean; error?: string }> => {
    if (!auth || !googleProvider) {
      return { success: false, error: "Firebase Google OAuth is not configured with genuine credentials in .env.local" };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        return await syncFirebaseUser(result.user, role);
      }
      return { success: false, error: "Google authentication failed" };
    } catch (fbErr: any) {
      if (fbErr.code === "auth/popup-closed-by-user") {
        return { success: false, error: "Sign-in cancelled." };
      }
      return { success: false, error: getFirebaseErrorMessage(fbErr.code || fbErr.message) };
    }
  };

  // Send Password Reset Email via Firebase
  const sendPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!auth) {
      return { success: false, error: "Password reset service is not configured." };
    }

    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (fbErr: any) {
      return { success: false, error: getFirebaseErrorMessage(fbErr.code || fbErr.message) };
    }
  };

  // Logout from both Firebase and session cookie
  const logout = async () => {
    try {
      if (auth) {
        await firebaseSignOut(auth).catch(() => {});
      }
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
      setUser(null);
      setFirebaseUser(null);
      window.location.href = "/";
    } catch {
      setUser(null);
      setFirebaseUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        login,
        loginWithGoogle,
        register,
        sendPasswordReset,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
