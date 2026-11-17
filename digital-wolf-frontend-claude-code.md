# Digital Wolf — Frontend Build Specification

> **Purpose:** Implementation brief for Claude Code. Build the Digital Wolf marketing website as a frontend-only project. Do not implement a backend, database, authentication, CRM, email delivery, or real lead storage in this phase.

## 1. Project Objective

Create a premium, distinctive, conversion-focused website for **Digital Wolf**, positioned as a **Full-Service Digital Agency**.

Digital Wolf connects strategy, technology, creativity, and performance marketing. It is not simply an SEO company, PPC agency, or web development company.

**Audience:** SMEs, established businesses, and startups.

**Design objective:** A sophisticated corporate editorial experience with strong visual identity, clear information hierarchy, purposeful motion, and clear conversion paths. Do not use a generic AI agency or SaaS landing-page template.

## 2. Scope: Frontend Only

### Included
- Next.js App Router, React, TypeScript, and the project's existing Tailwind CSS setup.
- Responsive desktop, tablet, and mobile layouts.
- All homepage sections in this specification.
- Navigation, mobile menu, accordions, sliders, modals, and client-side interactions.
- Interactive 3D visuals and scroll-based animation where performance permits.
- Enquiry form UI with client-side validation and a simulated success state.
- SEO metadata, semantic markup, accessibility, responsive QA, and frontend performance optimisation.

### Explicitly excluded
- Backend APIs or server actions for lead processing.
- Database schemas, migrations, or database connections.
- Authentication, accounts, or user management.
- CRM integrations or lead routing.
- Email or SMS notifications.
- Real lead storage or server-side form submission.
- Payment or subscription functionality.
- Server-side analytics processing.

**Form rule:** The enquiry form is a frontend demonstration only. Validate fields in the browser, then show a clear demo success state. Do not imply that an enquiry was delivered or saved. Keep the form modular so a real submission handler can be connected in a later phase.

## 3. Brand and Creative Direction

### Brand
- Name: **Digital Wolf**
- Positioning: **Full-Service Digital Agency**

### Approved visual direction
1. Light editorial theme using warm white and restrained neutral colours.
2. Original interactive 3D glass sculpture in the hero.
3. Black glossy abstract textured cards for problem and service sections.
4. Cinematic but restrained scroll transitions and interactive 3D details.

### Avoid
- Generic blue or purple gradients.
- Generic AI imagery, robot imagery, or abstract tech clichés.
- Literal wolf graphics repeated throughout the website.
- Generic stock-photo-heavy layouts.
- Excessive rounded cards and floating UI panels.
- Animation that distracts from content or harms performance.
- Hover-only information that is inaccessible on touch devices.

### Colour palette

| Token | Colour | Use |
|---|---|---|
| Warm white | `#F8F8F6` | Main page background |
| White | `#FFFFFF` | Clean surfaces |
| Primary black | `#111111` | Main text |
| Secondary grey | `#555555` | Supporting text |
| Light grey | `#EAEAE7` | Subtle section surfaces |
| Gloss black | `#171719` | Dark cards and visual panels |
| Silver | `#B8B8B8` | Restrained highlights |
| Border grey | `#E3E3E0` | Dividers and borders |

Keep the light theme dominant. Dark surfaces should create contrast and emphasis, not turn the whole site into a dark theme.

### Typography
Preferred: General Sans or Neue Montreal. Alternatives: Manrope or Inter.

Suggested starting sizes:

| Element | Desktop | Mobile |
|---|---:|---:|
| Hero heading | 76–88px | 38–44px |
| Section heading | 48–64px | 32–38px |
| Card heading | 20–26px | 18–22px |
| Body | 15–17px | 14–16px |

Use fluid typography where appropriate. Preserve readable line-height.

