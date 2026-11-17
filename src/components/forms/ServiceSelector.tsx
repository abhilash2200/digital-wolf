"use client";

import { Check } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { SERVICE_OPTIONS } from "@/lib/enquiry/schema";
import { cn } from "@/lib/cn";

/** Multi-select of services as accessible checkbox chips. */
export function ServiceSelector({
  registration,
  errorId,
  invalid,
}: {
  registration: UseFormRegisterReturn<"services">;
  errorId: string;
  invalid: boolean;
}) {
  return (
    <fieldset aria-describedby={invalid ? errorId : undefined}>
      <legend className="text-[0.875rem] font-medium text-ink">
        Interested services
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {SERVICE_OPTIONS.map((option) => (
          <label key={option.id} className="relative cursor-pointer">
            <input
              type="checkbox"
              value={option.id}
              aria-invalid={invalid || undefined}
              className="peer absolute inset-0 size-full cursor-pointer appearance-none rounded-full"
              {...registration}
            />
            <span
              className={cn(
                "pointer-events-none inline-flex min-h-11 items-center gap-2 rounded-full border bg-surface px-4 text-[0.875rem] text-ink transition-[background-color,border-color,color] duration-200",
                "border-input peer-hover:border-silver",
                "peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink",
                "peer-aria-invalid:border-destructive/60",
                "[&>svg]:hidden peer-checked:[&>svg]:block",
              )}
            >
              <Check className="size-3.5" strokeWidth={2} aria-hidden="true" />
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
