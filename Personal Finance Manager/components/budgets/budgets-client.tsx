"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import type { Database } from "@/utils/supabase/client"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { getBrowserSupabase } from "@/utils/supabase/client"
import { EmptyState } from "@/components/ui/empty-state"
import { Wallet, Trash2 } from "lucide-react"

type Cat = Database["public"]["Tables"]["categories"]["Row"]
type Budget = Database["public"]["Tables"]["budgets"]["Row"]
type Tx = Database["public"]["Tables"]["transactions"]["Row"]

export default function BudgetsClient(props: {
  categories?: Cat[]
  initial?: Budget[]
  transactions?: Tx[]
}) {
  const [categories, setCategories] = useState<Cat[]>(props.categories ?? [])
  const [rows, setRows] = useState<Budget[]>(props.initial ?? [])
  const [transactions, setTransactions] = useState<Tx[]>(props.transactions ?? [])
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7))
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if ((props.categories?.length ?? 0) || (props.initial?.length ?? 0) || (props.transactions?.length ?? 0)) return
    ;(async () => {
      setLoading(true)
      try {
        const supabase = getBrowserSupabase()
        const { data: auth } = await supabase.auth.getUser()
        const user = auth.user
        if (!user) return
        const [cr, br, tr] = await Promise.all([
          supabase.from("categories").select("*").eq("user_id", user.id).order("name"),
          supabase.from("budgets").select("*").eq("user_id", user.id),
          supabase.from("transactions").select("*").eq("user_id", user.id),
        ])
        if (cr.error) throw cr.error
        if (br.error) throw br.error
        if (tr.error) throw tr.error
        setCategories(cr.data ?? [])
        setRows(br.data ?? [])
        setTransactions(tr.data ?? [])
      } catch (e: any) {
        toast({ title: "โหลดงบประมาณล้มเหลว", description: e.message, variant: "destructive" })
      } finally {
        setLoading(false)
      }
    })()
  }, [props.categories, props.initial, props.transactions, toast])

  const spendingByCat = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of transactions) {
      if (!t.category_id) continue
      if (!t.date.startsWith(month)) continue
      if (t.amount < 0) {
        map.set(t.category_id, (map.get(t.category_id) || 0) + Math.abs(t.amount))
      }
    }
    return map
  }, [transactions, month])

  async function addBudget(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const supabase = getBrowserSupabase()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) return toast({ title: "ยังไม่เข้าสู่ระบบ", variant: "destructive" })
    const category_id = String(data.get("category_id") || "")
    const m = String(data.get("month") || month)
    const amount = Number(data.get("amount") || 0)
    const { data: inserted, error } = await supabase
      .from("budgets")
      .insert([{ user_id: auth.user.id, category_id, month: m, amount }])
      .select()
      .single()
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" })
    setRows((prev) => [...prev, inserted])
    form.reset()
  }

  async function deleteBudget(id: string) {
    const supabase = getBrowserSupabase()
    const { error } = await supabase.from("budgets").delete().eq("id", id)
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" })
    setRows((prev) => prev.filter((b) => b.id !== id))
    toast({ title: "ลบงบประมาณแล้ว" })
  }

  const expenseCats = categories.filter((c) => c.type === "expense")
  const showNoBudgets = rows.filter((b) => b.month === month).length === 0

  return (
    <div className="space-y-6">
      <Card className="apple-surface rounded-apple border">
        <CardHeader>
          <CardTitle>ตั้งงบประมาณ</CardTitle>
        </CardHeader>
        <CardContent>
          {expenseCats.length === 0 && (
            <div className="mb-4 rounded-md border p-3 text-sm">
              ยังไม่มีหมวดหมู่ค่าใช้จ่าย โปรดสร้างที่หน้า{" "}
              <a className="underline" href="/categories">
                หมวดหมู่
              </a>{" "}
              ก่อน
            </div>
          )}
          <form onSubmit={addBudget} className="grid gap-3 md:grid-cols-6">
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="category_id">หมวดหมู่</Label>
              <Select name="category_id" defaultValue={expenseCats[0]?.id} disabled={expenseCats.length === 0}>
                <SelectTrigger id="category_id">
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCats.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="month">เดือน</Label>
              <Input
                id="month"
                name="month"
                type="month"
                defaultValue={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="amount">งบประมาณ</Label>
              <Input id="amount" name="amount" type="number" step="0.01" required />
            </div>
            <div className="md:col-span-6">
              <Button type="submit" className="button-pill">
                เพิ่มงบประมาณ
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="p-4 text-sm text-muted-foreground">กำลังโหลดงบประมาณ...</div>
      ) : showNoBudgets ? (
        <EmptyState
          icon={Wallet}
          title="ยังไม่มีงบประมาณสำหรับเดือนนี้"
          description="กำหนดงบประมาณสำหรับแต่ละหมวดหมู่ค่าใช้จ่ายด้านบน"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rows
            .filter((b) => b.month === month)
            .map((b) => {
              const used = spendingByCat.get(b.category_id) || 0
              const pct = Math.min(100, Math.round((used / (b.amount || 1)) * 100))
              const over = used > b.amount
              return (
                <Card key={b.id} className={cn("apple-surface rounded-apple border", over ? "border-red-400" : "")}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base">
                      {categories.find((c) => c.id === b.category_id)?.name ?? "หมวดหมู่"}
                    </CardTitle>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="ลบงบประมาณ"
                      onClick={() => deleteBudget(b.id)}
                      className="button-pill"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>ใช้ไป</span>
                      <span>
                        {used.toLocaleString()} / {b.amount.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={pct} />
                    {over && <p className="text-sm text-red-600">เกินงบประมาณแล้ว!</p>}
                  </CardContent>
                </Card>
              )
            })}
        </div>
      )}
    </div>
  )
}