### Layout system
- Reference desktop width: 1440px.
- Maximum content width: 1280px.
- Side padding: 64px desktop, 32px tablet, 20px mobile.
- Desktop grid: 12 columns; tablet: 6 columns; mobile: 1–2 columns as appropriate.
- Gutter: 24px desktop, 20px tablet, 14–16px mobile.
- Header height: approximately 84px desktop, 76px tablet, 64–68px mobile.
- Section spacing: 120–160px desktop, 90–110px tablet, 64–80px mobile.

Treat these as design tokens, not rigid values.

## 4. Homepage Information Architecture

Build the homepage in this order:

1. Header and navigation
2. Hero with interactive glass sculpture
3. Client trust / credibility strip
4. Business problems
5. Services
6. Digital growth philosophy
7. Process
8. Selected work / case studies
9. Testimonials
10. FAQ
11. Contact CTA and footer

Do not invent client names, logos, testimonials, project outcomes, statistics, or partnerships. Use clearly labelled placeholders where real content has not been supplied.

## 5. Section Requirements

### 5.1 Header and Navigation

**Desktop**
- Left: Digital Wolf wordmark.
- Centre: Home, Services, Our Approach, Work, About.
- Right: “Let’s Talk” CTA.
- Initially transparent or visually light over the hero.
- On scroll, transition to a warm-white translucent surface with backdrop blur.
- Sticky positioning, subtle animated navigation underline, and CTA arrow movement on hover.

**Mobile**
- Compact wordmark and hamburger control.
- Full-screen or near-full-screen navigation drawer.
- Clear spacing between logo and menu control; no overlap.
- Include navigation links, relevant service links, contact CTA, and supplied email/social links.
- Lock background scrolling while open.
- Close after navigation; support Escape and accessible focus behaviour.
- Prevent header/footer overlap, horizontal overflow, and sticky-footer layout bugs.

### 5.2 Hero

**Headline**

> We Build Digital Experiences That Move Businesses Forward.

**Supporting copy**

> From digital strategy and development to performance marketing and creative execution, we bring the right digital capabilities together to help businesses build stronger brands and achieve meaningful growth.

**CTAs**
- Primary: “Discuss Your Project”
- Secondary: “Explore Our Capabilities”

**Composition**
- Editorial split layout on desktop, approximately 50/50 between text and visual.
- Keep text and CTA hierarchy clear.
- Right side: original transparent optical-glass sculpture.
- Sculpture concept: interconnected loops, twisted ribbons, or organic interlocking geometry, with realistic refraction, reflection, studio lighting, and subtle shadows.
- Do not use a basic glass sphere as the main visual.

**Motion and implementation**
- Slow ambient rotation.
- Subtle pointer response on capable desktop devices.
- Restrained parallax.
- Optional scroll-controlled transformation only if it does not compromise usability.
- Use React Three Fiber / Three.js and Drei where appropriate.
- Explore `MeshPhysicalMaterial` with transmission, thickness, roughness, and environment reflections.
- Dynamically load the 3D scene.
- Provide a static image fallback.
- Do not block initial text rendering on the 3D scene.

**Mobile**
- Show headline, copy, and CTAs before the sculpture.
- Place a simplified sculpture below the main copy.
- Reduce pixel ratio, transparency cost, and animation intensity.
- Use a static AVIF/WebP fallback when appropriate.
- Respect `prefers-reduced-motion`.

### 5.3 Trust / Client Credibility

Headline:

> Trusted by Businesses Building What’s Next.

- Use actual client logos only when supplied.
- Use genuine, verifiable metrics only.
- Use monochrome or restrained logo treatment.
- If assets are unavailable, use neutral placeholders clearly marked for replacement.

### 5.4 Business Problems

Headline:

> You’re Working Hard. But Is Your Brand Moving Forward?

Four problem cards:
1. Inconsistent Branding
2. Poor Digital Visibility
3. Wasted Advertising Spend
4. No Clear Strategy

Solution statement:

> We Turn Scattered Marketing Into a Structured Growth Engine.

**Visual direction**
- Desktop: editorial headline area paired with an asymmetric 2×2 grid of black glossy textured cards.
- White typography on dark cards.
- Subtle reflections and pointer-responsive lighting where suitable.
- Each card should have a distinct but related abstract texture.
- Avoid generic icons as the primary visual treatment.

