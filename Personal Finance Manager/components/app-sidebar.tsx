"use client"

import type React from "react"

import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Home, ListOrdered, Wallet, FolderKanban, BarChart3, Wallet2, Settings, LogOut, UserPlus } from "lucide-react"
import { usePathname } from "next/navigation"
import { getBrowserSupabase } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Transactions", url: "/transactions", icon: ListOrdered },
  { title: "Accounts", url: "/accounts", icon: Wallet2 },
  { title: "Categories", url: "/categories", icon: FolderKanban },
  { title: "Budgets", url: "/budgets", icon: Wallet },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebarShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const supabase = getBrowserSupabase()
        const { data } = await supabase.auth.getUser()
        setEmail(data.user?.email ?? null)
      } catch {
        setEmail(null)
      }
    }
    load()
  }, [])

  async function signOut() {
    try {
      await fetch("/auth/signout", { method: "POST" })
    } catch {
      // ignore
    } finally {
      window.location.href = "/login"
    }
  }

  return (
    <div className="flex min-h-svh">
      <Sidebar className="border-r bg-white/60 backdrop-blur-xl supports-[backdrop-filter]:bg-white/55">
        <SidebarHeader>
          <div className="px-2 py-1.5 text-sm font-semibold tracking-tight">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-zinc-900" />
              PFM
            </span>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const active = pathname.startsWith(item.url)
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className={cn(
                          "rounded-full transition-colors",
                          active ? "bg-zinc-900 text-white hover:bg-zinc-900" : "hover:bg-zinc-100",
                        )}
                      >
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 pb-2">
            <div className="inline-flex max-w-full items-center gap-2 truncate rounded-full border bg-white/70 backdrop-blur px-3 py-1 text-xs text-muted-foreground">
              <span className="truncate">{email ?? "Not signed in"}</span>
            </div>
          </div>
          <div className="flex gap-2 px-2 pb-3">
            <Button variant="outline" size="sm" asChild className="button-pill bg-transparent">
              <Link href="/login?tab=signup">
                <UserPlus className="mr-1 h-4 w-4" />
                Sign up
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut} className="button-pill">
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-white/70 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <SidebarTrigger className="button-pill" />
          <h1 className="h-apple text-base font-semibold">Personal Finance Manager</h1>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </SidebarInset>
    </div>
  )
}
