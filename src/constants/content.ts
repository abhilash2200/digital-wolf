import type {
  Capability,
  CaseStudy,
  FaqItem,
  ProcessStage,
  ServiceCategory,
  Testimonial,
} from "@/types/site";

/* ------------------------------------------------------------------
   Trust (spec §5.3) — real logos and verifiable metrics only.
   ------------------------------------------------------------------ */
export const TRUST = {
  heading: "Trusted by Businesses Building What’s Next.",
  /** Supplied client logos go here: { name, src }. Empty → placeholder slots. */
  logos: [] as { name: string; src: string }[],
  placeholderSlots: 6,
} as const;

/* ------------------------------------------------------------------
   Services (spec §5.5) — six services in three categories.
   ------------------------------------------------------------------ */
export const SERVICES = {
  eyebrow: "Capabilities",
  heading: "Everything Your Business Needs to Grow Digitally.",
  intro:
    "Six core services across strategy, technology and performance — available individually or brought together as one connected programme.",
  categories: [
    {
      id: "strategy-visibility",
      label: "A",
      title: "Strategy & Visibility",
      services: [
        {
          id: "seo",
          image: "/images/art/svc-seo.webp",
          title: "SEO",
          summary: "Help the right customers find you through search.",
          items: [
            "Technical SEO",
            "On-page SEO",
            "Off-page SEO",
            "Local SEO",
            "Content strategy",
          ],
        },
        {
          id: "digital-strategy",
          image: "/images/art/svc-strategy.webp",
          title: "Digital Strategy",
          summary: "Set clear priorities and a plan that connects every channel.",
          items: [
            "Consulting",
            "Growth planning",
            "Marketing strategy",
            "Analytics and reporting",
          ],
        },
      ],
    },
    {
      id: "technology-experience",
      label: "B",
      title: "Technology & Experience",
      services: [
        {
          id: "development",
          image: "/images/art/svc-development.webp",
          title: "Website & Application Development",
          summary: "Build fast, dependable websites and web applications.",
          items: [
            "Corporate and business websites",
            "E-commerce websites",
            "Web applications",
            "Integrations",
            "Website maintenance",
          ],
        },
        {
          id: "creative",
          image: "/images/art/svc-creative.webp",
          title: "Creative & Design",
          summary: "Shape a consistent brand and experiences people remember.",
          items: [
            "Brand identity",
            "UI/UX design",
            "Advertising creatives",
            "Digital design assets",
          ],
        },
      ],
    },
    {
      id: "performance-engagement",
      label: "C",
      title: "Performance & Engagement",
      services: [
        {
          id: "ppc",
          image: "/images/art/svc-ppc.webp",
          title: "PPC & Performance Marketing",
          summary: "Run paid campaigns that are targeted, tracked and optimised.",
          items: [
            "Google Ads",
            "Meta Ads",
            "Campaign management",
            "Conversion tracking",
            "Landing-page optimisation",
          ],
        },
        {
          id: "social",
          image: "/images/art/svc-social.webp",
          title: "Social Media Marketing",
          summary: "Build an engaged audience with a consistent social presence.",
          items: [
            "Social media strategy",
            "Content planning",
            "Social media management",
            "Social media optimisation",
            "Audience engagement",
          ],
        },
      ],
    },
  ] satisfies ServiceCategory[],
} as const;

/* ------------------------------------------------------------------
   Digital growth philosophy (spec §5.6)
   ------------------------------------------------------------------ */
export const PHILOSOPHY = {
  eyebrow: "Our approach",
  heading: "Different Disciplines. One Connected Vision.",
  intro:
    "Growth rarely comes from one channel working alone. We bring four disciplines together so each one strengthens the others.",
  capabilities: [
    {
      id: "strategy",
      title: "Strategy",
      body: "Clear priorities, grounded in your business goals, audience and market.",
    },
    {
      id: "technology",
      title: "Technology",
      body: "Websites, applications and integrations that are fast, reliable and built to scale.",
    },
    {
      id: "creativity",
      title: "Creativity",
      body: "Brand, design and content that make your business recognisable and worth remembering.",
    },
    {
      id: "performance",
      title: "Performance",
      body: "Search, paid media and social activity that is measured, reviewed and improved.",
    },
  ] satisfies Capability[],
} as const;

/* ------------------------------------------------------------------
   Process (spec §5.7) — approved stage copy.
   ------------------------------------------------------------------ */
