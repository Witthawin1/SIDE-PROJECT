import { cookies, headers } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "./client"
import { getSupabaseEnv } from "./env"

export async function getServerSupabase() {
  const { url, anon } = getSupabaseEnv()

  if (!url || !anon) {
    throw new Error(
      "Missing Supabase envs. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    )
  }

  const cookieStore = await cookies()
  const h = await headers()

  const supabase = createClient<Database>(url, anon, {
    auth: {
      persistSession: false,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      flowType: "pkce",
    },
    global: {
      headers: {
        "X-Forwarded-For": h.get("x-forwarded-for") ?? "",
        "X-Client-Info": "pfm-next-app",
      },
    },
  })

  return supabase
}