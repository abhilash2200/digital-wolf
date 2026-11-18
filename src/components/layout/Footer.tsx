import { SmartLink as Link } from "@/components/ui/SmartLink";
import { cacheLife } from "next/cache";
import { Wordmark } from "@/components/ui/Wordmark";
import { NAV_LINKS, SERVICE_LINKS, SITE } from "@/constants/site";

const COMPANY_LINKS = [
  ...NAV_LINKS.filter((l) => l.href !== "/"),
  { label: "Contact", href: "/contact" },
];

// Legal pages don't exist yet — shown as pending, never linked to dead routes.
const LEGAL = ["Privacy Policy", "Terms of Use"];

export function Footer() {
  const hasContact = Boolean(SITE.email) || SITE.socials.length > 0;

  return (
    <footer className="liquid-bar border-t border-white/70">
      <div className="container-dw grid grid-cols-2 gap-x-6 gap-y-12 py-14 md:grid-cols-6 md:py-20 lg:grid-cols-12 lg:gap-x-6">
        <div className="col-span-2 md:col-span-6 lg:col-span-5">
          <Wordmark />
          <p className="mt-5 max-w-[40ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            {SITE.description}
          </p>
        </div>

        <FooterNav title="Services" links={SERVICE_LINKS} className="col-span-1 md:col-span-3 lg:col-span-3" />
        <FooterNav title="Company" links={COMPANY_LINKS} className="col-span-1 md:col-span-3 lg:col-span-2" />

        {hasContact && (
          <div className="col-span-2 md:col-span-6 lg:col-span-2">
            <p className="text-[0.9375rem] text-ink-muted">Contact</p>
            <ul className="mt-5 flex flex-col gap-2 text-[0.9375rem]">
              {SITE.email && (
                <li>
                  <a href={`mailto:${SITE.email}`} className="text-ink hover:text-ink-muted">
                    {SITE.email}
                  </a>
                </li>
              )}
              {SITE.socials.map((social) => (
                <li key={social.href}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ink-muted">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-line">
        <div className="container-dw flex flex-col gap-3 py-6 text-[0.8125rem] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear /> {SITE.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((label) => (
              <li key={label}>
                {label} <span className="italic">(pending)</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterNav({
  title,
  links,
  className,
}: {
  title: string;
  links: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <nav aria-label={`Footer ${title.toLowerCase()}`} className={className}>
      <p className="text-[0.9375rem] text-ink-muted">{title}</p>
      <ul className="mt-5 flex flex-col gap-1">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="inline-block py-1.5 text-[0.9375rem] text-ink transition-colors hover:text-ink-muted">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Cached so the static shell can be prerendered under Cache Components.
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