**Mobile**
- Stack cards vertically.
- Keep all card descriptions visible without hover.
- Replace pointer effects with lightweight static texture or CSS effects.

### 5.5 Services

Headline:

> Everything Your Business Needs to Grow Digitally.

Create six core services, grouped into three categories.

**A. Strategy & Visibility**

1. **SEO**
   - Technical SEO
   - On-page SEO
   - Off-page SEO
   - Local SEO
   - Content strategy

2. **Digital Strategy**
   - Consulting
   - Growth planning
   - Marketing strategy
   - Analytics and reporting

**B. Technology & Experience**

3. **Website & Application Development**
   - Corporate and business websites
   - E-commerce websites
   - Web applications
   - Integrations
   - Website maintenance

4. **Creative & Design**
   - Brand identity
   - UI/UX design
   - Advertising creatives
   - Digital design assets

**C. Performance & Engagement**

5. **PPC & Performance Marketing**
   - Google Ads
   - Meta Ads
   - Campaign management
   - Conversion tracking
   - Landing-page optimisation

6. **Social Media Marketing**
   - Social media strategy
   - Content planning
   - Social media management
   - Social media optimisation
   - Audience engagement

**Visual direction**
- Black glossy abstract card surfaces.
- Distinct visual texture or lighting treatment per service.
- White text with clear hierarchy.
- Subtle arrow movement and restrained hover lighting.
- Clear service detail link or action.

**Mobile**
- One service card per row.
- Descriptions and key details visible without hover.
- Touch-friendly interactions.

### 5.6 Digital Growth Philosophy

Headline:

> Different Disciplines. One Connected Vision.

Show four interconnected capabilities:
- Strategy
- Technology
- Creativity
- Performance

**Desktop:** Create a restrained 3D composition where the four elements progressively align into one connected visual. Scroll can influence camera, lighting, or element position. The visual must support the message, not become a long technical spectacle.

**Mobile:** Use a simplified 3D/static visual and present the four capabilities as clear vertical content blocks. Avoid long pinned scroll sequences.

### 5.7 Process

Headline:

> A Clear Strategy. A Smarter Way Forward.

Four stages:
1. **Discover** — Understand the business, audience, goals, and challenges.
2. **Define** — Establish priorities, direction, scope, and a practical plan.
3. **Execute** — Deliver the agreed strategy through design, development, and marketing.
4. **Optimise** — Review performance, learn, and improve.

Desktop: horizontal timeline or staged sequence with restrained scroll activation.

Mobile: vertical timeline with clear stage labels and descriptions.

### 5.8 Selected Work / Case Studies

Headline:

> Ideas Into Execution. Execution Into Impact.

- Use one featured project and supporting project cards.
- Use real project content and approved assets only.
- For each project, include client, industry, challenge, strategy, execution, services, and verified outcomes where available.
- If project information is not supplied, create clearly marked placeholder content rather than fabricating results.
- Each card should have a clear case-study action.

### 5.9 Testimonials

Headline:

> Good Work Builds Lasting Partnerships.

- Use genuine testimonials only.
- Include name, role, and company only when supplied and approved.
- Optional company logo where available.
- Desktop: restrained transitions.
- Mobile: touch-friendly slider or stacked layout.
- If testimonials are unavailable, use a clearly labelled placeholder or omit testimonial content until supplied. Never write fake quotes.

### 5.10 FAQ

Build an accessible accordion with these questions:

1. What services does Digital Wolf provide?
2. Can we hire you for individual services?
3. Do you work with startups and established companies?
4. Do you provide website development and digital marketing together?
5. How do you measure campaign performance?
6. What is a typical project timeline?
7. How can we start working together?

Answers must be concise, accurate, and consistent with the approved agency positioning. Do not promise unconfirmed service levels, timelines, or guarantees.

### 5.11 Contact CTA and Footer

**CTA headline**

> Let’s Make Your Next Move Matter.

