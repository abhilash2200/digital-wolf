import Image from "next/image";
import Link from "next/link";
import { EnquiryButton } from "@/components/forms/EnquiryButton";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Pending, PlaceholderTag } from "@/components/ui/Placeholder";
import { ANCHORS, CTA } from "@/constants/site";
import { WORK } from "@/constants/content";
import type { CaseStudy } from "@/types/site";
import { cn } from "@/lib/cn";

const isPlaceholder = (project: CaseStudy) => project.client === null;

export function CaseStudies() {
  return (
    <section id={ANCHORS.work} aria-labelledby="work-heading" className="section-y">
      <div className="container-dw">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="work-heading" eyebrow={WORK.eyebrow} title={WORK.heading} />
          {isPlaceholder(WORK.featured) && (
            <PlaceholderTag className="self-start md:self-auto">
              Project content pending
            </PlaceholderTag>
          )}
        </div>

        <div className="mt-14 md:mt-20" data-reveal>
          <FeaturedProject project={WORK.featured} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2" data-reveal-group>
          {WORK.supporting.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i + 2} />
          ))}
        </div>

        <div className="mt-12 flex justify-start md:justify-end">
          <EnquiryButton size="lg" arrow>
            {CTA.heroPrimary}
          </EnquiryButton>
        </div>
      </div>
    </section>
  );
}

function FeaturedProject({ project }: { project: CaseStudy }) {
  const fields: [string, string | null][] = [
    ["Industry", project.industry],
    ["Challenge", project.challenge],
    ["Strategy", project.strategy],
    ["Execution", project.execution],
    ["Services", project.services.length ? project.services.join(", ") : null],
    ["Outcomes", project.outcomes],
  ];

  return (
    <article
      aria-labelledby={`case-${project.id}`}
      className="grid grid-cols-1 overflow-hidden rounded-[6px] border glass-panel lg:grid-cols-12"
    >
      <ProjectVisual project={project} sizes="(min-width: 1024px) 60vw, 100vw" className="aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[520px]" />

      <div className="flex flex-col p-6 sm:p-8 lg:col-span-5 lg:p-10">
        <p className="text-eyebrow text-ink-muted">Featured · 01</p>
        <h3 id={`case-${project.id}`} className="text-card mt-4 text-ink">
          {project.client ?? <Pending label="Client name to be supplied" />}
        </h3>

        <dl className="mt-8 grid grid-cols-1 border-t border-line">
          {fields.map(([term, value]) => (
            <div key={term} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-line py-3 text-[0.9375rem]">
              <dt className="text-ink-muted">{term}</dt>
              <dd className="text-ink">{value ?? <Pending />}</dd>
            </div>
          ))}
        </dl>

        <CaseStudyAction project={project} className="mt-8" />
      </div>
    </article>
  );
}

function ProjectCard({ project, index }: { project: CaseStudy; index: number }) {
  return (
    <article
      data-reveal-item
      aria-labelledby={`case-${project.id}`}
      className="flex flex-col overflow-hidden rounded-[6px] border glass-panel"
    >
      <ProjectVisual project={project} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className="text-eyebrow text-ink-muted">
          {String(index).padStart(2, "0")} · {project.industry ?? "Industry pending"}
        </p>
        <h3 id={`case-${project.id}`} className="text-card mt-3 text-ink">
          {project.client ?? <Pending label="Client name to be supplied" />}
        </h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
          {project.challenge ?? "Challenge, approach and verified outcomes will be added once project details are supplied."}
        </p>
        <CaseStudyAction project={project} className="mt-6" />
      </div>
    </article>
  );
}

function CaseStudyAction({ project, className }: { project: CaseStudy; className?: string }) {
  if (project.href) {
    return (
      <Link
        href={project.href}
        className={cn("group/link inline-flex items-center gap-2 self-start py-1 font-medium text-ink", className)}
      >
        View case study
        <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-500 ease-editorial group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" strokeWidth={1.75} />
      </Link>
    );
  }
  // No case study page yet — say so rather than linking to a dead route.
  return (
    <p className={cn("inline-flex items-center gap-2 self-start text-[0.9375rem] text-ink-muted", className)}>
      Case study coming soon
    </p>
  );
}

/**
 * Real project imagery when supplied; otherwise abstract concept artwork,
 * clearly labelled so it's never mistaken for client work.
 */
function ProjectVisual({
  project,
  sizes,
  className,
}: {
  project: CaseStudy;
  sizes: string;
  className?: string;
}) {
  const concept = !project.image;
  const src = project.image ?? WORK.conceptArt[project.id];
  return (
    <div
      data-liquid-media
      className={cn("group/visual relative flex items-end overflow-hidden bg-mist p-5", className)}
    >
      {src && (
        <Image
          src={src}
          alt={concept ? "" : `${project.client ?? "Project"} — project imagery`}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1.2s] ease-editorial group-hover/visual:scale-[1.03] motion-reduce:transition-none"
        />
      )}
      {concept && (
        <PlaceholderTag className="relative liquid-glass">
          Concept artwork · project imagery pending
        </PlaceholderTag>
      )}
    </div>
  );
}
