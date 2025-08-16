import { PageHeader } from "@/components/page-header"
import SettingsClient from "@/components/settings/settings-client"

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="การตั้งค่า"
        description="ความปลอดภัย บัญชี และการสำรองข้อมูล"
      />
      <SettingsClient />
    </div>
  )
}
