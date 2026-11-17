import { useId } from "react";
import type { GlossTexture as Variant } from "@/types/site";

/** Distinct but related abstract line textures for the black gloss cards. */
export function GlossTexture({ variant }: { variant: Variant }) {
  const id = useId();
  const fade = `${id}-fade`;
  const mask = `${id}-mask`;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 size-full"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMaxYMin slice"
    >
      <defs>
        <radialGradient id={fade} cx="85%" cy="10%" r="85%">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={mask}>
          <rect width="400" height="400" fill={`url(#${fade})`} />
        </mask>
      </defs>
      <g
        mask={`url(#${mask})`}
        fill="none"
        stroke="#111111"
        strokeOpacity="0.08"
        strokeWidth="0.8"
      >
        {variant === "strata" && <Strata />}
        {variant === "orbit" && <Orbit />}
        {variant === "grain" && <Grain id={id} />}
        {variant === "mesh" && <Mesh />}
        {variant === "facets" && <Facets />}
        {variant === "pulse" && <Pulse />}
      </g>
    </svg>
  );
}

// Flowing, slightly misaligned layers.
function Strata() {
  return (
    <>
      {Array.from({ length: 22 }, (_, i) => {
        const y = 20 + i * 14;
        const shift = i % 3 === 0 ? 18 : i % 3 === 1 ? -10 : 4;
        return (
          <path
            key={i}
            d={`M-20 ${y} C 90 ${y - 28 + shift}, 210 ${y + 30 - shift}, 420 ${y - 6 + shift}`}
          />
        );
      })}
    </>
  );
}

// Concentric rings radiating from a signal source.
function Orbit() {
  return (
    <>
      {Array.from({ length: 16 }, (_, i) => (
        <circle
          key={i}
          cx="340"
          cy="40"
          r={18 + i * 22}
          strokeDasharray={i % 2 ? "2 6" : undefined}
        />
      ))}
    </>
  );
}

// Fine particle grain with a diagonal fall.
function Grain({ id }: { id: string }) {
  const filter = `${id}-grain`;
  return (
    <>
      <filter id={filter}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.25 -0.05" />
      </filter>
      <rect width="400" height="400" filter={`url(#${filter})`} stroke="none" fill="#111" opacity="0.03" />
      {Array.from({ length: 26 }, (_, i) => (
        <line key={i} x1={i * 18 - 60} y1="-10" x2={i * 18 + 140} y2="420" strokeOpacity="0.06" />
      ))}
    </>
  );
}

// A warped grid.
function Mesh() {
  return (
    <>
      {Array.from({ length: 15 }, (_, i) => (
        <path key={`h${i}`} d={`M0 ${i * 28} Q 200 ${i * 28 + (i % 2 ? 14 : -14)}, 400 ${i * 28 + i * 2}`} />
      ))}
      {Array.from({ length: 15 }, (_, i) => (
        <path key={`v${i}`} d={`M${i * 28} 0 Q ${i * 28 + (i % 2 ? -12 : 12)} 200, ${i * 28 + i * 3} 400`} />
      ))}
    </>
  );
}

// Nested isometric facets — structure and build.
function Facets() {
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => {
        const s = 30 + i * 34;
        const cx = 330;
        const cy = 60;
        return (
          <path
            key={i}
            d={`M${cx} ${cy - s} L${cx + s * 0.87} ${cy - s / 2} L${cx + s * 0.87} ${cy + s / 2} L${cx} ${cy + s} L${cx - s * 0.87} ${cy + s / 2} L${cx - s * 0.87} ${cy - s / 2} Z`}
          />
        );
      })}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        return <line key={`r${i}`} x1="330" y1="60" x2={330 + Math.cos(a) * 420} y2={60 + Math.sin(a) * 420} strokeOpacity="0.1" />;
      })}
    </>
  );
}

// A rising waveform — measured performance.
function Pulse() {
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const base = 60 + i * 26;
        const amp = 6 + i * 2.2;
        let d = `M0 ${base}`;
        for (let x = 0; x <= 400; x += 20) {
          d += ` L${x} ${base - Math.sin(x / 34 + i * 0.6) * amp - x * 0.12}`;
        }
        return <path key={i} d={d} />;
      })}
    </>
  );
}
