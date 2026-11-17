"use client";

import { SmartLink as Link } from "@/components/ui/SmartLink";
import { EnquiryButton } from "@/components/forms/EnquiryButton";
import { useEffect, useRef, type RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import {
  CTA,
  NAV_LINKS,
  SERVICE_LINKS,
  SITE,
} from "@/constants/site";
import { useScrollLock } from "@/hooks/useScrollLock";

const EASE = [0.22, 1, 0.36, 1] as const;

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({
  id,
  open,
  onClose,
  returnFocusRef,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useScrollLock(open);

  // Focus management, Escape and Tab trapping.
  useEffect(() => {
    if (!open) return;
    const returnTo = returnFocusRef.current;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      returnTo?.focus({ preventScroll: true });
    };
  }, [open, onClose, returnFocusRef]);

  // Close if the viewport grows into the desktop layout.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && onClose();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open, onClose]);

  const itemMotion = (index: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: EASE, delay: 0.08 + index * 0.04 },
          },
        };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id={id}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 flex flex-col bg-paper lg:hidden"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease: EASE } }}
        >
          <div className="container-dw flex h-(--header-h) shrink-0 items-center justify-between border-b border-line">
            <Wordmark onClick={onClose} />
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5"
            >
              <X className="size-6" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <div className="container-dw flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pt-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {NAV_LINKS.map((link, i) => (
                  <motion.li key={link.href} {...itemMotion(i)}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center justify-between border-b border-line py-4 text-[1.75rem] leading-tight font-medium tracking-[-0.025em] text-ink sm:text-[2rem]"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div className="mt-10" {...itemMotion(NAV_LINKS.length)}>
              <p className="text-eyebrow text-ink-muted">Services</p>
              <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1 xs:grid-cols-2">
                {SERVICE_LINKS.map((service) => (
                  <li key={service.label}>
                    <Link
                      href={service.href}
                      onClick={onClose}
                      className="block py-2 text-[0.9375rem] text-ink-muted transition-colors hover:text-ink"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="mt-auto flex flex-col gap-6 pt-10"
              {...itemMotion(NAV_LINKS.length + 1)}
            >
              <EnquiryButton
                onClick={onClose}
                size="lg"
                arrow
                className="w-full"
              >
                {CTA.contact}
              </EnquiryButton>

              {(SITE.email || SITE.socials.length > 0) && (
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
                  {SITE.email && (
                    <a href={`mailto:${SITE.email}`} className="hover:text-ink">
                      {SITE.email}
                    </a>
                  )}
                  {SITE.socials.map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-ink"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
