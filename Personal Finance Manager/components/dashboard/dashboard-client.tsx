"use client"

import { useEffect, useMemo, useState } from "react"
import { getBrowserSupabase } from "@/utils/supabase/client"
import type { Database } from "@/utils/supabase/client"
import Overview from "@/components/overview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus } from 'lucide-react'

type Tx = Database["public"]["Tables"]["transactions"]["Row"]
type Acc = Database["public"]["Tables"]["accounts"]["Row"]
type Cat = Database["public"]["Tables"]["categories"]["Row"]

export default function DashboardClient() {
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{ txs: Tx[]; accounts: Acc[]; cats: Cat[] }>({
    txs: [],
    accounts: [],
    cats: [],
  })

  useEffect(() => {
    ;(async () => {
      try {
        const supabase = getBrowserSupabase()
        const { data: auth } = await supabase.auth.getUser()
        const user = auth.user
        if (!user) {
          setEmail(null)
          setLoading(false)
          return
        }
        setEmail(user.email ?? null)

        const [txs, accounts, cats] = await Promise.all([
          supabase.from("transactions").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(2000),
          supabase.from("accounts").select("*").eq("user_id", user.id),
          supabase.from("categories").select("*").eq("user_id", user.id),
        ])

        if (txs.error) throw txs.error
        if (accounts.error) throw accounts.error
        if (cats.error) throw cats.error

        setData({
          txs: txs.data ?? [],
          accounts: accounts.data ?? [],
          cats: cats.data ?? [],
        })
      } catch (e: any) {
        setError(e.message ?? "Failed to load data")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const stats = useMemo(() => {
    const totalBalance = (data.accounts ?? []).reduce((sum, a) => sum + (a.balance ?? 0), 0)
    const thisMonth = new Date().toISOString().slice(0, 7)
    let income = 0
    let expense = 0
    for (const t of data.txs ?? []) {
      if (!t.date.startsWith(thisMonth)) continue
      if (t.amount >= 0) income += t.amount
      else expense += Math.abs(t.amount)
    }
    return { totalBalance, income, expense }
  }, [data])

  if (loading) {
    return <div className="p-4 text-sm text-muted-foreground">{'กำลังโหลดแดชบอร์ด...'}</div>
  }

  if (!email) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>โปรดเข้าสู่ระบบเพื่อดูภาพรวมการเงินของคุณ</p>
          <Button asChild><a href="/login">ไปที่หน้าล็อกอิน</a></Button>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="ยอดคงเหลือรวม" value={stats.totalBalance} tone="default" />
        <StatCard label="รายรับเดือนนี้" value={stats.income} tone="positive" />
        <StatCard label="รายจ่ายเดือนนี้" value={stats.expense} tone="negative" />
      </div>

      <div className="flex items-center justify-end">
        <Button asChild className="group">
          <a href="/transactions">
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มรายการ
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </Button>
      </div>

      <Overview transactions={data.txs} accounts={data.accounts} categories={data.cats} />
    </div>
  )
}

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string
  value: number
  tone?: "default" | "positive" | "negative"
}) {
  const color =
    tone === "positive" ? "text-green-600" : tone === "negative" ? "text-red-600" : "text-foreground"
  const bg =
    tone === "positive" ? "from-emerald-50 to-background" : tone === "negative" ? "from-rose-50 to-background" : "from-muted/40 to-background"

  return (
    <Card className={`bg-gradient-to-b ${bg}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-semibold tabular-nums ${color}`}>
          {value.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  )
}
