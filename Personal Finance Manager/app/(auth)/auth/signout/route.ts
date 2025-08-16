import { getServerSupabase } from "@/utils/supabase/server"

export async function POST() {
  const supabase = await getServerSupabase()
  await supabase.auth.signOut()
  return new Response(null, { status: 204 })
}