**Supporting copy**

> Tell us about your business, your challenges and where you want to go. Let’s explore how Digital Wolf can help you move forward.

**CTA:** “Start a Conversation”

Footer:
- Digital Wolf wordmark and short agency description.
- Services navigation.
- Company navigation.
- Contact details, only when supplied.
- Social links, only when supplied.
- Privacy and terms links only if real pages exist; otherwise mark as pending rather than linking to dead routes.

## 6. Enquiry Form: Frontend Demonstration Only

The form is a UI prototype in this phase. It must not send, store, or transmit personal information.

### Interaction
- Open the enquiry modal from relevant CTAs.
- Also provide a dedicated contact page or contact section.
- Validate fields client-side.
- Show field-level errors.
- On valid submission, show a demo success message explicitly stating that this is a frontend demo and no enquiry has been sent.
- Do not log personal form values to the console.
- Do not use fake API calls or pretend to save the enquiry.

### Suggested fields
- Full name
- Work email
- Phone
- Company
- Website (optional)
- Interested services
- Project description

Avoid unnecessary qualification questions.

### Modal behaviour
**Desktop**
- Approximately 600–700px wide.
- Centred, warm-white surface.
- Clear heading and close control.
- Subtle entry/exit animation.
- Accessible focus management.

**Mobile**
- Full-screen or nearly full-screen.
- Single-column fields.
- Internal scrolling.
- Keyboard-aware layout.
- Safe-area support.
- Visible close control.
- Submit action remains reachable.

### Future integration readiness
Keep the form UI, validation schema, and submission handler separated. A future backend integration should be possible by replacing the demo handler, without rebuilding the form design.

## 7. Calls to Action

Use a consistent CTA system:
- Header: “Let’s Talk”
- Hero primary: “Discuss Your Project”
- Hero secondary: “Explore Our Capabilities”
- Contact: “Start a Conversation”

Place relevant CTAs in the hero, problem section, services, portfolio, testimonials, and final CTA. Avoid a CTA in every card if it creates visual noise.

Optional behaviour:
- A desktop scroll prompt may be tested after meaningful engagement, but never show an unsolicited popup immediately on page load.
- Do not use mobile exit-intent behaviour.
- Do not repeatedly show a dismissed prompt.
- A mobile sticky CTA may be used if it does not cover content, form controls, or the footer.

A CTA click is not a lead. Do not claim conversion tracking or lead capture is implemented in this frontend phase.

## 8. Responsive Design Requirements

Mobile is an independent layout, not a compressed desktop design.

### Breakpoints
- Small mobile: 320–374px
- Standard mobile: 375–430px
- Large mobile: 431–767px
- Tablet: 768–1023px
- Desktop: 1024px and above

### Test viewports
- 320 × 568
- 375 × 812
- 430 × 932
- 768 × 1024
- 1024 × 768
- 1366 × 768
- 1440 × 900
- 1920 × 1080

### Mobile acceptance points
- No horizontal overflow.
- No logo/hamburger overlap.
- No clipped headings or buttons.
- No hover-only content.
- Touch targets are comfortably usable.
- Problem and service cards stack cleanly.
- Process becomes vertical.
- Portfolio items stack clearly.
- Testimonials remain touch-friendly.
- FAQ accordions are easy to operate.
- Contact form remains usable with the virtual keyboard open.
- Sticky CTA does not obscure important content.
- 3D effects are simplified or replaced with static fallbacks where needed.

## 9. Technology Stack

Use this as the approved technical direction for the frontend. First inspect the existing repository and retain compatible, working dependencies. Do not blindly upgrade packages or install every optional library.

### Core application stack

| Layer | Technology | Responsibility |
|---|---|---|
| Framework | Next.js (App Router) | Application structure, routing, layouts, metadata, and rendering |
| UI library | React | Component-based interface and client-side interactions |
| Language | TypeScript | Type safety across components, props, and utilities |
| Styling | Tailwind CSS | Responsive styling, design tokens, and layout |
| Markup | Semantic HTML5 | Accessible page structure |

