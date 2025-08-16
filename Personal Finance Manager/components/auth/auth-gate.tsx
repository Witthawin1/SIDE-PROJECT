"use client"

import { useEffect, useState } from "react"
import { getBrowserSupabase } from "@/utils/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { LogIn } from 'lucide-react'

type AuthGateProps = {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function AuthGate({
  children,
  title = "คุณยังไม่ได้เข้าสู่ระบบ",
  description = "โปรดเข้าสู่ระบบเพื่อใช้งานฟีเจอร์ในหน้านี้",
}: AuthGateProps) {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    let unsub: (() => void) | undefined

    ;(async () => {
      // 1) Try server session (cookie-based) first
      try {
        const res = await fetch("/api/me", { credentials: "include" })
        if (res.ok) {
          const j = await res.json()
          if (j?.authenticated) {
            setAuthed(true)
          } else {
            setAuthed(false)
          }
        } else if (res.status === 401) {
          setAuthed(false)
        }
      } catch {
        // ignore network error and fallback to client session check
      }

      // 2) Fallback to client session (localStorage) if not yet confirmed
      if (authed === null || authed === false) {
        const supabase = getBrowserSupabase()
        const { data } = await supabase.auth.getUser()
        if (data?.user) setAuthed(true)

        // 3) Keep in sync with client auth changes
        const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
          setAuthed(!!session?.user)
        })
        unsub = () => sub.subscription.unsubscribe()
      }
    })()

    return () => {
      if (unsub) unsub()
    }
  }, []) // run once on mount

  if (authed === null) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-6 w-40 animate-pulse rounded bg-muted mb-4" />
          <div className="h-4 w-full animate-pulse rounded bg-muted mb-2" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    )
  }

  if (!authed) {
    return (
      <EmptyState
        icon={LogIn}
        title={title}
        description={description}
        action={{ href: "/login", label: "ไปที่หน้าล็อกอิน" }}
      />
    )
  }

  return <>{children}</>
}
