"use server";
import { redirect } from "next/navigation";
import { setDemoSession, clearDemoSession, getDemoSession } from "./cookies";

export async function demoSignIn(prevState: any, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  
  // For testing: accept any email, no password validation
  if (!email) {
    return { ok: false, message: "Email is required." };
  }
  
  await setDemoSession({ email, issuedAt: Date.now() });
  redirect("/dashboard");
}

export async function demoSignUp(prevState: any, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const name = String(formData.get("name") ?? "");
  
  // For testing: accept any email and name, no password validation
  if (!email) {
    return { ok: false, message: "Email is required." };
  }
  
  await setDemoSession({ email, issuedAt: Date.now() });
  redirect("/dashboard");
}

export async function demoSignOut() {
  await clearDemoSession();
  redirect("/");
}

export async function getCurrentUserEmail(): Promise<string | null> {
  const sess = await getDemoSession();
  return sess?.email ?? null;
}
