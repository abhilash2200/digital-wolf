import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  className,
  tone = "light",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className={className} data-reveal>
      {eyebrow && (
        <Eyebrow className={dark ? "text-white/60" : undefined}>{eyebrow}</Eyebrow>
      )}
      <h2
        id={id}
        className={cn(
          "text-section max-w-[18ch]",
          eyebrow && "mt-6",
          dark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "text-body mt-6 max-w-[48ch]",
            dark ? "text-white/65" : "text-ink-muted",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
