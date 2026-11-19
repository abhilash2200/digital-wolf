import Image from "next/image";
import { EnquiryButton } from "@/components/forms/EnquiryButton";
import { ANCHORS, CTA } from "@/constants/site";
import { CONTACT } from "@/constants/content";

/**
 * "Let's Make Your Next Move Matter." The closing bookend to the hero:
 * display-scale type beside a tall pearl ribbon whose ember twist turns level
 * with the one black action. No panel, no second CTA.
 */
export function ContactSection() {
  return (
    <section
      id={ANCHORS.contact}
      aria-labelledby="contact-heading"
      className="relative isolate overflow-clip pt-6 pb-(--section-y) lg:pt-10"
    >
      <div className="container-dw grid grid-cols-1 lg:grid-cols-12 lg:gap-x-6">
        {/* Ribbon: a cropped band above the copy below desktop; a tall column
            beside it from desktop, its twist level with the CTA. */}
        <div
          aria-hidden="true"
          data-parallax="36"
          className="relative -mx-(--gutter-x) aspect-[16/10] sm:aspect-[21/9] lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mx-0 lg:-mt-10 lg:-mb-16 lg:aspect-auto"
        >
          <div data-liquid-media className="art-feather-y absolute inset-0">
            <Image
              src={CONTACT.art}
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-[70%_78%] lg:object-contain lg:object-[100%_50%]"
            />
          </div>
        </div>

        <div className="relative z-10 mt-6 lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:py-16">
          <h2 id="contact-heading" className="text-display max-w-[12ch] text-ink" data-reveal>
            {CONTACT.heading}
          </h2>
          <div data-reveal>
            <p className="text-body mt-8 max-w-[44ch] text-ink-muted">{CONTACT.body}</p>
            <div className="mt-10">
              <EnquiryButton variant="primary" size="lg" arrow>
                {CTA.contact}
              </EnquiryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
