import Image from "next/image";
import { EnquiryButton } from "@/components/forms/EnquiryButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import { CTA } from "@/constants/site";
import { TESTIMONIALS } from "@/constants/content";
import type { Testimonial } from "@/types/site";

export function Testimonials() {
  const items = TESTIMONIALS.items;

  return (
    <section aria-labelledby="testimonials-heading" className="section-y border-t border-line">
      <div className="container-dw grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-5">
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

        <div className="lg:col-span-7" data-reveal>
          {items.length === 0 ? (
            <EmptyState />
          ) : (
            // Stacked on mobile; becomes a horizontal snap row on larger screens.
            <ul className="-mx-(--gutter-x) flex snap-x snap-mandatory gap-5 overflow-x-auto px-(--gutter-x) pb-4 max-md:flex-col max-md:overflow-visible md:mx-0 md:px-0">
              {items.map((t, i) => (
                <li key={i} className="shrink-0 snap-start md:w-[min(100%,560px)]">
                  <Quote testimonial={t} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function Quote({ testimonial }: { testimonial: Testimonial }) {
  const attribution = [testimonial.role, testimonial.company].filter(Boolean).join(", ");
  return (
    <figure className="flex h-full flex-col justify-between rounded-[6px] border glass-panel p-6 sm:p-10">
      <blockquote className="text-[1.25rem] leading-snug tracking-[-0.01em] text-ink md:text-[1.5rem]">
        “{testimonial.quote}”
      </blockquote>
      {(testimonial.name || attribution) && (
        <figcaption className="mt-8 flex items-center gap-4 text-[0.9375rem]">
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

/** Shown until genuine, approved testimonials are supplied. Never fake quotes. */
function EmptyState() {
  return (
    <div className="flex min-h-[280px] flex-col justify-between rounded-[6px] border border-dashed border-silver bg-white/35 p-6 backdrop-blur-xl sm:p-10">
      <span aria-hidden="true" className="text-[5rem] leading-none text-ink/15">
        “
      </span>
      <div>
        <PlaceholderTag>Testimonials pending</PlaceholderTag>
        <p className="mt-4 max-w-[44ch] text-body text-ink-muted">
          Client testimonials will appear here once genuine quotes have been supplied and approved for publication.
        </p>
      </div>
    </div>
  );
}
