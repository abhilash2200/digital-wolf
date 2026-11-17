"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

// The dialog, form, validation and Base UI dialog code load on first open,
// keeping them out of the initial bundle for visitors who never enquire.
const loadDialog = () => import("./EnquiryDialog");
const EnquiryDialog = dynamic(loadDialog, { ssr: false });

/** Warm the dialog chunk on CTA hover/focus so the first open feels instant. */
export function preloadEnquiryDialog() {
  void loadDialog();
}

type EnquiryContextValue = {
  /** Open the enquiry modal, optionally with a service preselected. */
  openEnquiry: (serviceId?: string) => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function useEnquiry() {
  const context = useContext(EnquiryContext);
  if (!context) throw new Error("useEnquiry must be used inside <EnquiryProvider>");
  return context;
}

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [service, setService] = useState<string | undefined>();
  // Increments per opening; 0 means the dialog has never been requested.
  const [session, setSession] = useState(0);

  const openEnquiry = useCallback((serviceId?: string) => {
    setService(serviceId);
    setSession((n) => n + 1);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openEnquiry }), [openEnquiry]);

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      {session > 0 && (
        <EnquiryDialog open={open} onOpenChange={setOpen} service={service} session={session} />
      )}
    </EnquiryContext.Provider>
  );
}
