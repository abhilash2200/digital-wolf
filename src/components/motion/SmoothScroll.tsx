"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

/** Desktop wheel/trackpad only. Touch keeps native momentum scrolling. */
const SMOOTH_QUERY = "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger scrubs stay
 * in lockstep with the scroll position.
 *  - `autoToggle` pauses Lenis whenever <html> gets `overflow: hidden` (the
 *    enquiry modal and mobile menu scroll locks), so the page never scrolls
 *    behind an overlay. Their inner scroll areas carry `data-lenis-prevent`.
 *  - Hash links and keyboard/focus scrolling stay native; Lenis re-syncs from
 *    native scroll events.
 * Mounted once in the root layout; fully torn down when it unmounts.
 */
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mq = window.matchMedia(SMOOTH_QUERY);
    let stop: (() => void) | undefined;

    const start = () => {
      const html = document.documentElement;
      // Native smooth scroll-behavior fights Lenis' own easing.
      const prevBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";

      const lenis = new Lenis({ lerp: 0.1, autoRaf: false, autoToggle: true, allowNestedScroll: true });
      const onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
        html.style.scrollBehavior = prevBehavior;
      };
    };

    const apply = () => {
      stop?.();
      stop = mq.matches ? start() : undefined;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      stop?.();
    };
  }, []);

  return null;
}
