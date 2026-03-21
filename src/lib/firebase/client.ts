"use client";

import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import {
  Auth,
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  setPersistence,
  updateProfile,
} from "firebase/auth";
import {
  Firestore,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);


void setPersistence(auth, browserLocalPersistence).catch((error: unknown) => {
  console.warn("Unable to set Firebase auth persistence:", error);
});

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

type EnsureUserProfileInput = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  provider: string;
};

async function ensureUserProfile(input: EnsureUserProfileInput) {
  const userRef = doc(db, "users", input.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid: input.uid,
      email: input.email,
      displayName: input.displayName,
      photoURL: input.photoURL,
      provider: input.provider,
      subscriptionStatus: "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      stripePriceId: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return;
  }

  await setDoc(
    userRef,
    {
      email: input.email,
      displayName: input.displayName,
      photoURL: input.photoURL,
      provider: input.provider,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const trimmedName = displayName.trim();

  if (trimmedName) {
    await updateProfile(credential.user, { displayName: trimmedName });
  }

  await ensureUserProfile({
    uid: credential.user.uid,
    email: credential.user.email ?? email,
    displayName: trimmedName || credential.user.displayName || "",
    photoURL: credential.user.photoURL || "",
    provider: "password",
  });
}

export async function signInWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserProfile({
    uid: credential.user.uid,
    email: credential.user.email ?? email,
    displayName: credential.user.displayName || "",
    photoURL: credential.user.photoURL || "",
    provider: "password",
  });
}

export async function signInWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  await ensureUserProfile({
    uid: credential.user.uid,
    email: credential.user.email ?? "",
    displayName: credential.user.displayName || "",
    photoURL: credential.user.photoURL || "",
    provider: "google",
  });
}

export async function forgotPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function signOutUser() {
  await signOut(auth);
}

export { app, auth, db, googleProvider };
