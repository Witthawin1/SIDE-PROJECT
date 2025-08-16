'use client'
import { PageHeader } from "@/components/page-header"
import TxClient from "@/components/transactions/transactions-client"
import ImportCsv from "@/components/utils/import-csv"
import { Button } from "@/components/ui/button"
import { Upload } from 'lucide-react'

export default function TransactionsPage() {
  return (
    <div>
      <PageHeader
        title="รายการธุรกรรม"
        description="บันทึก แก้ไข และจัดการรายการของคุณ"
        actions={
          <Button asChild variant="outline">
            <a href="/categories">จัดการหมวดหมู่</a>
          </Button>
        }
      />
      <div className="mb-4">
        {/* <ImportCsv onImported={() => {}} /> */}
      </div>
      <TxClient/>
    </div>
  )
}
