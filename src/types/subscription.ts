export type SubscriptionStatus =
  | "free"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete";

export const PREMIUM_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  "trialing",
  "active",
];
