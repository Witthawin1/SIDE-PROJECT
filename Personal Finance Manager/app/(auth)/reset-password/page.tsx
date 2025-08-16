"use client"

import { useActionState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updatePassword } from "./server-actions"

export default function ResetPasswordPage() {
  const [state, action, pending] = useActionState(updatePassword, null)
  return (
    <div className="mx-auto max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>ตั้งรหัสผ่านใหม่</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่านใหม่</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
            {state?.success && <p className="text-sm text-green-600">{state.success}</p>}
            <Button type="submit" disabled={pending} className="w-full">อัปเดตรหัสผ่าน</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
