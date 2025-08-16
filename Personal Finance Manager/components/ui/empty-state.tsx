"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: { href: string; label: string }
  className?: string
}) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="p-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
          {action && (
            <Button asChild className="mt-4">
              <a href={action.href}>{action.label}</a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
