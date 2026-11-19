import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQ as FAQ_CONTENT } from "@/constants/content";

/**
 * "Questions, Answered." Large editorial question rows beside a sticky
 * heading; the open row's rule draws across in ember. The first answer starts
 * open so the section shows content without a click.
 */
export function FAQ() {
  return (
    <section aria-labelledby="faq-heading" className="section-y">
      <div className="container-dw grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)]">
            <SectionHeading
              id="faq-heading"
              eyebrow={FAQ_CONTENT.eyebrow}
              title={FAQ_CONTENT.heading}
            />
          </div>
        </div>

        <div className="lg:col-span-8" data-reveal>
          <Accordion defaultValue={[FAQ_CONTENT.items[0].question]}>
            {FAQ_CONTENT.items.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p>{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
