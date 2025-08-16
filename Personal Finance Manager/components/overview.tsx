"use client"

import type { Database } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type Tx = Database["public"]["Tables"]["transactions"]["Row"]
type Acc = Database["public"]["Tables"]["accounts"]["Row"]
type Cat = Database["public"]["Tables"]["categories"]["Row"]

const fmt = (n: number) => new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(Number(n || 0))

function getLastMonths(count: number): string[] {
  const out: string[] = []
  const d = new Date()
  for (let i = 0; i < count; i++) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    out.push(`${y}-${m}`)
    d.setMonth(d.getMonth() - 1)
  }
  return out.reverse()
}

export default function Overview({
  transactions = [],
  accounts = [],
  categories = [],
}: {
  transactions?: Tx[]
  accounts?: Acc[]
  categories?: Cat[]
}) {
  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance ?? 0), 0)
  const monthKey = (d: string) => d.slice(0, 7)

  // Aggregate income/expense by month (expense as positive amount for charting).
  const monthly = transactions.reduce<Record<string, { income: number; expense: number }>>((acc, t) => {
    const k = monthKey(t.date)
    acc[k] ||= { income: 0, expense: 0 }
    if (t.amount >= 0) acc[k].income += t.amount
    else acc[k].expense += Math.abs(t.amount)
    return acc
  }, {})

  // Always show the last 6 months on the chart. Merge actuals on top.
  const months = getLastMonths(6)
  const lineData = months.map((m) => ({
    month: m,
    income: monthly[m]?.income ?? 0,
    expense: monthly[m]?.expense ?? 0,
  }))

  return (
    <div className="grid gap-6 md:grid-cols-12">
      <Card className="apple-surface rounded-apple md:col-span-4 border">
        <CardHeader>
          <CardTitle>ยอดคงเหลือรวม</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold tabular-nums">{fmt(totalBalance)}</p>
        </CardContent>
      </Card>

      <Card className="apple-surface rounded-apple md:col-span-8 border">
        <CardHeader>
          <CardTitle>รายรับ-รายจ่าย รายเดือน</CardTitle>
        </CardHeader>
        <CardContent className="h-[380px] md:h-[440px]">
          <ChartContainer
            config={{
              income: { label: "รายรับ", color: "hsl(var(--chart-1))" },
              expense: { label: "รายจ่าย", color: "hsl(var(--chart-2))" },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
                <XAxis dataKey="month" tickMargin={8} />
                <YAxis tickFormatter={fmt} width={60} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="income"
                  name="รายรับ"
                  stroke="var(--color-income)"
                  strokeWidth={2.2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  name="รายจ่าย"
                  stroke="var(--color-expense)"
                  strokeWidth={2.2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
