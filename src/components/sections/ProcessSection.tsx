import { SectionHeading } from "@/components/ui/SectionHeading";
import Image from "next/image";
import { PROCESS, SECTION_ART } from "@/constants/content";

export function ProcessSection() {
  return (
    <section aria-labelledby="process-heading" className="section-y bg-mist/60">
      <div className="container-dw">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-x-6">
          <SectionHeading
            id="process-heading"
            eyebrow={PROCESS.eyebrow}
            title={PROCESS.heading}
            className="lg:col-span-6"
          />
          {/* Separate drops gradually becoming one — the four stages, visualised. */}
          <div
            data-liquid-media
            className="relative aspect-[24/9] w-full lg:col-span-6"
          >
            <Image
              src={SECTION_ART.process}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain mix-blend-multiply"
            />
          </div>
        </div>

        {/* Vertical timeline on mobile/tablet, horizontal sequence on desktop. */}
        <ol data-process data-reveal-group className="relative mt-14 grid grid-cols-1 gap-10 pl-10 md:mt-20 lg:grid-cols-4 lg:gap-6 lg:pt-12 lg:pl-0">
          <span
            data-process-line
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[7px] w-px bg-ink/15 lg:top-[7px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto"
          />
          {PROCESS.stages.map((stage, i) => (
            <li key={stage.id} className="relative" data-reveal-item>
              <span
                data-process-node
                aria-hidden="true"
                className="absolute top-1.5 -left-10 flex size-[15px] items-center justify-center rounded-full border border-ink/30 bg-paper lg:-top-12 lg:left-0"
              >
                <span className="size-[5px] rounded-full bg-ink" />
              </span>
              <p className="text-eyebrow tabular-nums text-ink-muted">
                Stage {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-[1.75rem] leading-none font-medium tracking-[-0.025em] text-ink md:text-[2.25rem]">
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
