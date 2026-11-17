"use client";

import { useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactForm } from "./ContactForm";

/** The enquiry modal. Loaded lazily by EnquiryProvider on first open. */
export default function EnquiryDialog({
  open,
  onOpenChange,
  service,
  session,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: string;
  /** Changes on every opening so the form starts clean. */
  session: number;
}) {
  // On touch devices, focus the title instead of the first field so the
  // virtual keyboard doesn't cover the dialog the moment it opens.
  const titleRef = useRef<HTMLHeadingElement>(null);
  const initialFocus = useCallback(
    () => (window.matchMedia("(pointer: coarse)").matches ? titleRef.current : true),
    [],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent initialFocus={initialFocus}>
        <ContactForm
          key={session}
          variant="modal"
          defaultServices={service ? [service] : []}
          onDone={() => onOpenChange(false)}
          header={
            <DialogHeader>
              <DialogTitle ref={titleRef} tabIndex={-1} className="outline-none">
                Tell us about your project.
              </DialogTitle>
              <DialogDescription>
                Share a few details about your business and what you’re looking for.
              </DialogDescription>
            </DialogHeader>
          }
        />
      </DialogContent>
    </Dialog>
  );
}
