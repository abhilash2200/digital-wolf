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

const isPlaceholder = (project: CaseStudy) => project.client === null;

/**
 * "Ideas Into Execution. Execution Into Impact." The headline's chain is the
 * structure of every case study: the featured brief reads Idea → Execution →
 * Impact in three columns, under a ribbon that runs pearl and twists to
 * ember above Impact. Supporting projects sit as a staggered editorial pair.
 * ScrollChoreography (data-work*) unfurls the ribbon and draws the column
 * rules in order. Markup is the final state: no JS / reduced motion shows
 * everything.
 */
export function CaseStudies() {
  const [second, third] = WORK.supporting;
  return (
    <section id={ANCHORS.work} aria-labelledby="work-heading" className="section-y">
      <div className="container-dw">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <SectionHeading
            id="work-heading"
            eyebrow={WORK.eyebrow}
            title={WORK.heading}
            className="lg:col-span-8"
          />
          {isPlaceholder(WORK.featured) && (
            <PlaceholderTag className="justify-self-start lg:col-span-4 lg:justify-self-end">
              Project content pending
            </PlaceholderTag>
          )}
        </div>

        <FeaturedProject project={WORK.featured} />

        {/* Two heights, one shared baseline: the art staggers, the captions align. */}
        <div className="mt-24 grid grid-cols-1 gap-y-20 md:mt-32 lg:grid-cols-12 lg:items-end lg:gap-x-6">
          {second && (
            <ProjectFigure
              project={second}
              index={2}
              aspect="aspect-[4/5]"
              feather="art-feather-y"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="lg:col-span-5"
            />
          )}
          {third && (
            <ProjectFigure
              project={third}
              index={3}
              aspect="aspect-[4/3]"
              feather="art-feather-x"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="lg:col-span-6 lg:col-start-7"
            />
          )}
          <div className="lg:col-span-6 lg:col-start-7">
            <EnquiryButton size="lg" arrow>
              {CTA.heroPrimary}
            </EnquiryButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedProject({ project }: { project: CaseStudy }) {
  const chain: { stage: string; items: [string, string | null][]; impact?: boolean }[] = [
    {
      stage: "Idea",
      items: [
        ["Challenge", project.challenge],
        ["Strategy", project.strategy],
      ],
    },
    {
      stage: "Execution",
      items: [
        ["Delivery", project.execution],
        ["Services", project.services.length ? project.services.join(", ") : null],
      ],
    },
    { stage: "Impact", items: [["Verified outcomes", project.outcomes]], impact: true },
  ];

  return (
    <article data-work aria-labelledby={`case-${project.id}`} className="mt-14 md:mt-20">
      <div data-parallax="28">
        <ProjectVisual
          project={project}
          sizes="(min-width: 1280px) 1280px, 100vw"
          featured
          className="aspect-[4/3] sm:aspect-[2/1] lg:aspect-[3/1]"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 md:mt-10 lg:grid-cols-12 lg:items-end lg:gap-x-6">
        <div className="lg:col-span-8">
          <p className="text-[0.9375rem] text-ink-muted">Featured project</p>
          <h3
            id={`case-${project.id}`}
            className="mt-3 text-[clamp(1.75rem,1.1rem+2vw,2.75rem)] leading-[1.05] font-medium tracking-[-0.025em] text-ink"
          >
            {project.client ?? <Pending label="Client name to be supplied" />}
          </h3>
        </div>
        <p className="text-[0.9375rem] text-ink-muted lg:col-span-4 lg:justify-self-end">
          {project.industry ?? <Pending label="Industry to be supplied" />}
        </p>
      </div>

      {/* The brief, read along the headline's chain. */}
      <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 lg:grid-cols-3 lg:gap-6">
        {chain.map(({ stage, items, impact }) => (
          <div key={stage} className="relative pt-6">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-line">
              <span
                data-work-rule
                className={cn("absolute inset-0 origin-left", impact ? "bg-ember" : "bg-ink/40")}
              />
            </span>
            <h4 className="text-[1.375rem] leading-none font-medium tracking-[-0.02em] text-ink">
              {stage}
            </h4>
            <dl className="mt-6 grid gap-5">
              {items.map(([term, value]) => (
                <div key={term}>
                  <dt className="text-[0.8125rem] text-ink-muted">{term}</dt>
                  <dd className="mt-1.5 max-w-[40ch] text-[0.9375rem] leading-relaxed text-ink">
                    {value ?? <Pending />}
                  </dd>
                </div>
              ))}
            </dl>
            {impact && <CaseStudyAction project={project} className="mt-8" />}
          </div>
        ))}
      </div>
    </article>
  );
}

function ProjectFigure({
  project,
  index,
  aspect,
  feather,
  sizes,
  className,
}: {
  project: CaseStudy;
  index: number;
  aspect: string;
  /** Which way the concept ribbon runs off its frame, so its ends fade, not cut. */
  feather: "art-feather-x" | "art-feather-y";
  sizes: string;
  className?: string;
}) {
  return (
    <article aria-labelledby={`case-${project.id}`} className={className} data-reveal>
      <ProjectVisual project={project} sizes={sizes} feather={feather} className={aspect} />
      <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-line pt-4 text-[0.9375rem] text-ink-muted">
        <span className="tabular-nums">{String(index).padStart(2, "0")}</span>
        <span className="text-right">{project.industry ?? <Pending label="Industry to be supplied" />}</span>
      </div>
      <h3 id={`case-${project.id}`} className="text-card mt-5 text-ink">
        {project.client ?? <Pending label="Client name to be supplied" />}
      </h3>
      <p className="mt-3 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink-muted">
        {project.challenge ??
          "Challenge, approach and verified outcomes will be added once project details are supplied."}
      </p>
      <CaseStudyAction project={project} className="mt-6" />
    </article>
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

/**
 * Real project imagery when supplied; otherwise generated ribbon artwork,
 * clearly labelled so it's never mistaken for client work.
 */
function ProjectVisual({
  project,
  sizes,
  featured = false,
  feather = "art-feather-x",
  className,
}: {
  project: CaseStudy;
  sizes: string;
  /** The wide ribbon: unfurled on scroll. */
  featured?: boolean;
  feather?: "art-feather-x" | "art-feather-y";
  className?: string;
}) {
  const concept = !project.image;
  const src = project.image ?? WORK.conceptArt[project.id];
  return (
    <div className={cn("relative", className)}>
      {src && (
        <div
          data-work-unfurl={featured || undefined}
          data-liquid-media
          className={cn("absolute inset-0", concept && feather)}
        >
          <Image
            src={src}
            alt={concept ? "" : `${project.client ?? "Project"} — project imagery`}
            fill
            sizes={sizes}
            // The artwork's twist sits right of centre; keep it in narrow crops.
            className={cn("object-cover", featured && "object-[62%_30%]")}
          />
        </div>
      )}
      {concept && (
        <PlaceholderTag className="absolute bottom-0 left-0 liquid-glass">
          Concept artwork · project imagery pending
        </PlaceholderTag>
      )}
    </div>
  );
}
