"use client"

import { Button } from "@/components/ui/button"
import Papa from "papaparse"
import { getBrowserSupabase } from "@/utils/supabase/client"
import type { Database } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"

type Acc = Database["public"]["Tables"]["accounts"]["Row"]
type Cat = Database["public"]["Tables"]["categories"]["Row"]
type Tx = Database["public"]["Tables"]["transactions"]["Row"]

export default function ImportCsv({
  accounts = [],
  categories = [],
  onImported,
}: {
  accounts?: Acc[]
  categories?: Cat[]
  onImported: (rows: Tx[]) => void
}) {
  const { toast } = useToast()

  function handlePick() {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv,text/csv"
    input.onchange = async () => {
      if (!input.files?.[0]) return
      Papa.parse(input.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const supabase = getBrowserSupabase()
          const { data: auth } = await supabase.auth.getUser()
          if (!auth.user) return
          const mapped = (results.data as any[]).map((r) => {
            const acc = accounts.find((a) => a.name === r.account) || accounts[0]
            const cat = categories.find((c) => c.name === r.category)
            const amount = parseFloat(r.amount)
            const date = r.date ?? new Date().toISOString().slice(0, 10)
            return {
              user_id: auth.user!.id,
              account_id: acc?.id!,
              category_id: cat?.id ?? null,
              amount: isNaN(amount) ? 0 : amount,
              currency: "THB",
              note: r.note ?? null,
              date,
            }
          })
          const { data, error } = await supabase.from("transactions").insert(mapped).select()
          if (error) return toast({ title: "Import error", description: error.message, variant: "destructive" })
          onImported((data ?? []) as Tx[])
          toast({ title: "นำเข้า CSV สำเร็จ", description: `${data?.length ?? 0} รายการ` })
        },
      })
    }
    input.click()
  }

  return (
    <Button variant="outline" onClick={handlePick}>นำเข้า CSV</Button>
  )
}
