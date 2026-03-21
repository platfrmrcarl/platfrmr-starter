import { headers } from "next/headers";

import { getAdminAuth } from "@/lib/firebase/admin";

export async function getUidFromAuthorizationHeader() {
  const headerStore = await headers();
  const authHeader = headerStore.get("authorization") ?? "";

  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    throw new Error("Unauthorized");
  }

  const decoded = await getAdminAuth().verifyIdToken(token);
  return decoded.uid;
}