### UI component system — approved choice

**Primary UI foundation: shadcn/ui with Base UI primitives for a new implementation.** Build a custom Digital Wolf design system on top of it. Do not use default shadcn styling unchanged across the site. The library should provide accessible behaviour and dependable interaction patterns; custom Tailwind styles should define the brand's appearance.

- **shadcn/ui:** Primary source for accessible, composable interface components. Add only the components the project actually uses.
- **Base UI:** Use as the underlying primitive system when adding new shadcn components to a new project. If the repository already has shadcn components built on Radix UI, keep the existing Radix setup; do not migrate solely to change primitive libraries. Do not mix Base UI and Radix implementations for the same component without a clear technical reason.
- **Aceternity UI:** Optional source for selected visual effects only, such as spotlight, text reveal, or restrained parallax. Treat examples as implementation references and adapt them to the Digital Wolf design system. Do not import its full visual style or use it as a second general-purpose component system.
- **Tailwind CSS:** Own the design tokens, spacing, typography, colours, responsive behaviour, card surfaces, and component styling.
- **Lucide React:** Use for interface icons; avoid mixing multiple icon families.

#### Component selection guide

| UI element | Preferred implementation |
|---|---|
| Buttons and links | Custom Tailwind components; shadcn patterns where useful |
| Header and navigation | Custom component |
| Mobile navigation drawer | Custom component with Motion |
| Enquiry modal | shadcn Dialog |
| Form inputs | shadcn Input, Select, Textarea, Label |
| FAQ | shadcn Accordion |
| Service and problem cards | Custom Tailwind components |
| Glossy surfaces and pointer lighting | Custom CSS; optional shader/Three.js effects |
| Hero glass sculpture | React Three Fiber + Three.js |
| Scroll transitions | GSAP + ScrollTrigger |
| Tooltips | shadcn Tooltip, only where useful |

Do not use a library component just because it exists. The editorial layout, typography, glass sculpture, and glossy cards must remain custom-designed. Keep controls consistent, accessible, keyboard-operable, and responsive.

### 3D and visual experience

| Technology | Responsibility |
|---|---|
| Three.js | WebGL-based 3D rendering |
| React Three Fiber | React renderer for Three.js scenes |
| Drei | Helpers and abstractions for React Three Fiber |
| Custom GLSL shaders (optional) | Specialised glass, light, or surface effects only where standard materials are insufficient |

Use React Three Fiber, Three.js, and Drei for the hero glass sculpture and, if justified, the growth philosophy visual. Keep 3D scenes isolated in client components and dynamically loaded. Provide static fallbacks.

### Animation and interaction

| Technology | Responsibility |
|---|---|
| GSAP | Timeline-based and complex sequence animation |
| GSAP ScrollTrigger | Scroll-linked transitions and section choreography |
| Motion (Framer Motion) | Component transitions, modal/menu interactions, and small UI animations |
| CSS transitions and keyframes | Simple hover, focus, and decorative effects |

**Animation ownership:** Do not let GSAP and Motion animate the same DOM property on the same element. Assign clear ownership per component. Prefer CSS for simple transitions rather than adding JavaScript animation.

### Forms and validation

| Technology | Responsibility |
|---|---|
| React Hook Form | Form state and client-side interaction |
| Zod | Client-side schema validation |
| `@hookform/resolvers` | Connect Zod schemas to React Hook Form |

This phase uses browser-side validation and a demo success state only. These libraries must not be connected to a backend or used to transmit or store form data.

### Icons and assets

| Technology | Responsibility |
|---|---|
| Lucide React | Consistent interface icons |
| Next.js Image | Responsive image rendering and optimisation |
| AVIF / WebP | Optimised raster image formats |
| GLB / glTF | Compressed and reusable 3D assets where suitable |

Use supplied brand assets first. Do not invent client logos, portfolio imagery, or testimonials. Use clearly marked placeholders when source assets are missing.

### Code quality and testing

