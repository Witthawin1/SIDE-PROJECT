"use client"

import type React from "react"

import { cn } from "@/lib/utils"

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "apple-surface rounded-apple mb-8 flex flex-col gap-4 border p-5 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div>
        <h1 className="h-apple text-2xl font-semibold md:text-3xl">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}
