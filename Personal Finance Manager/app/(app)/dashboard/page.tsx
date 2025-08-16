import { PageHeader } from "@/components/page-header"
import DashboardClient from "@/components/dashboard/dashboard-client"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="แดชบอร์ด"
        description="ภาพรวมการเงินของคุณแบบเรียลไทม์ พร้อมกราฟสรุปรายเดือน"
        actions={
          <Button asChild variant="outline">
            <a href="/reports">ดูรายงาน <ArrowRight className="ml-1 h-4 w-4" /></a>
          </Button>
        }
      />
      <DashboardClient />
    </div>
  )
}
