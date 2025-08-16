"use client"

import type { Database } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, Area, AreaChart, XAxis, YAxis, PieChart, Pie, Cell, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { EmptyState } from "@/components/ui/empty-state"
import { BarChart2 } from "lucide-react"

type Tx = Database["public"]["Tables"]["transactions"]["Row"]

const fmt = (n: number) => new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(Number(n || 0))

export default function ReportsClient({ transactions }: { transactions?: Tx[] }) {
  const [txs, setTxs] = useState<Tx[]>(transactions ?? [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (transactions?.length) return
    ;(async () => {
      setLoading(true)
      try {
        const supabase = (await import("@/utils/supabase/client")).getBrowserSupabase()
        const { data: auth } = await supabase.auth.getUser()
        if (!auth.user) return
        const { data, error } = await supabase.from("transactions").select("*").eq("user_id", auth.user.id)
        if (error) throw error
        setTxs(data ?? [])
      } finally {
        setLoading(false)
      }
    })()
  }, [transactions])

  if (loading) return <div className="p-4 text-sm text-muted-foreground">{"กำลังโหลดรายงาน..."}</div>

  if (txs.length === 0) {
    return (
      <EmptyState
        icon={BarChart2}
        title="ยังไม่มีข้อมูลสำหรับรายงาน"
        description="เพิ่มรายการธุรกรรมก่อน แล้วกลับมาดูรายงานอีกครั้ง"
        action={{ href: "/transactions", label: "เพิ่มรายการธุรกรรม" }}
        className="apple-surface rounded-apple border"
      />
    )
  }

  const byMonth: Record<string, { income: number; expense: number }> = {}
  const byType: Record<string, number> = { income: 0, expense: 0 }
  for (const t of txs) {
    const m = t.date.slice(0, 7)
    if (!byMonth[m]) byMonth[m] = { income: 0, expense: 0 }
    if (t.amount >= 0) {
      byMonth[m].income += t.amount
      byType.income += t.amount
    } else {
      byMonth[m].expense += Math.abs(t.amount)
      byType.expense += Math.abs(t.amount)
    }
  }
  const series = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => ({ month: k, ...v }))
  const pieData = [
    { name: "รายรับ", value: byType.income },
    { name: "รายจ่าย", value: byType.expense },
  ]
  const colors = ["#16a34a", "#dc2626"]

  return (
    <div className="space-y-6">
      <Card className="apple-surface rounded-apple border w-full">
        <CardHeader>
          <CardTitle>แนวโน้มรายเดือน</CardTitle>
        </CardHeader>
        <CardContent className="h-[440px] md:h-[520px]">
          <ChartContainer
            config={{
              income: { label: "รายรับ", color: "hsl(var(--chart-1))" },
              expense: { label: "รายจ่าย", color: "hsl(var(--chart-2))" },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
                <XAxis dataKey="month" tickMargin={8} />
                <YAxis tickFormatter={fmt} width={64} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="area-income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="area-expense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-expense)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-expense)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="income"
                  name="รายรับ"
                  stroke="var(--color-income)"
                  strokeWidth={2.2}
                  fill="url(#area-income)"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  name="รายจ่าย"
                  stroke="var(--color-expense)"
                  strokeWidth={2.2}
                  fill="url(#area-expense)"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="apple-surface rounded-apple border w-full">
        <CardHeader>
          <CardTitle>สัดส่วนรับ-จ่าย</CardTitle>
        </CardHeader>
        <CardContent className="h-[420px] md:h-[500px]">
          <ChartContainer
            config={{
              income: { label: "รายรับ", color: colors[0] },
              expense: { label: "รายจ่าย", color: colors[1] },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={160}
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${Math.round(percent ?? 0 * 100)}%`}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={entry.name} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
