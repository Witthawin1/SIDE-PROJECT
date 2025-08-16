"use server"

import { getServerSupabase } from "@/utils/supabase/server"

export async function updatePassword(_: unknown, formData: FormData) {
  const supabase = getServerSupabase()
  const password = String(formData.get("password") || "")
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }
  return { success: "ตั้งรหัสผ่านสำเร็จ คุณสามารถเข้าสู่ระบบได้แล้ว" }
}
