import Image from "next/image";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import { ANCHORS } from "@/constants/site";
import { TRUST } from "@/constants/content";

export function TrustSection() {
  const hasLogos = TRUST.logos.length > 0;

  return (
    <section
      id={ANCHORS.about}
      aria-labelledby="trust-heading"
      className="liquid-bar border-y border-white/70"
    >
      <div className="container-dw grid grid-cols-1 gap-10 py-14 md:py-16 lg:grid-cols-12 lg:items-center lg:gap-x-6 lg:py-20">
        <div className="lg:col-span-4" data-reveal>
          <h2
            id="trust-heading"
            className="text-card max-w-[22ch] text-ink md:text-[1.75rem] md:leading-tight"
          >
            {TRUST.heading}
          </h2>
          {!hasLogos && (
            <PlaceholderTag className="mt-5">Client logos pending</PlaceholderTag>
          )}
        </div>

        <ul
          data-reveal
          className="grid grid-cols-2 gap-px overflow-hidden rounded-[6px] border border-line bg-line sm:grid-cols-3 lg:col-span-8"
          aria-label={hasLogos ? "Clients" : "Client logo placeholders"}
        >
          {hasLogos
            ? TRUST.logos.map((logo) => (
                <li key={logo.name} className="flex h-24 items-center justify-center bg-white/45 px-6 md:h-28">
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={140}
                    height={48}
                    className="h-8 w-auto object-contain opacity-70 grayscale transition-opacity hover:opacity-100"
                  />
                </li>
              ))
            : Array.from({ length: TRUST.placeholderSlots }, (_, i) => (
                <li
                  key={i}
                  className="flex h-24 items-center justify-center bg-white/45 px-4 md:h-28"
                >
                  <span className="text-eyebrow text-center text-ink-muted/80">
                    Client logo {String(i + 1).padStart(2, "0")}
                  </span>
                </li>
              ))}
        </ul>
      </div>
    </section>
  );
}
