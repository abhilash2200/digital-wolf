"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import type { Testimonial } from "@/types/site";

/**
 * A scroll-snap row of full-width quotes: swipe on touch, previous/next (they
 * wrap, so neither is ever dead), ←/→ while focus is inside, and a counter.
 * Without JS it's still a scrollable row. No autoplay.
 */
export function TestimonialReel({ items }: { items: readonly Testimonial[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const many = items.length > 1;

  // Slides are separated by a gap (so no sliver of the next one shows), so
  // positions come from each slide's offset, not multiples of the width.
  const slideLeft = (el: HTMLUListElement, i: number) => {
    const slide = el.children[i] as HTMLElement | undefined;
    return slide ? slide.offsetLeft - el.offsetLeft : 0;
  };

  // Follow the slide nearest the track's left edge (swipe, keys or buttons).
  useEffect(() => {
    const el = track.current;
    if (!el || !many) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let nearest = 0;
        for (let i = 1; i < el.children.length; i++) {
          if (Math.abs(slideLeft(el, i) - el.scrollLeft) < Math.abs(slideLeft(el, nearest) - el.scrollLeft)) nearest = i;
        }
        setIndex(nearest);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [many]);

  const go = (next: number) => {
    const el = track.current;
    if (!el) return;
    const target = (next + items.length) % items.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: slideLeft(el, target), behavior: reduce ? "auto" : "smooth" });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    go(index + (event.key === "ArrowRight" ? 1 : -1));
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  const samples = items.filter((t) => t.sample).length;

  return (
    <>
      {/* Above the reel, not in a slide, so the hung quote mark stays level with the quote. */}
      {samples > 0 && (
        <PlaceholderTag className="mb-8 lg:mb-10">
          {samples === items.length ? "Sample quotes" : "Includes sample quotes"} · replace before launch
        </PlaceholderTag>
      )}
      <div
        className="relative pt-14 lg:pt-0"
        role={many ? "region" : undefined}
        aria-roledescription={many ? "carousel" : undefined}
        aria-label={many ? "Client testimonials" : undefined}
        onKeyDown={many ? onKeyDown : undefined}
      >
        {/* One opening mark for the reel, hung in the margin on desktop (outside
            the scrolling track, which would clip it). */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 text-[5rem] leading-[0.8] font-light text-ember lg:-left-[0.55em] lg:text-[6.5rem]"
        >
          “
        </span>
        <ul
          ref={track}
          data-lenis-prevent
          className="flex snap-x snap-mandatory gap-10 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((t, i) => (
            <li
              key={i}
              aria-roledescription={many ? "slide" : undefined}
              aria-label={many ? `${i + 1} of ${items.length}` : undefined}
              className="w-full shrink-0 snap-start"
            >
              <Quote testimonial={t} />
            </li>
          ))}
        </ul>

        {many && (
          <div className="mt-10 flex items-center justify-between border-t border-line pt-5">
            <p className="text-[0.9375rem] text-ink-muted tabular-nums" aria-live="polite">
              <span className="text-ink">{pad(index + 1)}</span> / {pad(items.length)}
            </p>
            <div className="flex gap-2">
              <Button
                variant="glass"
                className="size-11 px-0"
                aria-label="Previous testimonial"
                  onClick={() => go(index - 1)}
              >
                <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.75} />
              </Button>
              <Button
                variant="glass"
                className="size-11 px-0"
                aria-label="Next testimonial"
                  onClick={() => go(index + 1)}
              >
                <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Quote({ testimonial }: { testimonial: Testimonial }) {
  const attribution = [testimonial.role, testimonial.company].filter(Boolean).join(", ");
  return (
    <figure>
      <blockquote className="max-w-[30ch] text-[clamp(1.5rem,1.05rem+1.6vw,2.5rem)] leading-[1.18] tracking-[-0.02em] text-ink">
        {testimonial.quote}”
      </blockquote>
      {(testimonial.name || attribution) && (
        <figcaption className="mt-10 flex items-center gap-4 text-[0.9375rem]">
          {testimonial.logo && (
            <Image src={testimonial.logo} alt="" width={40} height={40} className="size-10 object-contain grayscale" />
          )}
          <span>
            {testimonial.name && <span className="block font-medium text-ink">{testimonial.name}</span>}
            {attribution && <span className="block text-ink-muted">{attribution}</span>}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
