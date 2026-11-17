"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LIQUID_QUERY, createLiquidFilter } from "@/lib/liquid";

/**
 * Homepage scroll choreography. Sections opt in with data attributes, so they
 * stay server components:
 *
 *   data-reveal                  fade/rise in once when it enters
 *   data-reveal-group            container whose [data-reveal-item]s stagger in
 *   data-parallax="<px>"         desktop-only drift while scrolling past
 *   data-vision / data-vision-field / data-vision-core   converging diagram
 *   data-process / data-process-line / data-process-node timeline drawing
 *
 * Animation ownership: GSAP owns transform/opacity on these elements. Motion is
 * used only for the mobile menu; CSS only for hover/focus on other properties.
 * Content is fully visible without JS and under prefers-reduced-motion.
 *
 * Reveals use opacity, never visibility/autoAlpha: not-yet-revealed content must
 * stay in the accessibility tree and keyboard-focusable.
 */
export function ScrollChoreography() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(
      // matchMedia only runs the callback when at least one condition matches,
      // so mobile needs its own entry.
      {
        desktop: "(min-width: 1024px)",
        mobile: "(max-width: 1023.98px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { desktop, reduce } = context.conditions as { desktop: boolean; reduce: boolean };
        if (reduce) return;

        // Mobile gets shorter distances and quicker, simpler motion.
        const rise = desktop ? 44 : 22;
        const duration = desktop ? 1.1 : 0.75;
        const ease = "expo.out";

        // Don't hide things the visitor has already scrolled past (e.g. after
        // a hash jump or returning to the page).
        const alreadyPassed = (el: Element) => el.getBoundingClientRect().bottom < 0;

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          if (alreadyPassed(el)) return;
          gsap.from(el, {
            opacity: 0,
            y: rise,
            duration,
            ease,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
          const items = gsap.utils
            .toArray<HTMLElement>(group.querySelectorAll("[data-reveal-item]"))
            .filter((el) => !alreadyPassed(el));
          if (!items.length) return;
          gsap.from(items, {
            opacity: 0,
            y: rise * 1.2,
            duration,
            ease,
            stagger: desktop ? 0.09 : 0.06,
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          });
        });

        // Liquid reveal (desktop, fine pointer): headings and artwork melt into
        // place through a displacement filter that settles to crisp, then the
        // filter is removed so it costs nothing afterwards.
        const liquidCleanup: (() => void)[] = [];
        if (desktop && window.matchMedia(LIQUID_QUERY).matches) {
          gsap.utils.toArray<HTMLElement>("main h2[id], main [data-liquid-media]").forEach((el) => {
            if (alreadyPassed(el)) return;
            const filter = createLiquidFilter("0.01 0.03", 90);
            el.style.filter = `url(#${filter.id})`;
            const done = () => {
              // Compare by id: browsers normalise url(#x) to url("#x").
              if (el.style.filter.includes(filter.id)) el.style.filter = "";
              filter.remove();
            };
            liquidCleanup.push(done);
            gsap.to(filter.displacement, {
              attr: { scale: 0 },
              duration: 1.6,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
              onComplete: done,
            });
          });
        }

        if (desktop) {
          gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
            const distance = Number(el.dataset.parallax) || 40;
            gsap.fromTo(
              el,
              { y: distance },
              {
                y: -distance,
                ease: "none",
                scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
              },
            );
          });
        }

        // Growth philosophy: four fields start apart and converge on one centre.
        // Desktop scrubs with scroll; mobile plays once (no long scroll sequences).
        gsap.utils.toArray<SVGElement>("[data-vision]").forEach((vision) => {
          const fields = vision.querySelectorAll<SVGGElement>("[data-vision-field]");
          const core = vision.querySelector("[data-vision-core]");
          const spread = desktop ? 1 : 0.55;
          const tl = gsap.timeline({
            scrollTrigger: desktop
              ? { trigger: vision, start: "top 85%", end: "center 50%", scrub: 0.8 }
              : { trigger: vision, start: "top 80%", once: true },
            defaults: { ease: desktop ? "none" : "power3.out" },
          });
          fields.forEach((field) => {
            tl.from(
              field,
              {
                x: Number(field.dataset.dx) * spread,
                y: Number(field.dataset.dy) * spread,
                opacity: 0.35,
                duration: desktop ? 1 : 1.2,
              },
              0,
            );
          });
          if (core) {
            tl.from(core, { scale: 0.3, opacity: 0, transformOrigin: "50% 50%", duration: 0.6 }, desktop ? 0.4 : 0.6);
          }
        });

        // Process: draw the timeline, then light up each stage node.
        gsap.utils.toArray<HTMLElement>("[data-process]").forEach((process) => {
          const line = process.querySelector("[data-process-line]");
          const nodes = process.querySelectorAll("[data-process-node]");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: process, start: "top 80%", once: true },
          });
          if (line) {
            tl.from(line, {
              scaleX: desktop ? 0 : 1,
              scaleY: desktop ? 1 : 0,
              transformOrigin: desktop ? "0% 50%" : "50% 0%",
              duration: desktop ? 1.4 : 1,
              ease: "power2.inOut",
            });
          }
          tl.from(
            nodes,
            { scale: 0.2, opacity: 0, duration: 0.5, ease: "back.out(2)", stagger: desktop ? 0.28 : 0.2 },
            0.2,
          );
        });

        return () => liquidCleanup.forEach((fn) => fn());
      },
    );

    // Keyboard users can tab into content before its reveal has triggered;
    // finish any pending reveal so focus never lands on something invisible.
    const onFocusIn = (event: FocusEvent) => {
      let el = event.target instanceof Element ? event.target : null;
      while (el) {
        if (el.matches("[data-reveal],[data-reveal-item],[data-process-node]")) {
          gsap.getTweensOf(el).forEach((tween) => {
            tween.scrollTrigger?.disable(false);
            tween.progress(1);
          });
        }
        el = el.parentElement;
      }
    };
    document.addEventListener("focusin", onFocusIn);

    // Content above can change height (FAQ accordion, fonts, images);
    // keep trigger positions accurate.
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    observer.observe(document.body);

    return () => {
      document.removeEventListener("focusin", onFocusIn);
      observer.disconnect();
      cancelAnimationFrame(frame);
      mm.revert();
    };
  }, []);

  return null;
}