- ESLint: linting and code-quality checks.
- Prettier: consistent formatting, if the repository uses it.
- Playwright: optional end-to-end testing for navigation, responsive behaviour, modal, accordion, and form validation.
- Browser developer tools: responsive layout, console, accessibility, and performance checks.

Do not add a testing framework or formatting tool if the repository already has an established equivalent. Check existing scripts before changing them.

### Package and version policy

1. Inspect `package.json`, the lockfile, Node.js version, and current Next.js / React / Tailwind versions before installing anything.
2. Use the repository's existing package manager and lockfile. Do not create a second lockfile.
3. Select mutually compatible versions of Next.js, React, React Three Fiber, Three.js, and the animation libraries.
4. Do not use `latest` as a version strategy or upgrade the framework just to match this document.
5. Install only the packages required for the current milestone. Defer optional packages until a real implementation need exists.
6. After installation, run the existing lint, type-check, and build scripts where available. Report any missing scripts rather than claiming they passed.

### Recommended dependency groups

**Core**
- `next`
- `react`
- `react-dom`
- `typescript`
- `tailwindcss`

**3D, when implementing the hero**
- `three`
- `@react-three/fiber`
- `@react-three/drei`

**Motion, as needed**
- `gsap`
- `motion`

**Forms**
- `react-hook-form`
- `zod`
- `@hookform/resolvers`

**Icons**
- `lucide-react`

The exact versions must be selected after repository inspection. Do not install all groups at once if the current milestone does not need them.


### Suggested component structure

Adapt this to the existing repository rather than forcing it:

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    contact/
      page.tsx
    services/
      ...
  components/
    layout/
      Header.tsx
      Footer.tsx
      MobileMenu.tsx
    sections/
      Hero.tsx
      TrustSection.tsx
      ProblemSection.tsx
      ServicesSection.tsx
      GrowthPhilosophy.tsx
      ProcessSection.tsx
      CaseStudies.tsx
      Testimonials.tsx
      FAQ.tsx
      ContactSection.tsx
    three/
      HeroCanvas.tsx
      GlassSculpture.tsx
      GrowthScene.tsx
      Lighting.tsx
    forms/
      EnquiryModal.tsx
      ContactForm.tsx
      ServiceSelector.tsx
    motion/
      Reveal.tsx
      TextReveal.tsx
    cards/
      ServiceCard.tsx
      ProblemCard.tsx
  hooks/
  lib/
  constants/
  types/
