"use client";

import Image from "next/image";
import { SmartLink as Link } from "@/components/ui/SmartLink";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/types/site";
import { cn } from "@/lib/cn";
import { useGlossPointer } from "@/hooks/useGlossPointer";
import { preloadEnquiryDialog, useEnquiry } from "@/components/forms/EnquiryProvider";
import { contactHref, isModifiedClick } from "@/components/forms/EnquiryButton";

export function ServiceCard({
  service,
  index,
  className,
}: {
  service: Service;
  index: number;
  className?: string;
}) {
  const pointer = useGlossPointer();
  const { openEnquiry } = useEnquiry();
  const headingId = `service-${service.id}`;

  return (
    <article
      data-reveal-item
      {...pointer}
      aria-labelledby={headingId}
      className={cn(
        "gloss-card group/card flex flex-col rounded-[6px] p-6 sm:p-8",
        className,
      )}
    >
      <div
        data-liquid-media
        className="relative -mx-6 -mt-6 aspect-[16/10] overflow-hidden rounded-t-[6px] sm:-mx-8 sm:-mt-8"
      >
        <Image
          src={service.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.2s] ease-editorial group-hover/card:scale-[1.04] motion-reduce:transition-none"
        />
        <p className="text-eyebrow absolute top-4 left-4 tabular-nums liquid-glass rounded-full px-2.5 py-1 text-ink sm:left-6">
          {String(index + 1).padStart(2, "0")}
        </p>
      </div>

      <h4 id={headingId} className="text-card mt-6 max-w-[18ch] text-ink">
        {service.title}
      </h4>
      <p className="mt-3 max-w-[36ch] text-[0.9375rem] leading-relaxed text-ink-muted">
        {service.summary}
      </p>

      <ul className="mt-6 flex flex-col border-t border-line">
        {service.items.map((item) => (
          <li
            key={item}
            className="border-b border-line py-2.5 text-[0.875rem] text-ink-muted"
          >
            {item}
          </li>
        ))}
      </ul>

      <Link
        href={contactHref(service.id)}
        onPointerEnter={preloadEnquiryDialog}
        onFocus={preloadEnquiryDialog}
        onClick={(event) => {
          if (isModifiedClick(event)) return;
          event.preventDefault();
          openEnquiry(service.id);
        }}
        className="group/link mt-auto inline-flex items-center gap-2 self-start pt-8 pb-1 text-[0.9375rem] font-medium text-ink focus-visible:outline-ink"
      >
        <span className="relative">
          Discuss {service.title}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 ease-editorial group-hover/link:scale-x-100"
          />
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 transition-transform duration-500 ease-editorial group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 motion-reduce:transition-none"
          strokeWidth={1.75}
        />
      </Link>
    </article>
  );
}
