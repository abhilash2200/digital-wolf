import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS } from "@/constants/site";
import { SERVICES } from "@/constants/content";
import { ServicesIndex } from "./ServicesIndex";

/**
 * Six services in three groups, explored as an index: "available
 * individually or brought together as one connected programme".
 */
export function ServicesSection() {
  return (
    <section id={ANCHORS.services} aria-labelledby="services-heading" className="section-y">
      <div className="container-dw">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <SectionHeading
            id="services-heading"
            eyebrow={SERVICES.eyebrow}
            title={SERVICES.heading}
            className="lg:col-span-7"
          />
          <p className="text-body max-w-[44ch] text-ink-muted lg:col-span-4 lg:col-start-9 lg:pb-2" data-reveal>
            {SERVICES.intro}
          </p>
        </div>

        <div className="mt-12 md:mt-16">
          <ServicesIndex categories={SERVICES.categories} />
        </div>
      </div>
    </section>
  );
}
