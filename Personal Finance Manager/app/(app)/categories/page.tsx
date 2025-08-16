import { PageHeader } from "@/components/page-header"
import CategoriesClient from "@/components/categories/categories-client"

export default function CategoriesPage() {
  return (
    <div>
      <PageHeader
        title="หมวดหมู่"
        description="สร้างและจัดการหมวดหมู่รายรับ-รายจ่าย"
      />
      <CategoriesClient />
    </div>
  )
}
