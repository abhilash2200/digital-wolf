import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactPageForm } from "@/components/forms/ContactPageForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CONTACT } from "@/constants/content";
import { SITE } from "@/constants/site";
import { PageTransition } from "@/components/motion/PageTransition";

export const metadata: Metadata = {
  title: `Contact — ${SITE.name}`,
  description: CONTACT.body,
};

export default function ContactPage() {
  return (
    <PageTransition>
    <section aria-labelledby="contact-page-heading" className="pt-(--header-h)">
      <div className="container-dw grid grid-cols-1 gap-12 pt-12 pb-(--section-y) md:pt-16 lg:grid-cols-12 lg:gap-x-6 lg:pt-20">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]">
            <Eyebrow>Contact</Eyebrow>
            <h1 id="contact-page-heading" className="text-section mt-6 max-w-[14ch]">
              {CONTACT.heading}
            </h1>
            <p className="text-body mt-6 max-w-[42ch] text-ink-muted">{CONTACT.body}</p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-lg border border-line bg-surface/60 p-5 sm:p-8 md:p-10">
            {/* Reading ?service= needs the browser; the fallback renders the same form unselected. */}
            <Suspense fallback={<ContactForm variant="page" />}>
              <ContactPageForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
    </PageTransition>
  );
}
