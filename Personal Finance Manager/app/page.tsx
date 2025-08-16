import { getServerSupabase } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function HomePage() {
  try {
    const supabase = await getServerSupabase()
    const { data } = await supabase.auth.getUser()
    if (data.user) redirect("/dashboard")
  } catch {
  }
  redirect("/login")
}
