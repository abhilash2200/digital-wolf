"use client";

import { useEffect } from "react";
import {
  LIQUID_QUERY,
  createLiquidFilter,
  supportsLiquidRefraction,
  type LiquidFilter,
} from "@/lib/liquid";

/**
 * Desktop-only liquid layer (fine pointer, motion allowed):
 *  - sets html[data-liquid] (+ [data-refract] on Chromium) so CSS can opt in
 *  - cursor-following specular highlight on [data-liquid-glass] elements
 *  - liquid ripple when hovering [data-liquid-media]
 * Refraction lenses are attached per element by `useLiquidLens`, after that
 * element hydrates. Phones, tablets and reduced-motion users get none of it.
 */
export function LiquidEffects() {
  useEffect(() => {
    const mq = window.matchMedia(LIQUID_QUERY);
    let teardown: (() => void) | undefined;

    const apply = () => {
      teardown?.();
      teardown = undefined;
      if (mq.matches) teardown = enable();
    };

    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      teardown?.();
    };
  }, []);

  return null;
}

function enable() {
  const html = document.documentElement;
  html.dataset.liquid = "on";
  if (supportsLiquidRefraction()) html.dataset.refract = "on";

  // --- Specular highlight that follows the cursor across glass ---
  const onPointerMove = (event: PointerEvent) => {
    const glass = (event.target as Element | null)?.closest?.<HTMLElement>("[data-liquid-glass]");
    if (!glass) return;
    const rect = glass.getBoundingClientRect();
    glass.style.setProperty("--gx", `${event.clientX - rect.left}px`);
    glass.style.setProperty("--gy", `${event.clientY - rect.top}px`);
  };
  document.addEventListener("pointermove", onPointerMove, { passive: true });

  // --- Liquid ripple on media hover ---
  const ripples = new WeakMap<HTMLElement, LiquidFilter>();
  let gsapModule: typeof import("gsap") | null = null;
  void import("gsap").then((m) => (gsapModule = m));
  const onPointerOver = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || !gsapModule) return;
    const media = (event.target as Element | null)?.closest?.<HTMLElement>("[data-liquid-media]");
    if (!media || media.contains(event.relatedTarget as Node | null)) return;
    let filter = ripples.get(media);
    if (!filter) {
      filter = createLiquidFilter("0.006 0.018");
      ripples.set(media, filter);
    }
    const { gsap } = gsapModule;
    const filterId = filter.id;
    media.style.filter = `url(#${filterId})`;
    gsap.killTweensOf(filter.displacement);
    gsap.fromTo(
      filter.displacement,
      { attr: { scale: 0 } },
      {
        attr: { scale: 26 },
        duration: 0.45,
        ease: "sine.out",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          if (media.style.filter.includes(filterId)) media.style.filter = "";
        },
      },
    );
  };
  document.addEventListener("pointerover", onPointerOver, { passive: true });

  return () => {
    delete html.dataset.liquid;
    delete html.dataset.refract;
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerover", onPointerOver);
  };
}
