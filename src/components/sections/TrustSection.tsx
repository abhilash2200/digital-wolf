import Image from "next/image";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import { ANCHORS } from "@/constants/site";
import { TRUST } from "@/constants/content";

/**
 * A slim band between the hero and the problems. Logos run in a continuous,
 * slow marquee of glass pills; until real ones are supplied the pills are
 * clearly labelled placeholders (never invented clients).
 */
export function TrustSection() {
  const hasLogos = TRUST.logos.length > 0;

  return (
    <section
      id={ANCHORS.about}
      aria-labelledby="trust-heading"
      className="border-y border-line/70"
    >
      <div className="container-dw grid grid-cols-1 gap-6 py-10 md:py-12 lg:grid-cols-12 lg:items-center lg:gap-x-6">
        <div className="lg:col-span-3" data-reveal>
          <h2 id="trust-heading" className="max-w-[22ch] text-[1.125rem] leading-snug font-medium text-ink">
            {TRUST.heading}
          </h2>
          {!hasLogos && <PlaceholderTag className="mt-3">Client logos pending</PlaceholderTag>}
        </div>

        {/* Continuous logo marquee: two identical tracks loop seamlessly; the
            copy is hidden from assistive tech. Pauses on hover/focus; static
            under reduced motion (see .marquee in globals.css). */}
        <div data-reveal className="marquee lg:col-span-9">
          {[false, true].map((copy) => (
            <ul
              key={String(copy)}
              className="marquee-track"
              aria-hidden={copy || undefined}
              aria-label={copy ? undefined : hasLogos ? "Clients" : "Client logo placeholders"}
            >
              {hasLogos
                ? TRUST.logos.map((logo) => (
                    <li key={logo.name} className="liquid-glass flex h-14 w-40 shrink-0 items-center justify-center rounded-full px-5 md:h-16 md:w-44">
                      <Image
                        src={logo.src}
                        alt={copy ? "" : logo.name}
                        width={140}
                        height={48}
                        className="h-6 w-auto object-contain opacity-70 grayscale transition-opacity hover:opacity-100"
                      />
                    </li>
                  ))
                : Array.from({ length: TRUST.placeholderSlots }, (_, i) => (
                    <li
                      key={i}
                      className="flex h-14 w-36 shrink-0 items-center justify-center rounded-full border border-dashed border-silver/80 bg-white/40 px-3 md:h-16 md:w-44"
                    >
                      <span className="text-center text-[0.8125rem] text-ink-muted">
                        Client logo {i + 1}
                      </span>
                    </li>
                  ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
