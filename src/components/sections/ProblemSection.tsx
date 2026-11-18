import { EnquiryButton } from "@/components/forms/EnquiryButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProblemCard } from "@/components/cards/ProblemCard";
import { CTA, PROBLEMS } from "@/constants/site";

/**
 * "They lack connection" → "Scattered → Structured", told with the cards.
 *
 * The markup is the finished, structured state (a neat row), so it reads
 * correctly without JS and under reduced motion. On desktop,
 * ScrollChoreography pins the stage and scrubs: the cards start as a tilted
 * pile, straighten into the row, then an ember line threads their nodes.
 * Below desktop the cards simply reveal in a stagger.
 */
export function ProblemSection() {
  return (
    <section data-problems aria-labelledby="problems-heading" className="relative">
      <div
        data-problems-stage
        className="container-dw pt-(--section-y) lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:pt-(--header-h) lg:pb-10"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-6" data-reveal>
          <div className="lg:col-span-7">
            <Eyebrow>{PROBLEMS.eyebrow}</Eyebrow>
            <h2 id="problems-heading" className="text-section mt-5 max-w-[17ch]">
              {PROBLEMS.heading}
            </h2>
          </div>
          <p className="text-body max-w-[40ch] text-ink-muted lg:col-span-4 lg:col-start-9 lg:pb-2">
            {PROBLEMS.intro}
          </p>
        </div>

        <div className="relative mt-12 lg:mt-14">
          {/* Connection line: from the first node (32px card padding + 6px node radius) out past the last — forward. */}
          <span
            data-problems-line
            aria-hidden="true"
            className="pointer-events-none absolute top-[37px] right-0 left-[38px] z-10 hidden h-0.5 origin-left rounded-full bg-ember lg:block"
          />
          <ul
            data-reveal-group="mobile"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4"
          >
            {PROBLEMS.items.map((item) => (
              <li key={item.id} data-problem-card data-reveal-item>
                <ProblemCard item={item} className="min-h-[240px] lg:min-h-[300px]" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The answer to the problem. */}
      <div className="container-dw pt-16 pb-(--section-y) lg:pt-20">
        <div
          data-reveal
          className="grid grid-cols-1 items-end gap-8 border-t border-line pt-10 md:pt-14 lg:grid-cols-12 lg:gap-x-6"
        >
          <p className="text-section max-w-[20ch] lg:col-span-9">{PROBLEMS.solution}</p>
          <div className="lg:col-span-3 lg:justify-self-end">
            <EnquiryButton size="lg">{CTA.heroPrimary}</EnquiryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
