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
import { Trash2, FolderPlus } from "lucide-react"
import { getBrowserSupabase } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { EmptyState } from "@/components/ui/empty-state"

type Cat = Database["public"]["Tables"]["categories"]["Row"]

export default function CategoriesClient({ initial }: { initial?: Cat[] }) {
  const [rows, setRows] = useState<Cat[]>(initial ?? [])
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
        const { data, error } = await supabase.from("categories").select("*").eq("user_id", auth.user.id).order("name")
        if (error) throw error
        setRows(data ?? [])
      } catch (e: any) {
        toast({ title: "โหลดหมวดหมู่ล้มเหลว", description: e.message, variant: "destructive" })
      } finally {
        setLoading(false)
      }
    })()
  }, [initial, toast])

  async function addCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const supabase = getBrowserSupabase()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) return toast({ title: "ยังไม่เข้าสู่ระบบ", variant: "destructive" })
    const name = String(data.get("name") || "")
    const type = String(data.get("type") || "expense") as "income" | "expense"
    const { data: inserted, error } = await supabase
      .from("categories")
      .insert([{ user_id: auth.user.id, name, type }])
      .select()
      .single()
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" })
    setRows((prev) => [...prev, inserted])
    form.reset()
  }

  async function remove(id: string) {
    const supabase = getBrowserSupabase()
    const { error } = await supabase.from("categories").delete().eq("id", id)
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" })
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card className="apple-surface rounded-apple border">
        <CardHeader>
          <CardTitle>เพิ่มหมวดหมู่</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addCategory} className="grid gap-3 md:grid-cols-6">
            <div className="space-y-2 md:col-span-4">
              <Label htmlFor="name">ชื่อหมวดหมู่</Label>
              <Input id="name" name="name" required placeholder="เช่น อาหาร, เงินเดือน" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="type">ประเภท</Label>
              <Select name="type" defaultValue="expense">
                <SelectTrigger id="type">
                  <SelectValue placeholder="เลือกประเภท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">ค่าใช้จ่าย</SelectItem>
                  <SelectItem value="income">รายรับ</SelectItem>
                </SelectContent>
              </Select>
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
          <CardTitle>หมวดหมู่ของคุณ</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">กำลังโหลดหมวดหมู่...</div>
          ) : rows.length === 0 ? (
            <EmptyState icon={FolderPlus} title="ยังไม่มีหมวดหมู่" description="สร้างหมวดหมู่แรกของคุณด้านบน เพื่อเริ่มจัดกลุ่มรายการ" />
          ) : (
            <Table className="table-zebra">
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อ</TableHead>
                  <TableHead>ประเภท</TableHead>
                  <TableHead className="w-12">ลบ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.type === "income" ? "รายรับ" : "ค่าใช้จ่าย"}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => remove(c.id)} className="button-pill">
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
