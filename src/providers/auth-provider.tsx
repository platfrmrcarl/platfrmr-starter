"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  type User,
  onIdTokenChanged,
} from "firebase/auth";
import {
  doc,
  onSnapshot,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";

import {
  auth,
  db,
  forgotPassword,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  signUpWithEmail,
} from "@/lib/firebase/client";
import {
  PREMIUM_SUBSCRIPTION_STATUSES,
  type SubscriptionStatus,
} from "@/types/subscription";
import type { UserProfile } from "@/types/user-profile";

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isPremium: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function setTokenCookie(token: string | null) {
  if (!token) {
    document.cookie = "firebaseIdToken=; Max-Age=0; path=/; SameSite=Lax";
    return;
  }

  document.cookie = `firebaseIdToken=${token}; path=/; SameSite=Lax`;
}

function mapProfile(uid: string, data?: DocumentData): UserProfile {
  return {
    uid,
    email: data?.email ?? "",
    displayName: data?.displayName ?? "",
    photoURL: data?.photoURL ?? "",
    provider: data?.provider ?? "password",
    subscriptionStatus: (data?.subscriptionStatus ?? "free") as SubscriptionStatus,
    stripeCustomerId: data?.stripeCustomerId ?? null,
    stripeSubscriptionId: data?.stripeSubscriptionId ?? null,
    stripePriceId: data?.stripePriceId ?? null,
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (nextUser) => {
      if (!nextUser) {
        setTokenCookie(null);
        return;
      }

      const token = await nextUser.getIdToken();
      setTokenCookie(token);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const profileRef = doc(db, "users", user.uid);
    const unsubscribeDoc: Unsubscribe = onSnapshot(
      profileRef,
      (snapshot) => {
        setProfile(mapProfile(user.uid, snapshot.data()));
      },
      (error) => {
        console.error("Failed to subscribe to user profile:", error);

        // Keep app usable if rules block profile reads by falling back to auth data.
        setProfile(
          mapProfile(user.uid, {
            email: user.email ?? "",
            displayName: user.displayName ?? "",
            photoURL: user.photoURL ?? "",
            provider: user.providerData[0]?.providerId ?? "password",
          }),
        );
      },
    );

    return () => {
      unsubscribeDoc();
    };
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isLoading,
      isPremium: PREMIUM_SUBSCRIPTION_STATUSES.includes(
        profile?.subscriptionStatus ?? "free",
      ),
      signUp: async (email, password, displayName) => {
        await signUpWithEmail(email, password, displayName);
      },
      signIn: async (email, password) => {
        await signInWithEmail(email, password);
      },
      signInGoogle: async () => {
        await signInWithGoogle();
      },
      resetPassword: async (email) => {
        await forgotPassword(email);
      },
      logout: async () => {
        await signOutUser();
      },
    }),
    [user, profile, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return value;
}
