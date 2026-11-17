# Digital Wolf — Marketing Website (Frontend Only)

The full spec is in `digital-wolf-frontend-claude-code.md`. Read the relevant section before building any part of the site. This file holds the rules that apply everywhere.

## What we're building
A polished, conversion-focused marketing site for **Digital Wolf**, a **Full-Service Digital Agency** (strategy, technology, creativity and performance marketing). The audience is SMEs, established businesses and startups. The look is a light, corporate editorial style. It must not look like a generic AI or SaaS template.

## Hard rules
- **Frontend only.** No backend APIs, server actions for leads, database, auth, CRM, email or SMS, payments, or server-side analytics.
- **The enquiry form is a demo.** It validates in the browser (RHF + Zod) and then shows a success state that says plainly *"this is a frontend demo, no enquiry was sent"*. It makes no network requests and no fake API calls, stores nothing, and never logs form values. Keep the UI, the validation schema and the submit handler separate so a real handler can be dropped in later.
- **Never invent content.** No made-up client names or logos, testimonials, statistics, case-study results, awards, addresses, ratings or partnerships. Use placeholders that are clearly labelled for replacement. Footer contact and social links appear only if they are supplied. Privacy and Terms are marked "pending", not linked to routes that don't exist.
- **Use the approved copy word for word**: section headlines, hero copy and CTA labels from spec §5 and §7.
- **Don't claim checks passed unless you ran them.** If a lint, typecheck or build script is missing, say so.

## Project location & commands
- The app is in `digital-wolf/` and uses **npm** (`package-lock.json`). Next 16.4.6 with Turbopack, React 19.3, Tailwind v4 (CSS-first `@theme` in `src/app/globals.css`, no tailwind config file).
- `npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck` (runs `next typegen && tsc`, because `LayoutProps`/`PageProps` are generated types).
- Cache Components and Partial Prefetching are on (scaffold defaults). Routes are wrapped in React `<Activity>`, so effects must clean up fully.
- `digital-wolf/AGENTS.md`: this Next version differs from training data. Read `node_modules/next/dist/docs/` before using Next APIs.
- Design tokens are Tailwind theme colours (`paper`, `surface`, `ink`, `ink-muted`, `mist`, `gloss`, `silver`, `line`) plus custom utilities (`container-dw`, `section-y`, `text-display|section|card|body|eyebrow`, `gloss-card`). Use `cn()` from `@/lib/cn`, which knows the custom text utilities.
- Approved copy lives in `src/constants/site.ts`.
- The font is General Sans (variable, self-hosted in `src/fonts`, ITF Free Font License).
- Hero 3D: `components/three/*`. `HeroVisual` handles capability detection, the fallback and visibility pausing. Append `?webgl=0` to the URL to force the static fallback. The fallback image `public/images/hero-sculpture.webp` is a render of the scene's initial pose: re-capture it if the sculpture changes.
- Use `THREE.NeutralToneMapping` (ACES greys the glass) and `StudioEnvironment` (PMREM); drei `<Environment>` didn't light the glass on a real GPU.
- Page copy lives in `src/constants/content.ts`; nav, CTA labels and site settings are in `site.ts`. Missing facts are `null`/empty and render with `PlaceholderTag`/`Pending`. Fill them with real content only.
- Internal links use `SmartLink` (`@/components/ui/SmartLink`), not `next/link`. It keeps `/#section` links as same-page hash jumps on `/`, which otherwise break when the URL has a query string.
- shadcn: `components.json` uses the `base-nova` style on Base UI. `npx shadcn@4.23.0 add <name>` writes `import { cn } from "cn"`: change that to `@/lib/cn`, and never install the `cn` npm package. Restyle every added component to the brand. Its semantic tokens (`background`, `primary`, `border` and so on) are mapped onto the palette in `globals.css`. Don't let shadcn init overwrite `globals.css` or `layout.tsx`.
- Under Cache Components, `new Date()` must be inside a `'use cache'` function (see `CopyrightYear` in `Footer.tsx`).
- Enquiry form (demo only):
  - `lib/enquiry/schema.ts` holds the Zod schema and service options.
  - `lib/enquiry/submit.ts` is the **only** submit seam. It does nothing: no network, storage or logging. A future backend replaces this one function.
  - `components/forms/ContactForm.tsx` is the UI, with `modal` and `page` variants. Submit stays disabled until hydration so a native GET can't put personal data in the URL.
  - `EnquiryProvider` (in the root layout) owns the modal. Use `EnquiryButton` for CTAs, or `useEnquiry().openEnquiry(serviceId)`. It's a real link to `/contact?service=…` as the fallback.
  - On touch devices the modal opens with focus on its title, so the keyboard doesn't pop up.
