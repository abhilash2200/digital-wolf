import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CTA, SITE } from "@/constants/site";

export const metadata: Metadata = {
  title: `Page not found — ${SITE.name}`,
};

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-heading" className="pt-(--header-h)">
      <div className="container-dw flex min-h-[70svh] flex-col justify-center py-(--section-y)">
        <Eyebrow>Error 404</Eyebrow>
        <h1 id="not-found-heading" className="text-section mt-6 max-w-[16ch]">
          This page has moved on.
        </h1>
        <p className="text-body mt-6 max-w-[44ch] text-ink-muted">
          The page you’re looking for doesn’t exist or is no longer available.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink href="/" size="lg" arrow>
            Back to home
          </ButtonLink>
          <ButtonLink href="/contact" size="lg" variant="secondary">
            {CTA.contact}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
