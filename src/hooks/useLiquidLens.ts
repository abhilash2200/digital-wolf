"use client";

import { useEffect, useRef } from "react";
import { LIQUID_QUERY, attachLens, supportsLiquidRefraction } from "@/lib/liquid";

/**
 * Attach a liquid-glass refraction lens to the returned ref's element.
 *
 * Runs from the element's own effect, i.e. only after React has hydrated it.
 * (A global DOM scan used to write `style="--lens:…"` onto elements that were
 * still hydrating, which caused a hydration-mismatch error.)
 * Desktop + fine pointer + motion allowed + Chromium only; no-op elsewhere.
 */
export function useLiquidLens<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!enabled || !node || !supportsLiquidRefraction()) return;
    const mq = window.matchMedia(LIQUID_QUERY);
    let detach: (() => void) | undefined;
    const apply = () => {
      detach?.();
      detach = mq.matches ? attachLens(node) : undefined;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      detach?.();
    };
  }, [enabled]);

  return ref;
}