- Motion:
  - `components/motion/ScrollChoreography.tsx` (mounted once in `page.tsx`) runs all scroll animation with GSAP + ScrollTrigger (`gsap` 3.15.0). Sections opt in with data attributes: `data-reveal`, `data-reveal-group`/`data-reveal-item`, `data-parallax`, `data-vision*` and `data-process*`.
  - Desktop and mobile are tuned separately through `gsap.matchMedia`. Each needs its own condition, because the callback only runs when one matches.
  - Under reduced motion nothing animates.
  - Use opacity, never `autoAlpha`/visibility, so unrevealed content stays accessible. A `focusin` handler finishes reveals when keyboard focus lands inside one.
  - Ownership: GSAP owns transform and opacity on marked elements. Motion is used only in `MobileMenu`. CSS hovers must not use `transform` on GSAP-animated elements (cards use box-shadow).
  - The hero is deliberately not animated, to protect LCP. There is no 3D growth scene; the SVG diagram converges on scroll instead.
- Performance decisions from Phase 7 (keep them unless re-measured):
  - Below 1024px the hero shows the static render (`MOBILE_3D = false` in `HeroVisual.tsx`).
  - Desktop 3D starts after `load` plus idle, and mounts in stages (canvas → environment → sculpture).
  - Use `powerPreference: "default"`: "high-performance" forced a dual-GPU switch and a ~1s main-thread block.
  - The enquiry dialog and the mobile menu (with Motion) are lazy-loaded.
  - Lighthouse at the end of Phase 7: performance 97–100, accessibility, best practices and SEO all 100.
- Liquid layer (added after Phase 7, at the user's request). It runs on desktop only, with a fine pointer and motion allowed (`LIQUID_QUERY` in `lib/liquid.ts`):
  - `LiquidEffects` (in the layout) sets `html[data-liquid]`, plus `[data-refract]` on Chromium.
  - It builds SVG refraction lenses for `[data-liquid-glass]` elements (the glass header pill and the `glass`/`glassDark` button variants), which use `backdrop-filter: var(--lens)`.
  - It adds a hover ripple to `[data-liquid-media]` and lazy-loads `FluidCursor`, a WebGL2 fluid trail. Its shaders compile in parallel; never query programs early, because that blocked the main thread for about 0.7s.
  - `ScrollChoreography` melts headings and artwork into place with per-element SVG filters, removed afterwards. Compare filter strings by id, because browsers normalise `url(#x)` to `url("#x")`.
  - `SmartLink` tags route changes with the `liquid` transition type; `PageTransition` (in each page) and CSS in `globals.css` play the liquid wipe.
  - Don't use `content-visibility: auto` on sections: tested, it broke anchor scrolling, reveals and focus scrolling.
- Artwork in `public/images/art/` is original abstract three.js metaball renders (services, sections and case-study concept art), referenced from `constants/content.ts`. Case-study concept art is labelled as such, and real `CaseStudy.image` overrides it.
- QA gotcha: `html { overflow-x: clip }` hides horizontal overflow instead of letting the page scroll, so check element bounds, not `scrollWidth`.
- The favicon (`app/icon.svg`) is a placeholder "DW" monogram. `robots.ts` has no sitemap yet, because sitemap URLs need the production domain.
- The shadcn CLI can't create files like `button.tsx` (it collides with `Button.tsx` on macOS's case-insensitive disk). Hand-write the component from `npx shadcn@4.23.0 view <name>` instead, as `dialog.tsx` was.

## Workflow (spec §11)
Build in phases and stop for review at each milestone.
1. Inspect the repo and present a plan. The repo currently holds only the spec, with no Next.js project yet. Agree on the scaffold and package manager before installing anything.
2. Design foundation: tokens, type, spacing, containers, buttons, section wrappers, motion primitives.
3. **First review milestone:** Header and mobile nav, Hero and CTAs, 3D glass sculpture with fallback, Business Problems. **Stop for review.**
4. Remaining sections: Trust, Services, Growth Philosophy, Process, Work, Testimonials, FAQ, Contact CTA and Footer.
5. Enquiry modal and contact page (demo form).
6. Motion and refinement, including a separate tuning pass for mobile and a reduced-motion check.
7. QA across all viewports, keyboard use, WebGL fallback, console errors, overflow, performance. Confirm that no backend was added.

At completion, report: files changed, dependencies added and why, what is still a placeholder, the viewports and interactions you tested, and known limitations.

