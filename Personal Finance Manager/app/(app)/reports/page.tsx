import { PageHeader } from "@/components/page-header"
import ReportsClient from "@/components/reports/reports-client"

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="รายงาน"
        description="ดูแนวโน้มรายเดือนและสัดส่วนรายรับ-รายจ่าย"
      />
      <ReportsClient />
    </div>
  )
}
