"use client";

import type { ComponentProps, MouseEvent } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { preloadEnquiryDialog, useEnquiry } from "./EnquiryProvider";

/** Href for the dedicated contact page, used as the no-JS / new-tab fallback. */
export function contactHref(serviceId?: string) {
  return serviceId ? `/contact?service=${encodeURIComponent(serviceId)}` : "/contact";
}

/** True for clicks the browser should handle itself (new tab, new window, etc.). */
export function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

/**
 * CTA that opens the enquiry modal. It is a real link to /contact, so
 * middle-click, "open in new tab" and no-JS still reach a working form.
 */
export function EnquiryButton({
  service,
  onClick,
  ...props
}: Omit<ComponentProps<typeof ButtonLink>, "href"> & { service?: string }) {
  const { openEnquiry } = useEnquiry();

  return (
    <ButtonLink
      href={contactHref(service)}
      onPointerEnter={preloadEnquiryDialog}
      onFocus={preloadEnquiryDialog}
      onClick={(event) => {
        onClick?.(event);
        if (isModifiedClick(event)) return;
        event.preventDefault();
        openEnquiry(service);
      }}
      {...props}
    />
  );
}
