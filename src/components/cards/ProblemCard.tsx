"use client";

import type { ProblemItem } from "@/types/site";
import { cn } from "@/lib/cn";
import { useGlossPointer } from "@/hooks/useGlossPointer";
import { GlossTexture } from "./GlossTexture";

/**
 * A problem as a glass card. The ember node top-left is where the connection
 * line threads through once the cards are "structured" (ProblemSection).
 */
export function ProblemCard({ item, className }: { item: ProblemItem; className?: string }) {
  const pointer = useGlossPointer();

  return (
    <article
      {...pointer}
      className={cn("gloss-card flex h-full flex-col rounded-[10px] p-6 sm:p-8", className)}
    >
      <GlossTexture variant={item.texture} />

      <span
        data-problem-node
        aria-hidden="true"
        className="relative z-10 block size-3 rounded-full border-2 border-ember bg-paper"
      />

      <div className="mt-14 sm:mt-20">
        <h3 className="text-card text-ink">{item.title}</h3>
        <p className="mt-3 max-w-[38ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          {item.body}
        </p>
      </div>
    </article>
  );
}
