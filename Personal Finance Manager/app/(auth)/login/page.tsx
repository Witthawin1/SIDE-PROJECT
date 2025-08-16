"use client"

import { useActionState, useState } from "react"
import { login, signup, sendReset } from "./actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getBrowserSupabase } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const sp = useSearchParams()
  const initialMode = (() => {
    const t = sp.get("tab")
    if (t === "signup") return "signup"
    if (t === "reset") return "reset"
    return "login"
  })()
  const [mode, setMode] = useState<"login" | "signup" | "reset">(initialMode)
  const [stateLogin, loginAction, pendingLogin] = useActionState(login, null)
  const [stateSignup, signupAction, pendingSignup] = useActionState(signup, null)
  const [stateReset, resetAction, pendingReset] = useActionState(sendReset, null)
  const router = useRouter()

  async function clientLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const email = String(data.get("email") || "")
    const password = String(data.get("password") || "")
    const supabase = getBrowserSupabase()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      // Fallback to server action error UI
      alert(error.message)
      return
    }
    router.replace("/dashboard")
  }

  return (
    <div className="mx-auto max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "login" ? "เข้าสู่ระบบ" : mode === "signup" ? "สมัครสมาชิก" : "กู้คืนรหัสผ่าน"}</CardTitle>
          <CardDescription>กรอกอีเมลและรหัสผ่านของคุณเพื่อดำเนินการ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NEXT_PUBLIC_SUPABASE_URL ? null : (
            <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              {'Missing Supabase keys. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your project.'}
            </div>
          )}
          {mode !== "reset" && (
            <>
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">ชื่อ-นามสกุล</Label>
                  <Input id="fullName" name="fullName" placeholder="ชื่อ-นามสกุล" />
                </div>
              )}
              <form onSubmit={clientLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input id="email" name="email" type="email" required placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">รหัสผ่าน</Label>
                  <Input id="password" name="password" type="password" required placeholder="••••••••" />
                </div>
                {mode === "login" && stateLogin?.error && <p className="text-sm text-red-600">{stateLogin.error}</p>}
                {mode === "signup" && stateSignup?.error && <p className="text-sm text-red-600">{stateSignup.error}</p>}
                {mode === "signup" && stateSignup?.success && <p className="text-sm text-green-600">{stateSignup.success}</p>}
                <Button type="submit" className="w-full" disabled={pendingLogin || pendingSignup}>
                  {mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
                </Button>
              </form>
            </>
          )}
          {mode === "reset" && (
            <form action={resetAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">อีเมล</Label>
                <Input id="reset-email" name="email" type="email" required placeholder="you@example.com" />
              </div>
              {stateReset?.error && <p className="text-sm text-red-600">{stateReset.error}</p>}
              {stateReset?.success && <p className="text-sm text-green-600">{stateReset.success}</p>}
              <Button type="submit" className="w-full" disabled={pendingReset}>ส่งลิงก์รีเซ็ตรหัสผ่าน</Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 text-sm">
          {mode !== "login" && (
            <Button variant="link" onClick={() => setMode("login")} className="px-0">มีบัญชีแล้ว? เข้าสู่ระบบ</Button>
          )}
          {mode !== "signup" && (
            <Button variant="link" onClick={() => setMode("signup")} className="px-0">ไม่มีบัญชี? สมัครสมาชิก</Button>
          )}
          {mode !== "reset" && (
            <Button variant="link" onClick={() => setMode("reset")} className="px-0">ลืมรหัสผ่าน?</Button>
          )}
          <Link href="/auth/callback" className="ml-auto underline">Auth Callback</Link>
        </CardFooter>
      </Card>
    </div>
  )
}
