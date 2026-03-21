import type { SubscriptionStatus } from "@/types/subscription";

export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  provider: string;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
};
