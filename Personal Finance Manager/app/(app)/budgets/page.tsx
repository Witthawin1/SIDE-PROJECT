import { PageHeader } from "@/components/page-header"
import BudgetsClient from "@/components/budgets/budgets-client"

export default function BudgetsPage() {
  return (
    <div>
      <PageHeader
        title="ตั้งงบประมาณ"
        description="กำหนดงบประมาณรายเดือนต่อหมวดหมู่พร้อมติดตามการใช้จ่าย"
      />
      <BudgetsClient />
    </div>
  )
}
