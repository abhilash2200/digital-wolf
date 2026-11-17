import * as React from "react"
import { cn } from "@/lib/cn"

// shadcn Textarea, restyled to match Input.
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-32 w-full rounded-md border border-input bg-surface px-4 py-3 text-base leading-relaxed text-ink transition-[border-color,box-shadow] duration-200 outline-none placeholder:text-ink-muted/70 hover:border-silver focus-visible:border-ink focus-visible:ring-3 focus-visible:ring-ink/10 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/12",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