```

## 10. Performance, Accessibility, and SEO

### Performance targets
- LCP: 2.5 seconds or less.
- INP: 200 milliseconds or less.
- CLS: 0.1 or less.

Requirements:
- Dynamically load non-critical 3D scenes.
- Keep hero text visible without waiting for WebGL.
- Compress 3D assets.
- Use appropriately sized AVIF/WebP images.
- Use font subsets and avoid unnecessary font weights.
- Avoid excessive post-processing.
- Pause or reduce offscreen animation.
- Respect `prefers-reduced-motion`.
- Reserve media dimensions to avoid layout shifts.
- Provide static fallbacks for WebGL failure and constrained devices.
- Never sacrifice usability for visual effects.

### Accessibility
- Semantic HTML landmarks and heading order.
- Keyboard-accessible navigation and controls.
- Visible focus states.
- Accessible modal focus management and Escape handling.
- Accessible accordion state and keyboard behaviour.
- Proper form labels, descriptions, and announced validation errors.
- Sufficient colour contrast.
- Reduced-motion support.
- Do not communicate meaning through colour alone.

### SEO
- Unique page title and meta description.
- Canonical URL when the production domain is confirmed.
- Open Graph metadata.
- Sitemap and robots configuration as appropriate.
- Semantic headings and descriptive links.
- Image alt text.
- Relevant structured data only when supported by real business information.
- Do not invent an address, ratings, awards, or business claims.

## 11. Development Workflow for Claude Code

Do not attempt to build every section in one unreviewed pass.

### Phase 1 — Inspect the project
1. Inspect the repository, package manager, Next.js version, Tailwind version, routing, and existing components.
2. Identify existing conventions and preserve working configuration.
3. Report the proposed implementation plan and any conflicts before broad structural changes.
4. Do not overwrite existing work without checking it.

### Phase 2 — Design foundation
1. Establish colour, typography, spacing, container, and breakpoint tokens.
2. Create reusable buttons, links, section wrappers, and basic motion primitives.
3. Set global page background, text styles, and selection/focus styles.

### Phase 3 — First review milestone
Build only:
1. Header and mobile navigation.
2. Hero content and CTAs.
3. Interactive glass sculpture with fallback.
4. Business problem section.

Make desktop and mobile versions work. Stop for review before expanding the page.

### Phase 4 — Remaining content
Build:
1. Trust section.
2. Services.
3. Growth philosophy.
4. Process.
5. Selected work.
6. Testimonials.
7. FAQ.
8. Contact CTA and footer.

### Phase 5 — Frontend enquiry experience
1. Implement modal and contact form UI.
2. Add client-side validation.
3. Add explicit demo success state.
4. Confirm no network request or personal-data storage occurs.

### Phase 6 — Motion and refinement
1. Add scroll transitions and hover interactions.
2. Add the 3D growth scene only if it adds meaningful value.
3. Tune mobile motion separately.
4. Check reduced-motion behaviour.

### Phase 7 — QA
1. Test all listed viewports.
2. Test navigation, menu, accordions, modal, form validation, and CTA actions.
3. Test keyboard-only navigation.
4. Test WebGL failure and static fallback.
5. Check console errors and layout overflow.
6. Review performance and image loading.
7. Confirm no backend, database, CRM, or email functionality was introduced.

## 12. Acceptance Criteria

- [ ] Design follows the approved light editorial direction.
- [ ] Site does not look like a generic AI/SaaS template.
- [ ] Header and navigation work on desktop and mobile.
- [ ] Hero headline, supporting copy, and CTAs match approved content.
- [ ] Hero glass sculpture renders where supported and has a reliable fallback.
- [ ] Problem cards use the approved black glossy visual direction.
- [ ] All six service areas are represented accurately.
- [ ] Growth philosophy communicates Strategy, Technology, Creativity, and Performance.
- [ ] Process includes Discover, Define, Execute, and Optimise.
- [ ] Portfolio and testimonial content is genuine or clearly marked as placeholder.
- [ ] FAQ accordion is accessible.
- [ ] Contact CTA and frontend-only enquiry form work.
- [ ] Form does not send or store personal information.
- [ ] Layout works at the specified mobile, tablet, and desktop sizes.
- [ ] Reduced-motion and keyboard accessibility are supported.
- [ ] Images and 3D assets are optimised and have fallbacks.
- [ ] No major console errors, broken routes, or horizontal overflow remain.
- [ ] No backend or external lead-processing dependency has been added.

## 13. Instructions to Claude Code

### Before coding
1. Read this entire specification.
2. Inspect the existing repository and identify its actual framework and dependency versions.
3. Do not assume the project is empty.
4. Do not install or upgrade packages until you have checked the existing setup.
5. Present a concise implementation plan and identify missing assets or content.

### While coding
- Build reusable, maintainable components.
- Use TypeScript types rather than `any`.
- Keep components focused and avoid oversized page files.
- Use real assets supplied by the project.
- If an asset or business fact is missing, use an obvious placeholder; do not fabricate it.
- Prioritise responsive layout and interaction correctness before decorative animation.
- Keep the frontend independent of any backend.

### At completion
- Summarise files created or changed.
- List dependencies added, if any, and why.
- State what has been implemented and what remains a placeholder.
- Report the viewports and interactions tested.
- Report known limitations.
- Do not claim tests passed unless they were actually run.

**First implementation task:** Complete Phase 1 inspection, then build the Phase 3 review milestone: Header, responsive navigation, Hero, interactive glass sculpture with fallback, and Business Problems section. Stop for review before implementing the remaining sections.
