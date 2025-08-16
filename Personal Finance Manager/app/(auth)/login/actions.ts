"use server"

import { getServerSupabase } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function login(_: unknown, formData: FormData) {
  const supabase = await getServerSupabase()
  const email = String(formData.get("email") || "")
  const password = String(formData.get("password") || "")
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { error: error.message }
  }
  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signup(_: unknown, formData: FormData) {
  const supabase = await getServerSupabase()
  const email = String(formData.get("email") || "")
  const password = String(formData.get("password") || "")
  const fullName = String(formData.get("fullName") || "")
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback`,
    },
  })
  if (error) {
    return { error: error.message }
  }
  // Create profile row (RLS will allow insert for authenticated)
  if (data.user) {
    await supabase.from("profiles").upsert({ id: data.user.id, email: data.user.email, full_name: fullName })
  }
  return { success: "Check your email to confirm your account." }
}

export async function sendReset(_: unknown, formData: FormData) {
  const supabase = await getServerSupabase()
  const email = String(formData.get("email") || "")
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password`,
  })
  if (error) return { error: error.message }
  return { success: "Password reset email sent." }
}
