import type { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebarShell } from "@/components/app-sidebar"
import "../apple-theme.css"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebarShell>{children}</AppSidebarShell>
    </SidebarProvider>
  )
}
