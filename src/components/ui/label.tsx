"use client"

import * as React from "react"
import { cn } from "@/lib/cn"

// shadcn Label, restyled.
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-[0.875rem] leading-none font-medium text-ink select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