/** Abstract section artwork (decorative). */
export const SECTION_ART = {
  problems: "/images/art/sec-problems.webp",
  approach: "/images/art/sec-approach.webp",
  process: "/images/art/sec-process.webp",
  contact: "/images/art/sec-contact.webp",
} as const;

export const PROCESS = {
  eyebrow: "Process",
  heading: "A Clear Strategy. A Smarter Way Forward.",
  stages: [
    {
      id: "discover",
      title: "Discover",
      body: "Understand the business, audience, goals, and challenges.",
    },
    {
      id: "define",
      title: "Define",
      body: "Establish priorities, direction, scope, and a practical plan.",
    },
    {
      id: "execute",
      title: "Execute",
      body: "Deliver the agreed strategy through design, development, and marketing.",
    },
    {
      id: "optimise",
      title: "Optimise",
      body: "Review performance, learn, and improve.",
    },
  ] satisfies ProcessStage[],
} as const;

/* ------------------------------------------------------------------
   Selected work (spec §5.8) — real projects only. Nulls render as
   clearly labelled placeholders; never fill them with invented results.
   ------------------------------------------------------------------ */
const EMPTY_CASE: Omit<CaseStudy, "id"> = {
  client: null,
  industry: null,
  challenge: null,
  strategy: null,
  execution: null,
  services: [],
  outcomes: null,
  href: null,
  image: null,
};

export const WORK = {
  eyebrow: "Selected work",
  heading: "Ideas Into Execution. Execution Into Impact.",
  featured: { id: "featured", ...EMPTY_CASE } satisfies CaseStudy,
  supporting: [
    { id: "project-2", ...EMPTY_CASE },
    { id: "project-3", ...EMPTY_CASE },
  ] satisfies CaseStudy[],
  /** Abstract concept artwork shown until real project imagery is supplied. */
  conceptArt: {
    featured: "/images/art/case-1.webp",
    "project-2": "/images/art/case-2.webp",
    "project-3": "/images/art/case-3.webp",
  } as Record<string, string>,
} as const;

/* ------------------------------------------------------------------
   Testimonials (spec §5.9) — genuine, approved quotes only.
   ------------------------------------------------------------------ */
export const TESTIMONIALS = {
  eyebrow: "Client words",
  heading: "Good Work Builds Lasting Partnerships.",
  items: [] as Testimonial[],
} as const;

/* ------------------------------------------------------------------
   FAQ (spec §5.10) — answers avoid unconfirmed timelines, guarantees
   or service levels. Review with the Digital Wolf team before launch.
   ------------------------------------------------------------------ */
export const FAQ = {
  eyebrow: "FAQ",
  heading: "Questions, Answered.",
  items: [
    {
      question: "What services does Digital Wolf provide?",
      answer:
        "We are a full-service digital agency. Our core services are SEO, digital strategy, website and application development, creative and design, PPC and performance marketing, and social media marketing.",
    },
    {
      question: "Can we hire you for individual services?",
      answer:
        "Yes. You can work with us on a single service, such as SEO or a new website, or bring several services together under one connected plan.",
    },
    {
      question: "Do you work with startups and established companies?",
      answer:
        "Yes. We work with startups, SMEs and established businesses. The approach is shaped around each business’s stage, goals and resources.",
    },
    {
      question: "Do you provide website development and digital marketing together?",
      answer:
        "Yes. Bringing technology, creative and marketing together is central to how we work, so your website and your campaigns are planned to support each other.",
    },
    {
      question: "How do you measure campaign performance?",
      answer:
        "We agree the goals and measures that matter to your business at the start, set up tracking to follow them, and review performance regularly so we can learn and improve.",
    },
    {
      question: "What is a typical project timeline?",
      answer:
        "Timelines depend on the scope and complexity of the work. We agree a realistic plan and milestones with you during the Define stage, before work begins.",
    },
    {
      question: "How can we start working together?",
      answer:
        "Start a conversation with us. Tell us about your business, your challenges and where you want to go, and we’ll explore the right next step together.",
    },
  ] satisfies FaqItem[],
} as const;

/* ------------------------------------------------------------------
   Contact CTA (spec §5.11)
   ------------------------------------------------------------------ */
export const CONTACT = {
  heading: "Let’s Make Your Next Move Matter.",
  body: "Tell us about your business, your challenges and where you want to go. Let’s explore how Digital Wolf can help you move forward.",
} as const;
