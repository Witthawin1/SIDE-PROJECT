"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getBrowserSupabase } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import BackupRestore from "../utils/backup-restore"

export default function SettingsClient() {
  const [email, setEmail] = useState<string>("")
  const [mfaEnabled, setMfaEnabled] = useState<boolean | null>(null)
  const [factorId, setFactorId] = useState<string | null>(null)
  const [totpUri, setTotpUri] = useState<string | null>(null)
  const [otp, setOtp] = useState("")
  const [challengeId, setChallengeId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    ;(async () => {
      try {
        const supabase = getBrowserSupabase()
        const { data: auth } = await supabase.auth.getUser()
        setEmail(auth.user?.email ?? "")
        const { data: factors } = await supabase.auth.mfa.listFactors()
        const enrolled = factors?.all?.find((f) => f.status === "verified")
        setMfaEnabled(Boolean(enrolled))
      } catch {
        setMfaEnabled(null)
      }
    })()
  }, [])

  async function startEnroll() {
    try {
      const supabase = getBrowserSupabase()
      const { data, error  } = await supabase.auth.mfa.enroll({ factorType: "totp" })
      if (error) throw error
      setTotpUri(data.totp?.uri ?? null)
      setFactorId(data.id ?? null)
      // setChallengeId(data.challengeId ?? null)
    } catch (e: any) {
      toast({ title: "MFA Error", description: e.message, variant: "destructive" })
    }
  }

  async function verifyEnroll() {
    try {
      const supabase = getBrowserSupabase()
      const { error } = await supabase.auth.mfa.verify({
        factorId: factorId!,
        challengeId: challengeId!,
        code: otp,
      })
      if (error) throw error
      setMfaEnabled(true)
      toast({ title: "เปิด 2FA สำเร็จ" })
    } catch (e: any) {
      toast({ title: "Verify Error", description: e.message, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>บัญชี</CardTitle>
          <CardDescription>อีเมลของคุณ: {email || "-"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">การยืนยันตัวตนสองขั้นตอน (2FA)</h3>
            {mfaEnabled === null && (
              <p className="text-sm text-muted-foreground">ตรวจสอบสถานะ MFA ไม่สำเร็จ โปรดตรวจสอบการตั้งค่าใน Supabase</p>
            )}
            {mfaEnabled === false && (
              <div className="space-y-3">
                {!totpUri ? (
                  <Button onClick={startEnroll}>เริ่มเปิดใช้ TOTP</Button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm">สแกนรหัสในแอป Authenticator แล้วกรอกรหัส 6 หลักด้านล่าง</p>
                    <div className="rounded border p-2 text-xs break-all bg-muted/50">{totpUri}</div>
                    <div className="flex items-end gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="otp">รหัส OTP</Label>
                        <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" />
                      </div>
                      <Button onClick={verifyEnroll}>ยืนยัน</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {mfaEnabled === true && <p className="text-sm text-green-600">เปิดใช้ 2FA แล้ว</p>}
          </div>

          <BackupRestore />
        </CardContent>
      </Card>
    </div>
  )
}