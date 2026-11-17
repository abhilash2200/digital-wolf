import type { EnquiryValues } from "./schema";

export type EnquiryResult = { status: "demo" };

/**
 * FRONTEND DEMO HANDLER — this phase has no backend.
 *
 * It deliberately does nothing with the values: no network request, no
 * storage, no logging. It exists so the form calls a single seam; a later phase
 * replaces this function (e.g. with a server action or API call) without
 * touching the form UI or validation schema.
 */
export async function submitEnquiry(values: EnquiryValues): Promise<EnquiryResult> {
  void values;
  return { status: "demo" };
}
