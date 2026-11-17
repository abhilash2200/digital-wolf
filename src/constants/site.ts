import type { NavLink, ProblemItem, ServiceLink } from "@/types/site";

export const SITE = {
  name: "Digital Wolf",
  positioning: "Full-Service Digital Agency",
  description:
    "Digital Wolf is a full-service digital agency connecting strategy, technology, creativity and performance marketing to help businesses build stronger brands and achieve meaningful growth.",
  // Contact details and social links are pending — only render when supplied.
  email: null as string | null,
  socials: [] as { label: string; href: string }[],
} as const;

/** Approved CTA labels (spec §7). */
export const CTA = {
  header: "Let’s Talk",
  heroPrimary: "Discuss Your Project",
  heroSecondary: "Explore Our Capabilities",
  contact: "Start a Conversation",
} as const;

/** Section anchors on the homepage. */
export const ANCHORS = {
  services: "services",
  approach: "approach",
  work: "work",
  about: "about",
  contact: "contact",
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: `/#${ANCHORS.services}` },
  { label: "Our Approach", href: `/#${ANCHORS.approach}` },
  { label: "Work", href: `/#${ANCHORS.work}` },
  { label: "About", href: `/#${ANCHORS.about}` },
];

/** Service shortcuts for the mobile menu. Detail pages don't exist yet, so these anchor to the services section. */
export const SERVICE_LINKS: ServiceLink[] = [
  { label: "SEO", href: `/#${ANCHORS.services}` },
  { label: "Digital Strategy", href: `/#${ANCHORS.services}` },
  { label: "Website & Application Development", href: `/#${ANCHORS.services}` },
  { label: "Creative & Design", href: `/#${ANCHORS.services}` },
  { label: "PPC & Performance Marketing", href: `/#${ANCHORS.services}` },
  { label: "Social Media Marketing", href: `/#${ANCHORS.services}` },
];

export const HERO = {
  eyebrow: SITE.positioning,
  heading: "We Build Digital Experiences That Move Businesses Forward.",
  body: "From digital strategy and development to performance marketing and creative execution, we bring the right digital capabilities together to help businesses build stronger brands and achieve meaningful growth.",
} as const;

export const PROBLEMS = {
  eyebrow: "The challenge",
  heading: "You’re Working Hard. But Is Your Brand Moving Forward?",
  intro:
    "Most businesses don’t lack effort. They lack connection — between brand, channels, spend and direction.",
  solution: "We Turn Scattered Marketing Into a Structured Growth Engine.",
  items: [
    {
      id: "branding",
      title: "Inconsistent Branding",
      body: "Your brand looks and sounds different across your website, social channels and campaigns, so people struggle to recognise and remember you.",
      texture: "strata",
    },
    {
      id: "visibility",
      title: "Poor Digital Visibility",
      body: "The right customers are searching, but they aren’t finding you — or they find competitors first.",
      texture: "orbit",
    },
    {
      id: "spend",
      title: "Wasted Advertising Spend",
      body: "Campaigns run without clear targeting, tracking or optimisation, so budget goes out faster than results come in.",
      texture: "grain",
    },
    {
      id: "strategy",
      title: "No Clear Strategy",
      body: "Activity happens channel by channel, without shared priorities or a plan that connects it all to business goals.",
      texture: "mesh",
    },
  ] satisfies ProblemItem[],
} as const;
