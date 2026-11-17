import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Visible marker for content that hasn't been supplied yet. Never replace with
 * invented names, logos, quotes or results — swap in real content instead.
 */
export function PlaceholderTag({
  children = "Placeholder",
  tone = "light",
  className,
}: {
  children?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-eyebrow inline-flex items-center gap-2 rounded-full border border-dashed px-3 py-1.5",
        tone === "dark"
          ? "border-white/30 text-white/60"
          : "border-silver text-ink-muted",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

/** Inline “to be supplied” value for missing facts. */
export function Pending({ label = "To be supplied" }: { label?: string }) {
  // ink-muted, not silver: silver on paper fails contrast.
  return <span className="text-ink-muted italic">{label}</span>;
}
