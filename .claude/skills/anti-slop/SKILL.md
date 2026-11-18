---
name: anti-slop
description: Anti-"AI slop" frontend rules for the Digital Wolf site. Load before building or restyling any UI (sections, cards, buttons, layout, motion, copy placement) and before reviewing frontend work, so the result reads as a hand-crafted light editorial agency site, not a generic AI/SaaS template.
---

# Anti-slop frontend — Digital Wolf

Goal: every screen should look like a senior designer at a small, confident agency made it by hand. If a choice is what an AI template would do by default, stop and pick deliberately.

Read `CLAUDE.md` first: its hard rules (frontend only, demo form, never invent content, approved copy word for word) override anything here.

## 1. Decide before you code
Write 3 lines (in your head or the reply) before touching JSX:
- **Job of this section**: what the visitor should understand or do.
- **One idea that makes it memorable**: a layout move, a type moment, a piece of artwork. Exactly one.
- **What you are leaving out.**

## 2. Banned defaults (the "slop tells")
- Blue/purple/teal gradients, gradient text, neon glows, glowing orbs. Our palette is warm white, ink, greys, silver only.
- Three identical cards in a row with icon + title + two lines. Vary size, span, rhythm or content type.
- Every element rounded the same (`rounded-2xl` everywhere). Radii here are small (4–8px) except pills and the header capsule.
- Emoji, generic lucide icons as decoration, "sparkles", robots, circuit boards, brains, literal wolves.
- Centered everything. Prefer the 12-column editorial grid with asymmetric spans (5/7, 4/8, offset starts).
- Fake social proof: invented logos, "Trusted by 500+ companies", star ratings, made-up stats, lorem testimonials. Use `PlaceholderTag`.
- Filler copy: "Unlock", "Elevate", "Seamless", "Supercharge", "Next-level", "In today's fast-paced world". Use the approved copy.
- Drop shadows that are big, grey and soft on everything. Shadows here are hairline + low, tinted with ink at ≤0.16 alpha.
- Hover-only information, bouncy springs on everything, animating every element on scroll.
- Dark mode sneaking in: no dark sections, no black cards. The site is fully light liquid glass.

## 3. What "good" looks like here
- **Type does the heavy lifting.** Use the `text-display|section|card|body|eyebrow` utilities. Big confident headings, tight tracking, generous measure limits (`max-w-[14ch]` headings, `max-w-[44ch]` body). One weight change per block at most.
- **Whitespace is a feature.** Respect `section-y` and `container-dw`; don't pack sections.
- **Light liquid glass, used with restraint.** Surfaces: `gloss-card` (cards), `glass-panel` (panels), `liquid-bar` (full-width bars), `liquid-glass` (pills/buttons). Glass needs something behind it: the `liquid-ambient` layer or artwork. Never stack glass on glass on glass.
- **Distinct artwork over icons.** Each card gets its own abstract texture (`GlossTexture`) or art from `public/images/art/`.
- **One accent move per section**, e.g. a hairline rule, an oversized index number, an offset image, a single black CTA. Not all of them.
- **Black is for the primary action.** One black button per view; secondary actions are `glass` or `secondary`.
- **Motion has a reason.** GSAP via data attributes in `ScrollChoreography`; reveals once, ≤700ms, editorial ease; nothing under reduced motion; the hero stays still.

## 4. Self-review checklist (run before saying "done")
1. Could this section be pasted into any SaaS template unchanged? If yes, redo the one idea.
2. Any banned default from §2 present? Remove it.
3. Is all copy approved or clearly labelled placeholder? Nothing invented?
4. Does it hold at 320, 375, 768, 1024, 1440 widths with no overflow (check element bounds; `html` clips overflow-x)?
5. Keyboard: visible focus, logical order, no hover-only content. Contrast ≥ 4.5:1 for body text on glass.
6. `npm run lint`, `npm run typecheck`, `npm run build` actually run and pass. Report honestly.
