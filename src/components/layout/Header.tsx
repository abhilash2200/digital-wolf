"use client";

import { SmartLink as Link } from "@/components/ui/SmartLink";
import { EnquiryButton } from "@/components/forms/EnquiryButton";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { CTA, NAV_LINKS } from "@/constants/site";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const MENU_ID = "mobile-menu";

// The drawer (and the Motion library it uses) loads on first open only.
const loadMenu = () => import("@/components/layout/MobileMenu").then((m) => m.MobileMenu);
const MobileMenu = dynamic(loadMenu, { ssr: false });

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const desktop = useMediaQuery("(min-width: 1024px)");
  const floating = scrolled && desktop;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 h-(--header-h) transition-[background-color,border-color,backdrop-filter] duration-500 ease-editorial",
          // Below desktop: a frosted bar once scrolled. Desktop: the bar stays clear
          // and the content floats in a liquid-glass pill instead.
          scrolled && !floating
            ? "border-b border-line/80 bg-paper/75 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-dw flex h-full items-center">
        <div
          data-liquid-glass
          data-liquid-bezel="26"
          data-liquid-strength="34"
          className={cn(
            "flex w-full items-center justify-between gap-6 transition-[height,padding,margin,border-radius] duration-500 ease-editorial",
            floating ? "liquid-glass h-[62px] rounded-full pr-2 pl-7" : "h-full",
          )}
        >
          <Wordmark className="shrink-0" priority />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group/nav relative py-2 text-[0.9375rem] text-ink transition-colors duration-300 hover:text-ink"
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0.5 h-px origin-right scale-x-0 bg-ink transition-transform duration-500 ease-editorial group-hover/nav:origin-left group-hover/nav:scale-x-100 group-focus-visible/nav:scale-x-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <EnquiryButton arrow className="hidden md:inline-flex">
              {CTA.header}
            </EnquiryButton>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => {
                setMenuLoaded(true);
                setMenuOpen(true);
              }}
              onPointerEnter={() => void loadMenu()}
              aria-expanded={menuOpen}
              aria-controls={MENU_ID}
              aria-label="Open menu"
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 lg:hidden"
            >
              <Menu className="size-6" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
        </div>
      </header>

      {menuLoaded && (
        <MobileMenu
          id={MENU_ID}
          open={menuOpen}
          onClose={closeMenu}
          returnFocusRef={toggleRef}
        />
      )}
    </>
  );
}
