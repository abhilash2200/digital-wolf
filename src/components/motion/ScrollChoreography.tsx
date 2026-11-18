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
 *   data-process / data-process-step|riser|tread|rail|node  staircase drawing
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
          // data-reveal-group="mobile": desktop has its own choreography for it.
          if (desktop && group.dataset.revealGroup === "mobile") return;
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

        // Hero hand-off (desktop): the headline lines slide apart in opposite
        // directions while the sculpture sinks and turns away. Scrubbed, so it
        // reverses on scroll up. The one choreographed moment on the page.
        if (desktop) {
          const hero = document.querySelector<HTMLElement>("[data-hero-visual]")?.closest("section");
          if (hero) {
            const out = { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 };
            gsap.utils.toArray<HTMLElement>("[data-hero-line]", hero).forEach((line, i) => {
              const dir = Number(line.dataset.heroLine) || 1;
              gsap.to(line, { xPercent: dir * (9 + i * 3), ease: "none", scrollTrigger: out });
            });
            gsap.to("[data-hero-visual]", { y: 160, scale: 0.84, rotate: -6, ease: "none", scrollTrigger: out });
          }
        }

        // Problems (desktop): pin the stage; the cards go from a tilted pile to a
        // neat row (scattered → structured), then an ember line threads their
        // nodes (connected). Scrubbed both ways. Markup is the final state.
        if (desktop) {
          const problems = document.querySelector<HTMLElement>("[data-problems]");
          const stage = problems?.querySelector<HTMLElement>("[data-problems-stage]");
          if (problems && stage) {
            const cards = gsap.utils.toArray<HTMLElement>("[data-problem-card]", problems);
            const nodes = problems.querySelectorAll("[data-problem-node]");
            const line = problems.querySelector("[data-problems-line]");
            // Pile toward the row's centre, each at its own tilt and height.
            const pile = [
              { xPercent: 118, y: 46, rotate: -9 },
              { xPercent: 36, y: -18, rotate: 6 },
              { xPercent: -38, y: 34, rotate: -4 },
              { xPercent: -122, y: -10, rotate: 10 },
            ];
            const tl = gsap.timeline({
              defaults: { ease: "power2.inOut" },
              scrollTrigger: { trigger: stage, start: "top top", end: "+=130%", pin: true, scrub: 0.8, anticipatePin: 1, refreshPriority: 1 },
            });
            cards.forEach((card, i) => {
              tl.from(card, { ...pile[i % pile.length], duration: 1 }, i * 0.06);
            });
            if (line) tl.from(line, { scaleX: 0, duration: 0.6, ease: "none" }, 1.05);
            tl.from(nodes, { scale: 0.4, duration: 0.2, stagger: 0.14, ease: "back.out(3)" }, 1.05);
            tl.to(nodes, { backgroundColor: "#ff5a1f", duration: 0.15, stagger: 0.14 }, 1.12);
            tl.to({}, { duration: 0.25 }); // brief hold on the connected row before release
          }
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

        // Growth philosophy: four glass discs start apart and converge on one
        // centre, where the ember core grows.
        // Desktop scrubs with scroll; mobile plays once (no long scroll sequences).
        gsap.utils.toArray<HTMLElement>("[data-vision]").forEach((vision) => {
          const fields = vision.querySelectorAll<HTMLElement>("[data-vision-field]");
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
                xPercent: Number(field.dataset.dx) * spread,
                yPercent: Number(field.dataset.dy) * spread,
                opacity: 0.5,
                duration: desktop ? 1 : 1.2,
              },
              0,
            );
          });
          if (core) {
            tl.from(core, { scale: 0.3, opacity: 0, transformOrigin: "50% 50%", duration: 0.6 }, desktop ? 0.4 : 0.6);
          }
        });

        // Process: one hairline climbs the staircase (riser, then tread) and
        // each stage's node turns from a hollow ring to ember as it's reached.
        // Desktop scrubs with scroll; mobile draws the rail once.
        const unlit = { backgroundColor: "#f8f8f6", borderColor: "rgba(17,17,17,0.3)" };
        // An ember spark rides the tip of the line; its coordinates are read
        // from layout (relative to the <ol>) and re-read on every refresh.
        gsap.utils.toArray<HTMLElement>("[data-process]").forEach((process) => {
          const spark = process.querySelector<HTMLElement>("[data-process-spark]");
          if (desktop) {
            const steps = gsap.utils.toArray<HTMLElement>("[data-process-step]", process);
            if (!steps.length || alreadyPassed(steps[0])) return;
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              // The climb runs up-screen against the scroll, so key it to the
              // lowest step (Discover) rising through the viewport.
              scrollTrigger: {
                trigger: steps[0],
                start: "top 85%",
                end: "top 35%",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            });
            if (spark) {
              tl.set(spark, { x: () => steps[0].offsetLeft, y: () => steps[0].offsetTop }, 0);
              tl.to(spark, { opacity: 1, duration: 0.1 }, 0);
            }
            steps.forEach((step) => {
              const riser = step.querySelector<HTMLElement>("[data-process-riser]");
              const tread = step.querySelector("[data-process-tread]");
              const node = step.querySelector("[data-process-node]");
              const x = () => step.offsetLeft;
              const y = () => step.offsetTop;
              if (riser) {
                tl.from(riser, { scaleY: 0, duration: 0.45 });
                if (spark) tl.to(spark, { x, y, duration: 0.45 }, "<");
              }
              if (node) tl.from(node, { ...unlit, scale: 0.7, duration: 0.12 });
              if (tread) {
                tl.from(tread, { scaleX: 0, duration: 1 });
                if (spark) tl.to(spark, { x: () => step.offsetLeft + step.offsetWidth, y, duration: 1 }, "<");
              }
            });
            if (spark) tl.to(spark, { opacity: 0, scale: 0.4, duration: 0.15 });
          } else {
            const rail = process.querySelector<HTMLElement>("[data-process-rail]");
            const track = rail?.parentElement;
            const nodes = process.querySelectorAll("[data-process-node]");
            const tl = gsap.timeline({ scrollTrigger: { trigger: process, start: "top 80%", once: true } });
            if (rail) tl.from(rail, { scaleY: 0, duration: 1.2, ease: "power2.inOut" });
            if (spark && track) {
              tl.set(spark, { x: track.offsetLeft, y: track.offsetTop }, 0);
              tl.to(spark, { opacity: 1, duration: 0.15 }, 0);
              tl.to(spark, { y: track.offsetTop + track.offsetHeight, duration: 1.2, ease: "power2.inOut" }, 0);
              tl.to(spark, { opacity: 0, scale: 0.4, duration: 0.3 });
            }
            tl.from(nodes, { ...unlit, duration: 0.3, stagger: 0.25 }, 0.15);
          }
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
