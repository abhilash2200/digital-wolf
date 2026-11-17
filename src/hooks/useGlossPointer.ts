import type { PointerEvent } from "react";

/**
 * Pointer-responsive lighting for `.gloss-card` surfaces. Mouse only — touch
 * keeps the static sheen. Writes CSS variables, so no React re-render.
 */
export function useGlossPointer() {
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
    e.currentTarget.style.setProperty("--glow", "1");
  };
  const onPointerLeave = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.removeProperty("--mx");
    e.currentTarget.style.removeProperty("--my");
    e.currentTarget.style.removeProperty("--glow");
  };
  return { onPointerMove, onPointerLeave };
}
