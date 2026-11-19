import type { CSSProperties } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROCESS } from "@/constants/content";

/**
 * "A Clear Strategy. A Smarter Way Forward." The four stages climb a
 * staircase from lower left (Discover) to upper right (Optimise); the
 * heading sits in the empty space the climb leaves above the first steps.
 * One hairline traces the steps — tread, riser, tread — and each stage's
 * node turns ember as the line reaches it (ScrollChoreography: data-process*,
 * scrubbed on desktop). Below desktop it's a vertical timeline.
 * Markup is the final state: without JS / reduced motion everything is drawn.
 */
export function ProcessSection() {
  const count = PROCESS.stages.length;
  return (
    <section aria-labelledby="process-heading" className="section-y liquid-bar">
      <div className="container-dw lg:grid lg:grid-cols-12 lg:gap-x-6 lg:[--step:clamp(8.5rem,10vw,10rem)]">
        <SectionHeading
          id="process-heading"
          eyebrow={PROCESS.eyebrow}
          title={PROCESS.heading}
          className="relative z-10 lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:self-start"
        />

        <ol
          data-process
          data-reveal-group="mobile"
          className="process relative mt-14 grid grid-cols-1 gap-12 pl-10 md:mt-16 lg:col-span-12 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:grid-cols-4 lg:items-start lg:gap-0 lg:pl-0"
        >
          {/* Mobile/tablet rail. */}
          <span aria-hidden="true" className="absolute top-3 bottom-3 left-[7px] w-px bg-ink/12 lg:hidden">
            <span data-process-rail className="absolute inset-0 origin-top bg-ink/70" />
          </span>

          {/* Ember spark riding the tip of the line while it draws (positioned by GSAP; hidden without it). */}
          <span
            data-process-spark
            aria-hidden="true"
            className="process-spark pointer-events-none absolute top-0 left-0 z-1 -m-1 size-[9px] rounded-full bg-ember opacity-0"
          />

          {PROCESS.stages.map((stage, i) => (
            <li
              key={stage.id}
              data-process-step
              data-reveal-item
              style={{ "--rise": count - 1 - i } as CSSProperties}
              className="relative lg:mt-[calc(var(--step)*var(--rise))] lg:pt-9 lg:pr-8 lg:pl-7"
            >
              {/* Desktop staircase: the riser climbs from the previous tread, then this tread runs on. */}
              {i > 0 && (
                <span aria-hidden="true" className="absolute top-0 left-0 hidden h-(--step) w-px bg-ink/12 lg:block">
                  <span data-process-riser className="process-fill absolute inset-0 origin-bottom bg-ink/70" />
                </span>
              )}
              <span aria-hidden="true" className="absolute top-0 right-0 left-0 hidden h-px bg-ink/12 lg:block">
                <span data-process-tread className="process-fill absolute inset-0 origin-left bg-ink/70" />
              </span>

              <span
                data-process-node
                aria-hidden="true"
                className="absolute top-3 -left-10 flex size-[15px] items-center justify-center rounded-full border border-ember bg-ember lg:-top-[7px] lg:-left-[7px]"
              >
                <span className="size-[5px] rounded-full bg-ink" />
              </span>

              <span
                aria-hidden="true"
                className="process-num block text-[2.5rem] leading-none font-extralight tracking-[-0.04em] text-ink tabular-nums lg:text-[clamp(3rem,1.2rem+3.4vw,4.75rem)]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-[1.75rem] leading-none font-medium tracking-[-0.025em] text-ink md:text-[2rem] lg:mt-6">
                {stage.title}
              </h3>
              <p className="mt-4 max-w-[30ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                {stage.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
