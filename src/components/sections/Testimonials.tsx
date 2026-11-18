import { EnquiryButton } from "@/components/forms/EnquiryButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import { CTA } from "@/constants/site";
import { TESTIMONIALS } from "@/constants/content";
import { TestimonialReel } from "./TestimonialReel";

/**
 * "Good Work Builds Lasting Partnerships." One quote at a time at pull-quote
 * scale, its ember opening mark hung in the margin. Several quotes become a
 * swipeable reel with a counter and previous/next (TestimonialReel); no
 * autoplay. Until genuine, approved quotes are supplied, the same slot holds
 * a clearly labelled placeholder — never an invented quote.
 */
export function Testimonials() {
  const items = TESTIMONIALS.items;

  return (
    <section aria-labelledby="testimonials-heading" className="section-y">
      <div className="container-dw grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-4">
          <SectionHeading
            id="testimonials-heading"
            eyebrow={TESTIMONIALS.eyebrow}
            title={TESTIMONIALS.heading}
          />
          <div className="mt-10">
            <EnquiryButton variant="glass" size="lg" arrow>
              {CTA.contact}
            </EnquiryButton>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6" data-reveal>
          {items.length === 0 ? <Pending /> : <TestimonialReel items={items} />}
        </div>
      </div>
    </section>
  );
}

/** Holds the quote's place without imitating one: no quote mark, no attribution. */
function Pending() {
  return (
    <div className="border-t border-line pt-8 lg:pt-10">
      <PlaceholderTag>Testimonials pending</PlaceholderTag>
      <p className="mt-6 max-w-[34ch] text-[clamp(1.375rem,1rem+1.2vw,2rem)] leading-[1.2] tracking-[-0.015em] text-ink-muted">
        Client testimonials will appear here once genuine quotes have been supplied and approved
        for publication.
      </p>
    </div>
  );
}
