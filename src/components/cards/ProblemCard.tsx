"use client";

import type { ProblemItem } from "@/types/site";
import { cn } from "@/lib/cn";
import { useGlossPointer } from "@/hooks/useGlossPointer";
import { GlossTexture } from "./GlossTexture";

export function ProblemCard({
  item,
  index,
  className,
}: {
  item: ProblemItem;
  index: number;
  className?: string;
}) {
  const pointer = useGlossPointer();

  return (
    <article
      data-reveal-item
      {...pointer}
      className={cn(
        "gloss-card flex flex-col justify-between rounded-[6px] p-6 sm:p-8",
        className,
      )}
    >
      <GlossTexture variant={item.texture} />

      <p className="text-eyebrow tabular-nums text-ink-muted">
        {String(index + 1).padStart(2, "0")}
      </p>

      <div className="mt-16 sm:mt-24">
        <h3 className="text-card text-ink">{item.title}</h3>
        <p className="mt-3 max-w-[38ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          {item.body}
        </p>
      </div>
    </article>
  );
}
