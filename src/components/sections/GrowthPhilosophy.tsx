import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ANCHORS } from "@/constants/site";
import { PHILOSOPHY } from "@/constants/content";

/**
 * "Different Disciplines. One Connected Vision." Four liquid-glass discs —
 * one per discipline — overlap over a pearl/ember ribbon whose twist sits
 * exactly at the shared centre (scripts/art/pearl-ribbon.html, seed 6.104). On scroll they
 * converge (ScrollChoreography: data-vision*). The frost inside each disc is
 * a pre-blurred copy of the ribbon (vision-ribbon-frost.webp), kept in
 * register as the disc moves — a live backdrop-filter was too costly.
 * Hovering a discipline in the
 * list lights its disc (pure CSS :has(), see .vision in globals.css).
 * Without JS / reduced motion the diagram renders converged.
 */
export function GrowthPhilosophy() {
  return (
    <section
      id={ANCHORS.approach}
      aria-labelledby="philosophy-heading"
      className="vision section-y"
    >
      <div className="container-dw grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-x-6">
        <div className="lg:order-2 lg:col-span-5 lg:col-start-8">
          <SectionHeading
            id="philosophy-heading"
            eyebrow={PHILOSOPHY.eyebrow}
            title={PHILOSOPHY.heading}
            intro={PHILOSOPHY.intro}
          />

          <ul data-reveal-group className="mt-10 border-t border-line">
            {PHILOSOPHY.capabilities.map((capability) => (
              <li
                key={capability.id}
                data-reveal-item
                data-cap={capability.id}
                className="group border-b border-line py-5"
              >
                <h3 className="flex items-center text-card text-ink">
                  <span
                    aria-hidden="true"
                    className="mr-0 h-0.5 w-0 rounded-full bg-ember transition-[width,margin] duration-500 ease-editorial group-hover:mr-3 group-hover:w-6"
                  />
                  {capability.title}
                </h3>
                <p className="mt-2 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                  {capability.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* The whole diagram drifts (parallax) so the ribbon and the frost
            baked into each disc never slide out of register. */}
        <div data-parallax="24" className="lg:order-1 lg:col-span-6">
          <ConnectedVision />
        </div>
      </div>
    </section>
  );
}

// Disc centres sit on a small square around the middle; dx/dy (in % of the
// disc) is how far apart each starts before converging. Discs are 60% of the
// figure, inset 6% from its edges (so 34% from the far edge); `frost` places
// each disc's baked frost (a figure-sized, pre-blurred copy of the ribbon) so
// it lines up with the ribbon behind: −offset / 60%.
const NEAR = "-10%"; // 6% / 60%
const FAR = "-56.6667%"; // 34% / 60%
const DISCS = [
  { id: "strategy", label: "Strategy", pos: "left-[6%] top-[6%]", labelPos: "top-[24%] left-[20%]", dx: -34, dy: -34, frost: { left: NEAR, top: NEAR } },
  { id: "technology", label: "Technology", pos: "right-[6%] top-[6%]", labelPos: "top-[24%] right-[20%] text-right", dx: 34, dy: -34, frost: { left: FAR, top: NEAR } },
  { id: "creativity", label: "Creativity", pos: "left-[6%] bottom-[6%]", labelPos: "bottom-[24%] left-[20%]", dx: -34, dy: 34, frost: { left: NEAR, top: FAR } },
  { id: "performance", label: "Performance", pos: "right-[6%] bottom-[6%]", labelPos: "bottom-[24%] right-[20%] text-right", dx: 34, dy: 34, frost: { left: FAR, top: FAR } },
] as const;

function ConnectedVision() {
  return (
    <figure
      data-vision
      className="vision-figure relative mx-auto aspect-square w-full max-w-[600px]"
      aria-labelledby="vision-caption"
    >
      <figcaption id="vision-caption" className="sr-only">
        Strategy, Technology, Creativity and Performance overlapping around one shared centre
      </figcaption>

      {/* The material behind the glass: the ribbon twists where all four meet. */}
      <div aria-hidden="true" className="vision-ribbon absolute inset-0">
        <Image
          src="/images/art/vision-ribbon.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="-translate-x-[8%] object-cover"
        />
      </div>

      {/* Shared centre: an ember glow that grows as the disciplines meet. */}
      <div data-vision-core aria-hidden="true" className="vision-core absolute inset-[30%] rounded-full" />

      {DISCS.map((disc) => (
        <div
          key={disc.id}
          aria-hidden="true"
          data-vision-field
          data-disc={disc.id}
          data-dx={disc.dx}
          data-dy={disc.dy}
          className={`glass-disc absolute size-[60%] rounded-full ${disc.pos}`}
        >
          {/* Baked frost: no live backdrop-filter (it cost ~half the frame rate
              while the discs move); counter-moved with the disc in
              ScrollChoreography so it stays in register with the ribbon. */}
          <span data-vision-frost className="vision-frost" style={disc.frost} />
          <span className={`absolute text-[0.9375rem] font-medium text-ink ${disc.labelPos}`}>
            {disc.label}
          </span>
        </div>
      ))}

      {/* The point where all four meet. */}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper bg-ember shadow-[0_0_0_6px_rgb(255_90_31/0.18)]"
      />
    </figure>
  );
}
