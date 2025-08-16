import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import type { Database } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getBrowserSupabase } from "@/utils/supabase/client"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { SegmentedToggle } from "@/components/segmented-toggle"
import { swalToast } from "@/lib/swal-toast"
import { log } from "console"

type Tx = Database["public"]["Tables"]["transactions"]["Row"]
type Cat = Database["public"]["Tables"]["categories"]["Row"]
type Acc = Database["public"]["Tables"]["accounts"]["Row"]

export default function TxClient({
  initialTxs,
  categories: initialCats,
  accounts: initialAccs,
}: {
  initialTxs?: Tx[]
  categories?: Cat[]
  accounts?: Acc[]
}) {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  const [txs, setTxs] = useState<Tx[]>(initialTxs ?? [])
  const [categories, setCategories] = useState<Cat[]>(initialCats ?? [])
  const [accounts, setAccounts] = useState<Acc[]>(initialAccs ?? [])

  // UI state
  const [txType, setTxType] = useState<"income" | "expense">("expense")
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(undefined)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined)

  const { toast } = useToast()
  const mounted = useRef(true)

  // 1) Auth check and subscription (run once).
  useEffect(() => {
    mounted.current = true
    const supabase = getBrowserSupabase()
    supabase.auth.getUser().then(({ data }) => {
      if (mounted.current) setAuthed(!!data.user)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (mounted.current) setAuthed(!!session?.user)
    })
    return () => {
      mounted.current = false
      sub.subscription.unsubscribe()
    }
  }, [])

  // 2) Load data only if not provided via props.
  useEffect(() => {
    // If we have initial data, skip client fetch.
    if ((initialTxs?.length ?? 0) || (initialCats?.length ?? 0) || (initialAccs?.length ?? 0)) return

    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const supabase = getBrowserSupabase()
        const { data: auth } = await supabase.auth.getUser()
        const user = auth.user
        if (!user) return
        const [txr, cr, ar] = await Promise.all([
          supabase
            .from("transactions")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: false })
            .limit(500),
          supabase.from("categories").select("*").eq("user_id", user.id).order("name"),
          supabase.from("accounts").select("*").eq("user_id", user.id).order("name"),
        ])
        if (txr.error) throw txr.error
        if (cr.error) throw cr.error
        if (ar.error) throw ar.error

        if (!cancelled && mounted.current) {
          setTxs(txr.data ?? [])
          setCategories(cr.data ?? [])
          setAccounts(ar.data ?? [])
        }
      } catch (e: any) {
        if (!cancelled && mounted.current) {
          // Do not include `toast` in deps to avoid effect re-runs
          toast({ title: "โหลดข้อมูลล้มเหลว", description: e.message, variant: "destructive" })
        }
      } finally {
        if (!cancelled && mounted.current) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
    // Only tied to whether we got initial props.
  }, [initialTxs, initialCats, initialAccs])

  // Derived lists and safe default selections (no setState here -> no loops).
  const categoriesForType = useMemo(() => categories.filter((c) => c.type === txType), [categories, txType])
  const accountValue = selectedAccountId ?? accounts[0]?.id
  const categoryValue = selectedCategoryId ?? categoriesForType[0]?.id

  const filtered = useMemo(() => {
    return txs
  }, [txs])

  async function addTx(e: React.FormEvent<HTMLFormElement>) {
    console.log(e);
    
    e.preventDefault()
    const supabase = getBrowserSupabase()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) return swalToast("ยังไม่เข้าสู่ระบบ", "error")

    const form = e.target as HTMLFormElement
    console.log(form);
    const data = new FormData(form)
    console.log(data);
    
    const account_id = String(data.get("account_id") || accountValue || "")
    const category_id = String(data.get("category_id") || categoryValue || "")
    if (!account_id) return swalToast("โปรดเลือกบัญชี", "warning")

    const amountAbs = Math.abs(Number(data.get("amount")))
    const signedAmount = txType === "expense" ? -amountAbs : amountAbs

    const body = {
      account_id,
      category_id: category_id || null,
      amount: signedAmount,
      currency: "THB",
      note: String(data.get("note") || ""),
      date: String(data.get("date")),
    }

    const { data: inserted, error } = await supabase
      .from("transactions")
      .insert([{ ...body, user_id: auth.user.id }])
      .select()
      .single()

    if (error) return swalToast(error.message ?? "บันทึกล้มเหลว", "error")
    setTxs((prev) => [inserted, ...prev])
    form.reset()
    swalToast(txType === "income" ? "เพิ่มรายรับแล้ว" : "เพิ่มรายจ่ายแล้ว", "success")
  }

  async function deleteTx(id: string) {
    const supabase = getBrowserSupabase()
    const { error } = await supabase.from("transactions").delete().eq("id", id)
    if (error) return swalToast(error.message ?? "ลบรายการไม่สำเร็จ", "error")
    setTxs((prev) => prev.filter((t) => t.id !== id))
    swalToast("ลบรายการแล้ว", "success")
  }

  if (loading) return <div className="p-4 text-sm text-muted-foreground">กำลังโหลดรายการ...</div>
  if (authed === false) {
    return (
      <div className="p-6">
        <p>โปรดเข้าสู่ระบบเพื่อจัดการรายการ</p>
        <Button className="mt-3 button-pill" asChild>
          <a href="/login">ไปที่หน้าล็อกอิน</a>
        </Button>
      </div>
    )
  }

  const hasAccounts = accounts.length > 0
  const hasCategories = categories.length > 0
  const needsSetup = authed && (!hasAccounts || !hasCategories)

  return (
    <div className="space-y-6">
      <Card className="apple-surface rounded-apple border">
        <CardHeader>
          <CardTitle className="text-base">เพิ่มรายการ</CardTitle>
        </CardHeader>
        <CardContent>
          {needsSetup && (
            <div className="mb-4 rounded-md border p-3 text-sm">
              กรุณาสร้างบัญชีและหมวดหมู่ก่อนเริ่มบันทึกรายการ{" "}
              <a className="underline" href="/accounts">
                บัญชี
              </a>{" "}
              /{" "}
              <a className="underline" href="/categories">
                หมวดหมู่
              </a>
            </div>
          )}

          <form onSubmit={addTx} className="grid gap-4 md:grid-cols-6">
            {/* Hidden inputs ensure FormData contains current values */}
            <input type="hidden" name="account_id" value={accountValue ?? ""} />
            <input type="hidden" name="category_id" value={categoryValue ?? ""} />

            <div className="space-y-2 md:col-span-2">
              <Label>ประเภท</Label>
              <SegmentedToggle
                value={txType}
                onValueChange={(v) => setTxType(v)}
                options={[
                  { label: "รายรับ", value: "income" },
                  { label: "รายจ่าย", value: "expense" },
                ]}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="account_id">บัญชี</Label>
              <Select value={accountValue} onValueChange={setSelectedAccountId} disabled={!hasAccounts}>
                <SelectTrigger id="account_id" className={cn(!hasAccounts && "opacity-60")}>
                  <SelectValue placeholder="เลือกบัญชี" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="category_id">หมวดหมู่</Label>
              <Select
                value={categoryValue}
                onValueChange={setSelectedCategoryId}
                disabled={categoriesForType.length === 0}
              >
                <SelectTrigger id="category_id" className={cn(categoriesForType.length === 0 && "opacity-60")}>
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesForType.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categoriesForType.length === 0 && (
                <p className="text-xs text-muted-foreground">ยังไม่มีหมวดหมู่สำหรับประเภทนี้ โปรดเพิ่มที่หน้า หมวดหมู่</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="amount">จำนวนเงิน</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                required
                placeholder="เช่น 500.00"
                className={
                  txType === "expense"
                    ? "border-rose-200 focus-visible:ring-rose-400"
                    : "border-emerald-200 focus-visible:ring-emerald-400"
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="date">วันที่</Label>
              <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>

            <div className="space-y-2 md:col-span-4">
              <Label htmlFor="note">โน้ต</Label>
              <Input id="note" name="note" placeholder="รายละเอียด..." />
            </div>

            <div className="md:col-span-6 flex items-center justify-end">
              <Button type="submit" className="button-pill min-w-28">
                <Plus className="mr-1 h-4 w-4" /> บันทึก
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="apple-surface rounded-apple border">
        <CardHeader>
          <CardTitle className="text-base">รายการล่าสุด</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {txs.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">ยังไม่มีรายการ ลองเพิ่มรายการแรกของคุณ</div>
          ) : (
            <Table className="table-zebra">
              <TableHeader>
                <TableRow>
                  <TableHead>วันที่</TableHead>
                  <TableHead>บัญชี</TableHead>
                  <TableHead>หมวดหมู่</TableHead>
                  <TableHead>จำนวนเงิน</TableHead>
                  <TableHead>โน้ต</TableHead>
                  <TableHead className="w-10">ลบ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => {
                  const acc = accounts.find((a) => a.id === t.account_id)?.name ?? "-"
                  const cat = categories.find((c) => c.id === t.category_id)?.name ?? "-"
                  const positive = t.amount >= 0
                  return (
                    <TableRow key={t.id}>
                      <TableCell>{t.date}</TableCell>
                      <TableCell>{acc}</TableCell>
                      <TableCell>{cat}</TableCell>
                      <TableCell className={positive ? "text-green-600" : "text-red-600"}>
                        {t.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{t.note}</TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteTx(t.id)}
                          aria-label="Delete"
                          className="button-pill"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
