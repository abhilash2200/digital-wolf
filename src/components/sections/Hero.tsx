import { Fragment, type CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { EnquiryButton } from "@/components/forms/EnquiryButton";
import Image from "next/image";
import { HeroLens } from "./HeroLens";
import { ANCHORS, CTA, HERO } from "@/constants/site";
import { cn } from "@/lib/cn";

/**
 * Composition: the approved headline set at poster scale across the full
 * width, over a twisted ribbon of liquid pearl (generated art, see
 * scripts/art/pearl-ribbon.html). A liquid-glass lens drifts over the type on
 * desktop. Supporting copy and CTAs sit in one quiet row.
 *
 * Entrance is CSS-only and never fades the h1 (LCP paints on frame one).
 * Scroll hand-off (lines drift apart, ribbon sinks and turns) is scrubbed in
 * ScrollChoreography via data-hero-* attributes, desktop only.
 */

// Presentational line groups — always slices of the approved heading, so the
// copy stays word-for-word. Desktop indents alternate lines for rhythm.
const LINE_BREAKS = [0, 3, 5, 7];
const LINE_INDENT = ["", "lg:pl-[16.66%]", "", "lg:pl-[16.66%]"];

export function Hero() {
  const words = HERO.heading.split(" ");
  const lines = LINE_BREAKS.map((start, i) => words.slice(start, LINE_BREAKS[i + 1] ?? words.length));
  const step = (i: number) => ({ "--i": i }) as CSSProperties;
  let w = 0;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex flex-col pt-(--header-h)"
    >
      <div className="container-dw relative flex flex-1 flex-col pt-10 pb-12 md:pt-14 lg:pt-[clamp(2rem,6vh,4.5rem)] lg:pb-14">
        {/* Pearl ribbon behind the type. */}
        <div
          data-hero-visual
          aria-hidden="true"
          className="hero-ribbon-fade pointer-events-none absolute top-[-16%] right-[-30%] w-[104%] sm:top-[-16%] sm:right-[-16%] sm:w-[66%] lg:top-[-10%] lg:right-[-1%] lg:w-[60%]"
        >
          <div className="hero-ribbon">
            <Image
              src="/images/hero-ribbon-ember.webp"
              alt=""
              width={2000}
              height={2000}
              sizes="(min-width: 1024px) 60vw, (min-width: 640px) 90vw, 118vw"
              loading="eager"
              fetchPriority="high"
              className="h-auto w-full"
            />
          </div>
        </div>

        <h1 id="hero-heading" className="hero-title relative">
          {lines.map((line, li) => (
            <Fragment key={li}>
              <span
                data-hero-line={li % 2 ? "1" : "-1"}
                className={cn("lg:block", LINE_INDENT[li])}
              >
                {line.map((word, wi) => {
                  const index = w++;
                  return (
                    <Fragment key={wi}>
                      <span className="hero-word" style={step(index)}>
                        {word}
                      </span>
                      {wi < line.length - 1 && " "}
                    </Fragment>
                  );
                })}
              </span>
              {li < lines.length - 1 && " "}
            </Fragment>
          ))}
        </h1>

        <div className="relative z-10 mt-10 grid grid-cols-1 gap-8 md:grid-cols-6 lg:mt-[clamp(3.5rem,9vh,6.5rem)] lg:grid-cols-12 lg:items-end lg:gap-6">
          <p className="hero-in text-[0.9375rem] text-ink md:col-span-2 lg:col-span-3 lg:pb-1" style={step(4)}>
            {HERO.eyebrow}
          </p>
          <p className="hero-in text-body max-w-[44ch] text-ink-muted md:col-span-4 lg:col-span-4" style={step(5)}>
            {HERO.body}
          </p>
          <div
            className="hero-in flex flex-col gap-3 xs:flex-row xs:flex-wrap md:col-span-6 lg:col-span-5 lg:flex-nowrap lg:justify-end"
            style={step(6)}
          >
            <EnquiryButton size="lg">{CTA.heroPrimary}</EnquiryButton>
            <ButtonLink href={`/#${ANCHORS.services}`} size="lg" variant="glass">
              {CTA.heroSecondary}
            </ButtonLink>
          </div>
        </div>
      </div>

      <HeroLens />
    </section>
  );
}
