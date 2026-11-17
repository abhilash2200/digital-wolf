import { z } from "zod";
import { SERVICES } from "@/constants/content";

export const SERVICE_OPTIONS = [
  ...SERVICES.categories.flatMap((category) =>
    category.services.map((service) => ({ id: service.id, label: service.title })),
  ),
  { id: "not-sure", label: "Not sure yet" },
] as const;

const serviceIds = SERVICE_OPTIONS.map((option) => option.id);

// Domain with optional protocol and path, e.g. "example.com" or "https://example.co.uk/about".
const WEBSITE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;
// Digits with common separators; at least 7 digits overall.
const PHONE = /^\+?[\d\s().-]{7,20}$/;

export const enquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your work email.")
    .pipe(z.email("Please enter a valid email address.")),
  phone: z
    .string()
    .trim()
    .min(1, "Please enter a phone number.")
    .refine(
      (value) => PHONE.test(value) && value.replace(/\D/g, "").length >= 7,
      "Please enter a valid phone number.",
    ),
  company: z.string().trim().min(1, "Please enter your company name."),
  website: z
    .string()
    .trim()
    .refine((value) => value === "" || WEBSITE.test(value), "Please enter a valid website address, e.g. example.com."),
  services: z
    .array(z.string().refine((id) => serviceIds.includes(id)))
    .min(1, "Please choose at least one service, or “Not sure yet”."),
  message: z
    .string()
    .trim()
    .min(20, "Please tell us a little more — at least 20 characters.")
    .max(2000, "Please keep your description under 2,000 characters."),
});

export type EnquiryValues = z.infer<typeof enquirySchema>;

export const EMPTY_ENQUIRY: EnquiryValues = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  services: [],
  message: "",
};
