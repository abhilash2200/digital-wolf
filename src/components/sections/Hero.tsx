import { ButtonLink } from "@/components/ui/Button";
import { EnquiryButton } from "@/components/forms/EnquiryButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroVisual } from "@/components/three/HeroVisual";
import { ANCHORS, CTA, HERO } from "@/constants/site";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative pt-(--header-h)"
    >
      <div className="container-dw grid grid-cols-1 items-center gap-y-10 pt-10 pb-16 md:pt-14 lg:grid-cols-12 lg:gap-x-6 lg:pt-8 lg:pb-24 lg:min-h-[calc(100svh-var(--header-h))]">
        <div className="lg:col-span-6 lg:pr-4">
          <Eyebrow>{HERO.eyebrow}</Eyebrow>

          <h1 id="hero-heading" className="text-display mt-6 max-w-[14ch] lg:mt-8">
            {HERO.heading}
          </h1>

          <p className="text-body mt-6 max-w-[46ch] text-ink-muted lg:mt-8">
            {HERO.body}
          </p>

          <div className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap lg:mt-10">
            <EnquiryButton size="lg" arrow>
              {CTA.heroPrimary}
            </EnquiryButton>
            <ButtonLink
              href={`/#${ANCHORS.services}`}
              size="lg"
              variant="glass"
            >
              {CTA.heroSecondary}
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-6">
          <HeroVisual className="mx-auto aspect-[4/3.4] w-full max-w-[640px] sm:aspect-[5/4] lg:aspect-[1/1.02] lg:max-w-none" />
        </div>
      </div>
    </section>
  );
}
