import { auth } from "@/lib/firebase/client";

async function authorizedPost(path: string, body?: Record<string, string>) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const token = await user.getIdToken();

  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body ?? {}),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error ?? "Request failed.");
  }

  return (await response.json()) as { url: string };
}

export async function createCheckoutSession(priceId?: string) {
  return authorizedPost(
    "/api/stripe/checkout",
    priceId ? { priceId } : undefined,
  );
}

export async function createBillingPortalSession() {
  return authorizedPost("/api/stripe/portal");
}
