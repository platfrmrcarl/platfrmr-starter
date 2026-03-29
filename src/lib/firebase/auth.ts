import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut, linkWithPopup } from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const linkGitHubAccount = async () => {
  try {
    if (!auth.currentUser) throw new Error("No user is currently signed in.");
    const result = await linkWithPopup(auth.currentUser, githubProvider);
    return result.user;
  } catch (error: any) {
    console.error("Error linking GitHub account", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
