import Image from "next/image";
import { EnquiryButton } from "@/components/forms/EnquiryButton";
import { SECTION_ART } from "@/constants/content";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProblemCard } from "@/components/cards/ProblemCard";
import { CTA, PROBLEMS } from "@/constants/site";

export function ProblemSection() {
  const [first, second, third, fourth] = PROBLEMS.items;

  return (
    <section aria-labelledby="problems-heading" className="section-y">
      <div className="container-dw">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-6">
          {/* Editorial headline column */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]" data-reveal>
              <Eyebrow>{PROBLEMS.eyebrow}</Eyebrow>
              <h2 id="problems-heading" className="text-section mt-6 max-w-[16ch]">
                {PROBLEMS.heading}
              </h2>
              <p className="text-body mt-6 max-w-[40ch] text-ink-muted">
                {PROBLEMS.intro}
              </p>
              {/* Scattered, unconnected drops — the problem, visualised. */}
              <div
                data-liquid-media
                className="relative mt-10 hidden aspect-[4/5] w-full max-w-[400px] md:block"
              >
                <Image
                  src={SECTION_ART.problems}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, 400px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Asymmetric 2×2 grid: the second column sits lower on tablet and up */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:col-span-7" data-reveal-group>
            {/* Columns dissolve on mobile so cards read 01 → 04 in order. */}
            <div className="max-md:contents md:flex md:flex-col md:gap-5">
              <ProblemCard item={first} index={0} className="min-h-[260px] max-md:order-1 md:min-h-[380px]" />
              <ProblemCard item={third} index={2} className="min-h-[260px] max-md:order-3 md:min-h-[320px]" />
            </div>
            <div className="max-md:contents md:mt-20 md:flex md:flex-col md:gap-5" data-parallax="28">
              <ProblemCard item={second} index={1} className="min-h-[260px] max-md:order-2 md:min-h-[320px]" />
              <ProblemCard item={fourth} index={3} className="min-h-[260px] max-md:order-4 md:min-h-[380px]" />
            </div>
          </div>
        </div>

        {/* Solution statement */}
        <div data-reveal className="mt-20 grid grid-cols-1 items-end gap-8 border-t border-line pt-10 md:mt-28 md:pt-14 lg:grid-cols-12 lg:gap-x-6">
          <p className="text-section lg:col-span-9 max-w-[20ch]">
            {PROBLEMS.solution}
          </p>
          <div className="lg:col-span-3 lg:justify-self-end">
            <EnquiryButton size="lg" arrow>
              {CTA.heroPrimary}
            </EnquiryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