## Stack
- Next.js App Router, React, TypeScript (no `any`), Tailwind CSS (owns all tokens and styling).
- shadcn/ui on **Base UI** primitives for a new setup. If Radix-based shadcn already exists, keep Radix and don't mix the two. Use it for Dialog (enquiry modal), Input, Select, Textarea, Label, Accordion (FAQ), and Tooltip where useful. Always restyle it; never ship default shadcn looks.
- Header, mobile drawer, cards, buttons, editorial layout and glossy surfaces are all **custom**.
- 3D: three, @react-three/fiber, @react-three/drei. Scenes live in client components, load dynamically and have a static AVIF/WebP fallback.
- Animation: GSAP + ScrollTrigger for scroll choreography, `motion` for modal, menu and small UI moves, CSS for simple hovers. **Never let GSAP and Motion animate the same property on the same element.**
- Forms: react-hook-form, zod, @hookform/resolvers. Icons: lucide-react only.
- Aceternity UI is optional and only a reference for individual effects (spotlight, text reveal). Don't import it as a component system.
- **Package policy:** use one package manager and one lockfile. Pin compatible versions and never use `latest`. Install only what the current milestone needs. After installing, run the lint, typecheck and build scripts.

Suggested structure (adapt as needed): `src/app`, `src/components/{layout,sections,three,forms,motion,cards}`, `src/hooks`, `src/lib`, `src/constants`, `src/types`.

## Design tokens
| Token | Hex | Use |
|---|---|---|
| Warm white | `#F8F8F6` | Page background |
| White | `#FFFFFF` | Surfaces |
| Primary black | `#111111` | Text |
| Secondary grey | `#555555` | Supporting text |
| Light grey | `#EAEAE7` | Section surfaces |
| Gloss black | `#171719` | Dark cards |
| Silver | `#B8B8B8` | Highlights |
| Border grey | `#E3E3E0` | Dividers |

- The light theme dominates. Dark glossy cards provide emphasis and should not turn the site into a dark theme.
- Fonts: General Sans or Neue Montreal, falling back to Manrope or Inter. Subset fonts and keep weights minimal.
- Type sizes (desktop / mobile): hero 76–88 / 38–44px, section heading 48–64 / 32–38px, card heading 20–26 / 18–22px, body 15–17 / 14–16px. Use fluid type.
- Layout: max content width 1280px. Side padding 64 / 32 / 20px. Grid 12 / 6 / 1–2 columns. Gutter 24 / 20 / 14–16px. Header height 84 / 76 / 64–68px. Section spacing 120–160 / 90–110 / 64–80px.
- Breakpoints: 320–374, 375–430, 431–767, 768–1023 (tablet), 1024+ (desktop).
- Test viewports: 320×568, 375×812, 430×932, 768×1024, 1024×768, 1366×768, 1440×900, 1920×1080.

**Avoid:** blue or purple gradients, AI, robot or tech-cliché imagery, repeated literal wolf graphics, stock-photo-heavy layouts, too many rounded floating cards, distracting animation, and hover-only content.

## Homepage order
Header → Hero → Trust → Problems → Services (6 services in 3 groups) → Growth Philosophy (Strategy / Technology / Creativity / Performance) → Process (Discover / Define / Execute / Optimise) → Selected Work → Testimonials → FAQ (7 questions) → Contact CTA and Footer.

CTA labels: Header "Let's Talk" · Hero "Discuss Your Project" / "Explore Our Capabilities" · Contact "Start a Conversation". Never show a popup on page load, never use mobile exit-intent, and never re-show a prompt after it is dismissed.

## Key component notes
- **Header:** sticky. Starts transparent and becomes a warm-white translucent bar with blur on scroll. Mobile drawer locks body scroll, closes on navigation and on Escape, and traps focus. The logo and hamburger never overlap.
- **Hero:** 50/50 editorial split. An original glass sculpture of interlocking loops or ribbons, using `MeshPhysicalMaterial` with transmission. **Not a basic sphere.** Slow rotation, a light pointer response on desktop, restrained parallax. Text renders without waiting for WebGL. On mobile, the copy and CTAs come first and a simplified or static sculpture sits below. Reduce DPR on mobile and respect `prefers-reduced-motion`.
- **Problem and service cards:** black glossy textured surfaces with white text. Each card gets a distinct abstract texture instead of generic icons. Pointer lighting only on desktop. On mobile everything stacks and stays visible without hover.
- **Enquiry modal:** about 600–700px on desktop with a warm-white surface. Near full-screen on mobile with internal scroll, keyboard-aware layout, safe-area support, and a submit button that stays reachable.

## Quality bar
- Core Web Vitals: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. Load 3D dynamically, reserve media dimensions, pause offscreen animation.
- Accessibility: semantic landmarks and heading order, visible focus, keyboard-operable controls, an accessible accordion and modal, announced form errors, good contrast, and meaning never carried by colour alone.
- SEO: unique title and description, Open Graph, sitemap and robots. Add a canonical URL only once the domain is confirmed. Structured data uses real facts only.
