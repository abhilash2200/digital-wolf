import { ServiceCard } from "@/components/cards/ServiceCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS } from "@/constants/site";
import { SERVICES } from "@/constants/content";

// Running service number across categories (01–06).
const OFFSETS = SERVICES.categories.map((_, i) =>
  SERVICES.categories
    .slice(0, i)
    .reduce((count, category) => count + category.services.length, 0),
);

export function ServicesSection() {
  return (
    <section
      id={ANCHORS.services}
      aria-labelledby="services-heading"
      className="section-y"
    >
      <div className="container-dw">
        <SectionHeading
          id="services-heading"
          eyebrow={SERVICES.eyebrow}
          title={SERVICES.heading}
          intro={SERVICES.intro}
        />

        <div className="mt-14 flex flex-col gap-14 md:mt-20 md:gap-20">
          {SERVICES.categories.map((category, ci) => (
            <div
              key={category.id}
              className="grid grid-cols-1 gap-6 border-t border-line pt-6 lg:grid-cols-12 lg:gap-x-6 lg:pt-8"
            >
              <div className="lg:col-span-3" data-reveal>
                <div className="flex items-baseline gap-4 lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:flex-col lg:gap-3">
                  <span className="text-eyebrow text-ink-muted">
                    Category {category.label}
                  </span>
                  <h3 className="text-[1.125rem] leading-tight font-medium tracking-[-0.01em] text-ink md:text-xl">
                    {category.title}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:col-span-9" data-reveal-group>
                {category.services.map((service, si) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    index={OFFSETS[ci] + si}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
