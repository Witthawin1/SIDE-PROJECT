"use client"

import { cn } from "@/lib/utils"

export type SegmentedOption<Value extends string> = {
  label: string
  value: Value
}

export function SegmentedToggle<Value extends string>({
  value,
  onValueChange,
  options,
  className,
}: {
  value: Value
  onValueChange: (v: Value) => void
  options: SegmentedOption<Value>[]
  className?: string
}) {
  return (
    <div
      role="tablist"
      aria-label="Select type"
      className={cn(
        "inline-flex items-center rounded-full border bg-background/70 p-0.5 text-sm shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            className={cn(
              "cursor-pointer rounded-full px-3 py-1.5 transition-colors",
              active ? "bg-foreground text-background" : "text-foreground/80 hover:bg-muted",
            )}
            onClick={() => onValueChange(opt.value)}
            type="button"
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
