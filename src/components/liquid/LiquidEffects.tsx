"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  LIQUID_QUERY,
  createLensFilter,
  createLiquidFilter,
  supportsLiquidRefraction,
  type LiquidFilter,
} from "@/lib/liquid";

/**
 * Desktop-only liquid layer (fine pointer, motion allowed):
 *  - sets html[data-liquid] (+ [data-refract] on Chromium) so CSS can opt in
 *  - real refraction lenses for every [data-liquid-glass] element
 *  - cursor-following specular highlight on glass
 *  - liquid ripple when hovering [data-liquid-media]
 *  - fluid cursor trail (lazy-loaded after idle)
 * Phones, tablets and reduced-motion users get none of it.
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
  const refract = supportsLiquidRefraction();
  html.dataset.liquid = "on";
  if (refract) html.dataset.refract = "on";

  // --- Refraction lenses, kept in sync with each glass element's size ---
  const lenses = new Map<HTMLElement, ReturnType<typeof createLensFilter>>();
  const resize = new ResizeObserver((entries) => {
    for (const entry of entries) lenses.get(entry.target as HTMLElement)?.rebuild();
  });
  const scan = () => {
    if (!refract) return;
    document.querySelectorAll<HTMLElement>("[data-liquid-glass]").forEach((node) => {
      if (lenses.has(node)) return;
      const lens = createLensFilter(node, {
        bezel: Number(node.dataset.liquidBezel) || 22,
        strength: Number(node.dataset.liquidStrength) || 38,
      });
      node.style.setProperty("--lens", `url(#${lens.id})`);
      lenses.set(node, lens);
      resize.observe(node);
    });
    for (const [node, lens] of lenses) {
      if (node.isConnected) continue;
      lens.remove();
      resize.unobserve(node);
      lenses.delete(node);
    }
  };
  const hasIdle = typeof window.requestIdleCallback === "function";
  const firstScan = hasIdle ? window.requestIdleCallback(scan, { timeout: 1500 }) : 0;
  if (!hasIdle) scan();
  let scanFrame = 0;
  const mutations = new MutationObserver(() => {
    cancelAnimationFrame(scanFrame);
    scanFrame = requestAnimationFrame(scan);
  });
  mutations.observe(document.body, { childList: true, subtree: true });

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
    mutations.disconnect();
    resize.disconnect();
    cancelAnimationFrame(scanFrame);
    for (const [node, lens] of lenses) {
      node.style.removeProperty("--lens");
      lens.remove();
    }
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerover", onPointerOver);
    if (hasIdle) {
      window.cancelIdleCallback(firstScan);
    }
  };
}
