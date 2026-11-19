"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { LIQUID_QUERY } from "@/lib/liquid";
import { useLiquidLens } from "@/hooks/useLiquidLens";

/**
 * A drop of liquid glass that rests on the hero headline and lags behind the
 * pointer, bending the type and sculpture beneath it (true refraction on Chromium,
 * frosted elsewhere). Desktop + fine pointer + motion allowed only; renders
 * nothing on the server, on touch devices and under reduced motion.
 */
export function HeroLens() {
  const [enabled, setEnabled] = useState(false);
  const lensRef = useLiquidLens<HTMLDivElement>(enabled);
  const areaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(LIQUID_QUERY);
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const lens = lensRef.current;
    const area = areaRef.current?.parentElement;
    if (!enabled || !lens || !area) return;

    // Resting spot: over the headline, where bending black type reads best.
    const rest = () => ({ x: area.clientWidth * 0.34, y: area.clientHeight * 0.3 });
    const start = rest();
    gsap.set(lens, { x: start.x, y: start.y, xPercent: -50, yPercent: -50 });
    const moveX = gsap.quickTo(lens, "x", { duration: 1.1, ease: "power3.out" });
    const moveY = gsap.quickTo(lens, "y", { duration: 1.1, ease: "power3.out" });
    const float = gsap.to(lens, { rotate: 10, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const intro = gsap.fromTo(lens, { scale: 0 }, { scale: 1, duration: 1.2, ease: "elastic.out(1, 0.6)", delay: 1.4 });

    // The lens plays over the headline only; it never sits on the CTAs.
    const heading = area.querySelector("h1");
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = area.getBoundingClientRect();
      const limit = heading ? heading.getBoundingClientRect().bottom + 48 : Infinity;
      if (event.clientY > limit) return onLeave();
      moveX(event.clientX - rect.left);
      moveY(event.clientY - rect.top);
    };
    const onLeave = () => {
      const r = rest();
      moveX(r.x);
      moveY(r.y);
    };
    area.addEventListener("pointermove", onMove, { passive: true });
    area.addEventListener("pointerleave", onLeave);

    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      float.kill();
      intro.kill();
      gsap.killTweensOf(lens);
    };
  }, [enabled, lensRef]);

  return (
    <div ref={areaRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      {enabled && (
        <div
          ref={lensRef}
          data-liquid-glass
          data-liquid-bezel="46"
          data-liquid-strength="30"
          className="liquid-glass hero-lens absolute top-0 left-0 size-[168px] rounded-full"
        />
      )}
    </div>
  );
}
