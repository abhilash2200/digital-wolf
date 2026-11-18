export type NavLink = {
  label: string;
  href: string;
};

export type ServiceLink = NavLink;

export type GlossTexture =
  | "strata"
  | "orbit"
  | "grain"
  | "mesh"
  | "facets"
  | "pulse";

export type ProblemItem = {
  id: string;
  title: string;
  body: string;
  texture: GlossTexture;
};

export type Service = {
  id: string;
  title: string;
  summary: string;
  items: string[];
  /** Abstract service artwork (decorative). */
  image: string;
};

export type ServiceCategory = {
  id: string;
  label: string;
  title: string;
  services: Service[];
};

export type Capability = {
  id: "strategy" | "technology" | "creativity" | "performance";
  title: string;
  body: string;
};

export type ProcessStage = {
  id: string;
  title: string;
  body: string;
};

/** Case study fields. `null` = not yet supplied; render as a labelled placeholder. */
export type CaseStudy = {
  id: string;
  client: string | null;
  industry: string | null;
  challenge: string | null;
  strategy: string | null;
  execution: string | null;
  services: string[];
  outcomes: string | null;
  href: string | null;
  /** Real, approved project imagery. When null, concept artwork is shown, labelled as such. */
  image: string | null;
};

export type Testimonial = {
  quote: string;
  /** Layout stand-in, not a real quote: rendered with a visible "Sample" label. Remove before launch. */
  sample?: boolean;
  name?: string;
  role?: string;
  company?: string;
  logo?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};
