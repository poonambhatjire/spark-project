"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(prevState: unknown, formData: FormData) {
  if (!formData || typeof formData.get !== 'function') {
    return { 
      ok: false, 
      message: "Form data is missing or invalid." 
    };
  }
  
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  
  if (!email || !password) {
    return { 
      ok: false, 
      message: "Email and password are required." 
    };
  }

  if (password.length < 6) {
    return { 
      ok: false, 
      message: "Password must be at least 6 characters long." 
    };
  }

  const supabase = await createClient();
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { 
      ok: false, 
      message: error.message 
    };
  }

  return { 
    ok: true, 
    message: "Check your email for a verification link." 
  };
}

export async function signIn(prevState: unknown, formData: FormData) {
  if (!formData || typeof formData.get !== 'function') {
    return { 
      ok: false, 
      message: "Form data is missing or invalid." 
    };
  }
  
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  
  if (!email || !password) {
    return { 
      ok: false, 
      message: "Email and password are required." 
    };
  }

  const supabase = await createClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { 
      ok: false, 
      message: error.message 
    };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return { 
      ok: false, 
      message: error.message 
    };
  }

  redirect("/");
}
