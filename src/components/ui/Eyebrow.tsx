import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Section kicker: sentence case, quiet, with a short ember rule. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("flex items-center gap-3 text-[0.9375rem] text-ink-muted", className)}>
      <span aria-hidden="true" className="h-0.5 w-6 rounded-full bg-ember" />
      {children}
    </p>
  );
}
