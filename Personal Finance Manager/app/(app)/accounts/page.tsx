import { PageHeader } from "@/components/page-header"
import AccountsClient from "@/components/accounts/accounts-client"

export default function AccountsPage() {
  return (
    <div>
      <PageHeader
        title="บัญชีของฉัน"
        description="จัดการบัญชีเงินสด บัญชีธนาคาร และบัตรเครดิต"
      />
      <AccountsClient />
    </div>
  )
}
