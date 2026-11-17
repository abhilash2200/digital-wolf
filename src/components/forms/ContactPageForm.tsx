"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm } from "./ContactForm";
import { SERVICE_OPTIONS } from "@/lib/enquiry/schema";

/** Contact page form; preselects a service from `?service=` when it's a known id. */
export function ContactPageForm() {
  const service = useSearchParams().get("service");
  const known = SERVICE_OPTIONS.some((option) => option.id === service);
  return (
    <ContactForm
      key={known ? service : "none"}
      variant="page"
      defaultServices={known && service ? [service] : []}
    />
  );
}
