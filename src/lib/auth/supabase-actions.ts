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
    options: {
      emailRedirectTo: undefined, // Disable email confirmation
    }
  });

  if (error) {
    return { 
      ok: false, 
      message: error.message 
    };
  }

  return { 
    ok: true, 
    message: "Account created successfully! You can now sign in." 
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

export async function resetPassword(prevState: unknown, formData: FormData) {
  if (!formData || typeof formData.get !== 'function') {
    return { 
      ok: false, 
      message: "Form data is missing or invalid." 
    };
  }
  
  const email = String(formData.get("email") ?? "");
  
  if (!email) {
    return { 
      ok: false, 
      message: "Email is required." 
    };
  }

  const supabase = await createClient();
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
  });

  if (error) {
    return { 
      ok: false, 
      message: error.message 
    };
  }

  return { 
    ok: true, 
    message: "Password reset email sent. Please check your inbox." 
  };
}

export async function updatePassword(prevState: unknown, formData: FormData) {
  if (!formData || typeof formData.get !== 'function') {
    return { 
      ok: false, 
      message: "Form data is missing or invalid." 
    };
  }
  
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  
  if (!password || !confirmPassword) {
    return { 
      ok: false, 
      message: "Password and confirmation are required." 
    };
  }

  if (password !== confirmPassword) {
    return { 
      ok: false, 
      message: "Passwords do not match." 
    };
  }

  if (password.length < 6) {
    return { 
      ok: false, 
      message: "Password must be at least 6 characters long." 
    };
  }

  const supabase = await createClient();
  
  const { error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) {
    return { 
      ok: false, 
      message: error.message 
    };
  }

  return { 
    ok: true, 
    message: "Password updated successfully. Redirecting to dashboard..." 
  };
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
