"use client"

import type React from "react"
import type { Database } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import { getBrowserSupabase } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { EmptyState } from "@/components/ui/empty-state"

type Acc = Database["public"]["Tables"]["accounts"]["Row"]

export default function AccountsClient({ initial }: { initial?: Acc[] }) {
  const [rows, setRows] = useState<Acc[]>(initial ?? [])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (initial?.length) return
    ;(async () => {
      setLoading(true)
      try {
        const supabase = getBrowserSupabase()
        const { data: auth } = await supabase.auth.getUser()
        if (!auth.user) return
        const { data, error } = await supabase
          .from("accounts")
          .select("*")
          .eq("user_id", auth.user.id)
          .order("created_at", { ascending: true })
        if (error) throw error
        setRows(data ?? [])
      } catch (e: any) {
        toast({ title: "โหลดบัญชีล้มเหลว", description: e.message, variant: "destructive" })
      } finally {
        setLoading(false)
      }
    })()
  }, [initial, toast])

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const supabase = getBrowserSupabase()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) return toast({ title: "ยังไม่เข้าสู่ระบบ", variant: "destructive" })
    const name = String(data.get("name") || "")
    const type = String(data.get("type") || "bank") as Acc["type"]
    const balance = Number(data.get("balance") || 0)
    const { data: inserted, error } = await supabase
      .from("accounts")
      .insert([{ user_id: auth.user.id, name, type, balance }])
      .select()
      .single()
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" })
    setRows((prev) => [...prev, inserted])
    form.reset()
  }

  async function remove(id: string) {
    const supabase = getBrowserSupabase()
    const { error } = await supabase.from("accounts").delete().eq("id", id)
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" })
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card className="apple-surface rounded-apple border">
        <CardHeader>
          <CardTitle>เพิ่มบัญชี</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={add} className="grid gap-3 md:grid-cols-6">
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="name">ชื่อบัญชี</Label>
              <Input id="name" name="name" required placeholder="เช่น กระเป๋าเงินสด, กสิกร, Visa" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="type">ประเภท</Label>
              <Select name="type" defaultValue="bank">
                <SelectTrigger id="type">
                  <SelectValue placeholder="เลือกประเภท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">บัญชีธนาคาร</SelectItem>
                  <SelectItem value="credit_card">บัตรเครดิต</SelectItem>
                  <SelectItem value="cash">เงินสด</SelectItem>
                  <SelectItem value="other">อื่นๆ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="balance">ยอดเริ่มต้น</Label>
              <Input id="balance" name="balance" type="number" step="0.01" defaultValue={0} />
            </div>
            <div className="md:col-span-6">
              <Button type="submit" className="button-pill">
                เพิ่ม
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="apple-surface rounded-apple border">
        <CardHeader>
          <CardTitle>บัญชีทั้งหมด</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">กำลังโหลดบัญชี...</div>
          ) : rows.length === 0 ? (
            <EmptyState icon={Trash2} title="ยังไม่มีบัญชี" description="เริ่มต้นโดยการเพิ่มบัญชีแรกของคุณด้านบน" />
          ) : (
            <Table className="table-zebra">
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อ</TableHead>
                  <TableHead>ประเภท</TableHead>
                  <TableHead>ยอดคงเหลือ</TableHead>
                  <TableHead className="w-12">ลบ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>{a.type}</TableCell>
                    <TableCell>{a.balance.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => remove(a.id)} className="button-pill">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
