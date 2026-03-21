import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

function hasServiceAccountEnv() {
  const hasProjectId = Boolean(process.env.FIREBASE_PROJECT_ID);
  const hasClientEmail = Boolean(process.env.FIREBASE_CLIENT_EMAIL);
  const hasPrivateKey = Boolean(privateKey);
  
  if (!hasProjectId || !hasClientEmail || !hasPrivateKey) {
    console.warn("Firebase service account env check:", {
      projectId: hasProjectId ? "✓" : "✗",
      clientEmail: hasClientEmail ? "✓" : "✗",
      privateKey: hasPrivateKey ? `✓ (${privateKey?.length} chars)` : "✗",
    });
  }
  
  return hasProjectId && hasClientEmail && hasPrivateKey;
}

function getAdminApp() {
  const existing = getApps()[0];

  if (existing) {
    return existing;
  }

  if (hasServiceAccountEnv()) {
    try {
      return initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });
    } catch (error) {
      console.error("Failed to initialize Firebase Admin with cert:", {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKeyLength: privateKey?.length,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  // If no service account env vars, try to use GOOGLE_APPLICATION_CREDENTIALS
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp();
  }

  throw new Error(
    "Firebase Admin SDK is not properly configured. Please add the following environment variables to .env.local:\n" +
    "1. FIREBASE_PROJECT_ID - Your Firebase project ID (should be 'startup-511e3')\n" +
    "2. FIREBASE_CLIENT_EMAIL - Service account client email\n" +
    "3. FIREBASE_PRIVATE_KEY - Service account private key (with literal \\n for newlines)\n\n" +
    "To get these:\n" +
    "1. Go to Firebase Console > Project Settings > Service Accounts\n" +
    "2. Click 'Generate New Private Key'\n" +
    "3. Copy the values from the downloaded JSON file"
  );
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}
