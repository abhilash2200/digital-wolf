import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/cn"

// shadcn Input (Base UI), restyled. Stays 16px on all sizes so iOS doesn't zoom on focus.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-md border border-input bg-surface px-4 text-base text-ink transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-ink-muted/70 hover:border-silver focus-visible:border-ink focus-visible:ring-3 focus-visible:ring-ink/10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/12",
        className
      )}
      {...props}
    />
  )
}

export { Input }
