import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS } from "@/constants/site";
import Image from "next/image";
import { PHILOSOPHY, SECTION_ART } from "@/constants/content";

export function GrowthPhilosophy() {
  return (
    <section
      id={ANCHORS.approach}
      aria-labelledby="philosophy-heading"
      className="section-y"
    >
      <div className="container-dw grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-6 lg:order-2 lg:pl-8">
          <SectionHeading
            id="philosophy-heading"
            eyebrow={PHILOSOPHY.eyebrow}
            title={PHILOSOPHY.heading}
            intro={PHILOSOPHY.intro}
          />

          <ol data-reveal-group className="mt-12 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-1">
            {PHILOSOPHY.capabilities.map((capability, i) => (
              <li
                key={capability.id}
                data-reveal-item
                className="grid grid-cols-[2.5rem_1fr] gap-x-2 border-b border-line py-6 sm:odd:pr-6 lg:odd:pr-0"
              >
                <span className="text-eyebrow pt-1.5 tabular-nums text-ink-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-card text-ink">{capability.title}</h3>
                  <p className="mt-2 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                    {capability.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-6 lg:order-1">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)]">
            <ConnectedVision />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Four disciplines, drawn as overlapping fields that share one centre.
 * On scroll the fields converge from apart into one shared centre (ScrollChoreography);
 * without JS or with reduced motion it renders in its final, converged state.
 */
function ConnectedVision() {
  const fields = [
    { id: "strategy", dx: -46, dy: -46, cx: 156, cy: 156, label: "Strategy", lx: 40, ly: 40, anchor: "start" },
    { id: "technology", dx: 46, dy: -46, cx: 244, cy: 156, label: "Technology", lx: 360, ly: 40, anchor: "end" },
    { id: "creativity", dx: -46, dy: 46, cx: 156, cy: 244, label: "Creativity", lx: 40, ly: 370, anchor: "start" },
    { id: "performance", dx: 46, dy: 46, cx: 244, cy: 244, label: "Performance", lx: 360, ly: 370, anchor: "end" },
  ] as const;

  return (
    <figure className="relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-[6px] border glass-panel">
      {/* Four liquid forms merging into one — sits beneath the converging fields. */}
      <div data-liquid-media className="absolute inset-0 -z-10 opacity-25">
        <Image
          src={SECTION_ART.approach}
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
      </div>
      <svg
        data-vision
        viewBox="0 0 400 400"
        className="relative size-full"
        role="img"
        aria-labelledby="vision-title"
      >
        <title id="vision-title">
          Strategy, Technology, Creativity and Performance overlapping around one shared centre
        </title>
        <defs>
          <radialGradient id="vision-core" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#111" stopOpacity="0.12" />
            <stop offset="1" stopColor="#111" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Fine guide grid */}
        <g stroke="#111" strokeOpacity="0.06">
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`v${i}`} x1={40 + i * 40} y1="20" x2={40 + i * 40} y2="380" />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`h${i}`} x1="20" y1={40 + i * 40} x2="380" y2={40 + i * 40} />
          ))}
        </g>

        {/* Only the fields move as they converge; labels stay pinned to the corners. */}
        {fields.map((f) => (
          <g key={f.id} data-vision-field data-dx={f.dx} data-dy={f.dy}>
            <circle cx={f.cx} cy={f.cy} r="94" fill="#111" fillOpacity="0.02" stroke="#111" strokeOpacity="0.25" strokeWidth="1" />
            <circle cx={f.cx} cy={f.cy} r="2.5" fill="#111" fillOpacity="0.7" />
          </g>
        ))}
        {fields.map((f) => (
          <text
            key={`${f.id}-label`}
            x={f.lx}
            y={f.ly}
            textAnchor={f.anchor}
            fill="#111"
            fillOpacity="0.75"
            fontSize="11"
            letterSpacing="1.6"
            style={{ textTransform: "uppercase" }}
          >
            {f.label}
          </text>
        ))}

        {/* Shared centre — appears as the fields converge (see ScrollChoreography). */}
        <g data-vision-core>
          <circle cx="200" cy="200" r="70" fill="url(#vision-core)" />
          <circle cx="200" cy="200" r="14" fill="none" stroke="#111" strokeOpacity="0.4" />
          <circle cx="200" cy="200" r="4" fill="#111" />
        </g>
      </svg>
    </figure>
  );
}
