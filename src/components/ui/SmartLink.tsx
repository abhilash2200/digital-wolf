"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

const LIQUID_TRANSITION = ["liquid"];

/**
 * next/link with two site-wide behaviours:
 *  - Homepage section links ("/#id") stay same-page hash jumps when already on
 *    "/". Otherwise "/?utm_source=…" → "/#id" becomes a route change (the query
 *    is dropped) and the page doesn't scroll.
 *  - Links to a different route carry the "liquid" view-transition type, which
 *    pages turn into the liquid wipe (see PageTransition and globals.css).
 */
export function SmartLink({ href, ...props }: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const resolved =
    typeof href === "string" && href.startsWith("/#") && pathname === "/"
      ? href.slice(1)
      : href;
  const target = typeof resolved === "string" ? resolved.split(/[?#]/)[0] : resolved.pathname;
  const changesRoute = Boolean(target) && target !== pathname;
  return (
    <Link
      href={resolved}
      transitionTypes={changesRoute ? LIQUID_TRANSITION : undefined}
      {...props}
    />
  );
}
