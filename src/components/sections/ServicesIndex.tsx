"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { EnquiryButton } from "@/components/forms/EnquiryButton";
import type { ServiceCategory } from "@/types/site";
import { cn } from "@/lib/cn";

/**
 * Desktop: an editorial index of the six services (a vertical tablist,
 * grouped) beside a sticky glass panel showing the active service. Rows
 * activate on hover (mouse), focus, click and arrow keys.
 * Below desktop: every service is shown in full, stacked — nothing depends
 * on hover.
 */
export function ServicesIndex({ categories }: { categories: readonly ServiceCategory[] }) {
  const services = categories.flatMap((c) => c.services.map((s) => ({ ...s, group: c.title })));
  const [activeId, setActiveId] = useState(services[0].id);
  const active = services.find((s) => s.id === activeId) ?? services[0];
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent) => {
    const i = services.findIndex((s) => s.id === activeId);
    const next =
      event.key === "ArrowDown" ? (i + 1) % services.length
      : event.key === "ArrowUp" ? (i - 1 + services.length) % services.length
      : event.key === "Home" ? 0
      : event.key === "End" ? services.length - 1
      : -1;
    if (next < 0) return;
    event.preventDefault();
    setActiveId(services[next].id);
    tabs.current[next]?.focus();
  };

  let t = 0;

  return (
    <>
      {/* ---------- Desktop: index + sticky panel ---------- */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-x-6">
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Services"
          onKeyDown={onKeyDown}
          className="col-span-7"
          data-reveal-group
        >
          {categories.map((category) => (
            <div key={category.id} className="border-t border-line pt-5 pb-7 first:pt-6">
              <p aria-hidden="true" className="mb-2 text-[0.9375rem] text-ink-muted">
                {category.title}
              </p>
              {category.services.map((service) => {
                const index = t++;
                const selected = service.id === activeId;
                return (
                  <button
                    key={service.id}
                    ref={(el) => {
                      tabs.current[index] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`svc-tab-${service.id}`}
                    aria-selected={selected}
                    aria-controls="svc-panel"
                    tabIndex={selected ? 0 : -1}
                    data-reveal-item
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActiveId(service.id)}
                    onFocus={() => setActiveId(service.id)}
                    onClick={() => setActiveId(service.id)}
                    className="group flex w-full items-start py-1.5 text-left focus-visible:outline-offset-4"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        // Sits on the first line: half of the title's line box.
                        "mt-[clamp(1.08rem,1.78vw,1.75rem)] h-0.5 shrink-0 rounded-full bg-ember transition-[width,margin] duration-500 ease-editorial",
                        selected ? "mr-4 w-10" : "mr-0 w-0",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[clamp(2rem,3.3vw,3.25rem)] leading-[1.08] font-medium tracking-[-0.035em] transition-colors duration-300",
                        selected ? "text-ink" : "text-ink/45 group-hover:text-ink/70",
                      )}
                    >
                      {service.title}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="col-span-5">
          <div
            id="svc-panel"
            role="tabpanel"
            aria-labelledby={`svc-tab-${active.id}`}
            className="glass-panel sticky top-[calc(var(--header-h)+24px)] overflow-hidden rounded-[14px] border"
          >
            {/* All art is mounted; the active one crossfades in. */}
            <div data-liquid-media className="relative aspect-[16/10] overflow-hidden border-b border-white/70">
              {services.map((service) => (
                <Image
                  key={service.id}
                  src={service.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 40vw, 1px"
                  className={cn(
                    "object-cover transition-[opacity,transform] duration-700 ease-editorial",
                    service.id === active.id ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
                  )}
                />
              ))}
            </div>

            <div key={active.id} className="svc-in p-7 xl:p-8">
              <p className="text-[0.9375rem] text-ink-muted">{active.group}</p>
              <h3 className="text-card mt-2 text-ink">{active.title}</h3>
              <p className="text-body mt-3 max-w-[40ch] text-ink-muted">{active.summary}</p>
              <ul className="mt-6 grid grid-cols-2 gap-x-6 border-t border-line/80">
                {active.items.map((item) => (
                  <li key={item} className="border-b border-line/80 py-2.5 text-[0.875rem] text-ink">
                    {item}
                  </li>
                ))}
              </ul>
              <EnquiryButton service={active.id} className="mt-7">
                Discuss {active.title}
              </EnquiryButton>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Below desktop: everything visible, stacked ---------- */}
      <div className="flex flex-col gap-12 lg:hidden">
        {categories.map((category) => (
          <div key={category.id}>
            <h3 className="flex items-center gap-3 border-t border-line pt-5 text-[0.9375rem] text-ink-muted">
              {category.title}
            </h3>
            <ul className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5" data-reveal-group>
              {category.services.map((service) => (
                <li key={service.id} data-reveal-item className="glass-panel overflow-hidden rounded-[12px] border">
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-white/70">
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="text-card text-ink">{service.title}</h4>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">{service.summary}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {service.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-line bg-white/60 px-3 py-1 text-[0.8125rem] text-ink"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                    <EnquiryButton service={service.id} variant="secondary" className="mt-6">
                      Discuss {service.title}
                    </EnquiryButton>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
