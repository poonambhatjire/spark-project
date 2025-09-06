"use server";
import { cookies } from "next/headers";
import { DEMO_AUTH_COOKIE, DEMO_AUTH_MAX_AGE } from "./constants";

type DemoSession = { email: string; issuedAt: number };

export async function setDemoSession(session: DemoSession) {
  const value = Buffer.from(JSON.stringify(session)).toString("base64");
  (await cookies()).set(DEMO_AUTH_COOKIE, value, {
    path: "/",
    maxAge: DEMO_AUTH_MAX_AGE,
    sameSite: "lax",
  });
}

export async function getDemoSession(): Promise<DemoSession | null> {
  const c = (await cookies()).get(DEMO_AUTH_COOKIE)?.value;
  if (!c) return null;
  try {
    return JSON.parse(Buffer.from(c, "base64").toString());
  } catch {
    return null;
  }
}

export async function clearDemoSession() {
  (await cookies()).delete(DEMO_AUTH_COOKIE);
}
