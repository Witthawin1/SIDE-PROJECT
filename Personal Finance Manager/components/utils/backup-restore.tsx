"use client"

import { Button } from "@/components/ui/button"
import { getBrowserSupabase } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function BackupRestore() {
  const { toast } = useToast()

  async function exportJson() {
    try {
      const supabase = getBrowserSupabase()
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) throw new Error("Not signed in")
      const uid = auth.user.id
      const [accounts, categories, transactions, budgets] = await Promise.all([
        supabase.from("accounts").select("*").eq("user_id", uid),
        supabase.from("categories").select("*").eq("user_id", uid),
        supabase.from("transactions").select("*").eq("user_id", uid),
        supabase.from("budgets").select("*").eq("user_id", uid),
      ])
      const payload = {
        exported_at: new Date().toISOString(),
        accounts: accounts.data ?? [],
        categories: categories.data ?? [],
        transactions: transactions.data ?? [],
        budgets: budgets.data ?? [],
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `pfm-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      toast({ title: "Export error", description: e.message, variant: "destructive" })
    }
  }

  async function restoreJson() {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    input.onchange = async () => {
      try {
        if (!input.files?.[0]) return
        const text = await input.files[0].text()
        const payload = JSON.parse(text)
        const supabase = getBrowserSupabase()
        const { data: auth } = await supabase.auth.getUser()
        if (!auth.user) throw new Error("Not signed in")
        // naive restore: inserts data as-is (IDs preserved). In production, consider mapping IDs.
        await Promise.all([
          payload.accounts?.length ? supabase.from("accounts").upsert(payload.accounts) : Promise.resolve(),
          payload.categories?.length ? supabase.from("categories").upsert(payload.categories) : Promise.resolve(),
          payload.transactions?.length ? supabase.from("transactions").upsert(payload.transactions) : Promise.resolve(),
          payload.budgets?.length ? supabase.from("budgets").upsert(payload.budgets) : Promise.resolve(),
        ])
        toast({ title: "กู้คืนข้อมูลสำเร็จ" })
      } catch (e: any) {
        toast({ title: "Restore error", description: e.message, variant: "destructive" })
      }
    }
    input.click()
  }

  return (
    <div className="space-x-2">
      <Button variant="outline" onClick={exportJson}>สำรองข้อมูล (JSON)</Button>
      <Button variant="outline" onClick={restoreJson}>กู้คืนข้อมูล</Button>
    </div>
  )
}
