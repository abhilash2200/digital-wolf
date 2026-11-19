import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { EnquiryButton } from "@/components/forms/EnquiryButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartLink } from "@/components/ui/SmartLink";
import { Pending, PlaceholderTag } from "@/components/ui/Placeholder";
import { ANCHORS, CTA } from "@/constants/site";
import { WORK } from "@/constants/content";
import type { CaseStudy } from "@/types/site";
import { cn } from "@/lib/cn";

type RailCard = { src: string; tone: string };

const isPlaceholder = (project: CaseStudy) => project.client === null;

/**
 * Selected work: three full-bleed rows of project cards running as
 * continuous carousels — top row left → right, middle right → left, bottom
 * left → right (CSS, .work-row in globals.css; pause on hover). The rows
 * are decorative (duplicated for the seamless loop); the numbered list below
 * carries each project's details and case-study action. Reduced motion:
 * still rows.
 */
export function CaseStudies() {
  const projects = [WORK.featured, ...WORK.supporting];
  const [top, middle, bottom] = WORK.rows;
  return (
    <section id={ANCHORS.work} aria-labelledby="work-heading" className="section-y overflow-x-clip">
      <div className="container-dw">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <SectionHeading
            id="work-heading"
            eyebrow={WORK.eyebrow}
            title={WORK.heading}
            className="lg:col-span-8"
          />
          <PlaceholderTag className="justify-self-start lg:col-span-4 lg:justify-self-end">
            {WORK.railNote}
          </PlaceholderTag>
        </div>
      </div>

      {/* grid-cols-1 = minmax(0, 1fr): rows must not grow to their content width. */}
      <div aria-hidden="true" className="mt-14 grid grid-cols-1 gap-3 md:mt-20 md:gap-4">
        {top && <CardRow cards={top} direction="right" duration="70s" />}
        {middle && <CardRow cards={middle} direction="left" duration="80s" />}
        {bottom && <CardRow cards={bottom} direction="right" duration="64s" />}
      </div>

      <div className="container-dw mt-16 md:mt-24">
        {projects.some(isPlaceholder) && (
          <PlaceholderTag className="mb-8">Project content pending</PlaceholderTag>
        )}
        <ol data-reveal-group className="border-b border-line">
          {projects.map((project, i) => (
            <ProjectRow key={project.id} project={project} index={i + 1} featured={i === 0} />
          ))}
        </ol>
        <div className="mt-12 md:mt-16">
          <EnquiryButton size="lg" arrow>
            {CTA.heroPrimary}
          </EnquiryButton>
        </div>
      </div>
    </section>
  );
}

/** One continuously running row: two identical tracks loop seamlessly. */
function CardRow({
  cards,
  direction,
  duration,
}: {
  cards: readonly RailCard[];
  direction: "left" | "right";
  duration: string;
}) {
  return (
    <div className="work-row" data-dir={direction} style={{ ["--work-duration" as string]: duration }}>
      {[0, 1].map((copy) => (
        <div key={copy} className="work-track" data-copy={copy === 1 || undefined}>
          {cards.map((card, i) => (
            <div
              key={`${card.src}-${i}`}
              className="relative aspect-[4/3] w-[clamp(12rem,24vw,22rem)] shrink-0 overflow-hidden rounded-[6px] shadow-[inset_0_0_0_1px_rgb(17_17_17/0.06)]"
              style={{ backgroundColor: card.tone }}
            >
              <Image
                src={card.src}
                alt=""
                fill
                sizes="(min-width: 768px) 24vw, 12rem"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ProjectRow({
  project,
  index,
  featured,
}: {
  project: CaseStudy;
  index: number;
  featured: boolean;
}) {
  const services = project.services.length ? project.services.join(", ") : null;
  return (
    <li
      data-reveal-item
      className="grid grid-cols-[3rem_1fr] gap-x-4 gap-y-3 border-t border-line py-8 md:py-10 lg:grid-cols-12 lg:gap-x-6"
    >
      <span className="pt-1 text-[0.9375rem] text-ink-muted tabular-nums lg:col-span-1">
        {String(index).padStart(2, "0")}
      </span>
      <article
        aria-labelledby={`case-${project.id}`}
        className="col-start-2 grid gap-y-3 lg:col-span-11 lg:col-start-2 lg:grid-cols-11 lg:gap-x-6"
      >
        <div className="lg:col-span-4">
          {featured && <p className="mb-2 text-[0.8125rem] text-ink-muted">Featured project</p>}
          <h3 id={`case-${project.id}`} className="text-card text-ink">
            {project.client ?? <Pending label="Client name to be supplied" />}
          </h3>
          <p className="mt-2 text-[0.9375rem] text-ink-muted">
            {project.industry ?? <Pending label="Industry to be supplied" />}
          </p>
        </div>
        <dl className="grid gap-3 text-[0.9375rem] lg:col-span-4">
          <div>
            <dt className="sr-only">Challenge</dt>
            <dd className="max-w-[44ch] leading-relaxed text-ink">
              {project.challenge ??
                "Challenge, approach and verified outcomes will be added once project details are supplied."}
            </dd>
          </div>
          {services && (
            <div>
              <dt className="sr-only">Services</dt>
              <dd className="text-ink-muted">{services}</dd>
            </div>
          )}
          {project.outcomes && (
            <div>
              <dt className="sr-only">Verified outcomes</dt>
              <dd className="text-ink-muted">{project.outcomes}</dd>
            </div>
          )}
        </dl>
        <div className="lg:col-span-3 lg:justify-self-end">
          <CaseStudyAction project={project} />
        </div>
      </article>
    </li>
  );
}

function CaseStudyAction({ project, className }: { project: CaseStudy; className?: string }) {
  if (project.href) {
    return (
      <SmartLink
        href={project.href}
        className={cn("group/link inline-flex items-center gap-2 py-1 font-medium text-ink", className)}
      >
        View case study
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 transition-transform duration-500 ease-editorial group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          strokeWidth={1.75}
        />
      </SmartLink>
    );
  }
  // No case study page yet — say so rather than linking to a dead route.
  return <p className={cn("text-[0.9375rem] text-ink-muted", className)}>Case study coming soon</p>;
}
