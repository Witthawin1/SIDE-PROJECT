import { NextResponse } from "next/server"
import { getServerSupabase } from "@/utils/supabase/server"

export async function GET() {
  try {
    const supabase = await getServerSupabase()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    return NextResponse.json({
      authenticated: true,
      id: data.user.id,
      email: data.user.email,
    })
  } catch (e: any) {
    return NextResponse.json({ authenticated: false, error: e.message }, { status: 500 })
  }
}