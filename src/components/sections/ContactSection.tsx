import Image from "next/image";
import { EnquiryButton } from "@/components/forms/EnquiryButton";
import { ANCHORS, CTA } from "@/constants/site";
import { CONTACT, SECTION_ART } from "@/constants/content";

export function ContactSection() {
  return (
    <section
      id={ANCHORS.contact}
      aria-labelledby="contact-heading"
      className="pb-(--section-y)"
    >
      <div className="container-dw">
        <div data-reveal className="relative overflow-hidden rounded-[6px] border border-line bg-surface shadow-[0_10px_30px_-10px_rgb(17_17_17/0.05)]">
          {/* One confident drop — the next move. Banner on mobile, backdrop from desktop. */}
          <div
            data-liquid-media
            className="relative aspect-[16/9] w-full overflow-hidden rounded-t-[6px] opacity-35 lg:absolute lg:inset-0 lg:-z-10 lg:aspect-auto lg:rounded-[6px] lg:opacity-25"
          >
            <Image
              src={SECTION_ART.contact}
              alt=""
              fill
              sizes="(min-width: 1024px) 1280px, 100vw"
              className="object-cover object-[85%_50%] lg:object-right"
            />
          </div>

          <div className="px-6 pt-8 pb-14 sm:px-10 md:pb-20 lg:max-w-[58%] lg:px-16 lg:py-28">
            <h2 id="contact-heading" className="text-section max-w-[14ch] text-ink">
              {CONTACT.heading}
            </h2>
            <p className="text-body mt-6 max-w-[44ch] text-ink-muted">{CONTACT.body}</p>
            <div className="mt-8">
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
