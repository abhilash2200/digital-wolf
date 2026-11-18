"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ServiceSelector } from "./ServiceSelector";
import { EMPTY_ENQUIRY, enquirySchema, type EnquiryValues } from "@/lib/enquiry/schema";
import { submitEnquiry } from "@/lib/enquiry/submit";
import { CTA } from "@/constants/site";
import { cn } from "@/lib/cn";

type Variant = "modal" | "page";

// True only after hydration. The submit button stays disabled until then so a
// pre-hydration submit can't fall back to a native GET that puts personal data in the URL.
const subscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function ContactForm({
  variant,
  header,
  defaultServices = [],
  onDone,
}: {
  variant: Variant;
  /** Rendered above the fields (and hidden on success). */
  header?: ReactNode;
  defaultServices?: string[];
  /** Modal only: closes the dialog from the success state. */
  onDone?: () => void;
}) {
  const uid = useId();
  const hydrated = useHydrated();
  const [sent, setSent] = useState(false);
  const successRef = useRef<HTMLHeadingElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { ...EMPTY_ENQUIRY, services: defaultServices },
    mode: "onTouched",
  });

  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  const onValid = async (values: EnquiryValues) => {
    await submitEnquiry(values);
    setSent(true);
  };

  const startOver = () => {
    reset({ ...EMPTY_ENQUIRY, services: defaultServices });
    setSent(false);
  };

  const id = (name: string) => `${uid}-${name}`;
  const errorCount = Object.keys(errors).length;
  const isModal = variant === "modal";

  const bodyClass = cn(
    isModal && "min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-8 sm:px-8 md:px-10 md:pt-10",
  );
  const footerClass = cn(
    "flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between",
    isModal ? "shrink-0 border-t border-line bg-paper px-5 py-4 sm:px-8 md:px-10" : "mt-10 border-t border-line pt-6",
  );

  if (sent) {
    return (
      <div className={cn(isModal && "flex min-h-0 flex-1 flex-col")}>
        <div className={bodyClass} data-lenis-prevent={isModal ? "" : undefined} role="status">
          <p className="text-eyebrow text-ink-muted">Demo complete</p>
          <h3
            ref={successRef}
            tabIndex={-1}
            className="mt-4 text-[1.75rem] leading-tight font-medium tracking-[-0.025em] text-ink outline-none md:text-[2rem]"
          >
            Your details passed validation.
          </h3>
          <div className="mt-6 flex gap-3 rounded-md border border-line bg-surface p-4 text-[0.9375rem] leading-relaxed text-ink">
            <Info className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            <p>
              <strong className="font-medium">This is a frontend demo.</strong> Your enquiry has{" "}
              <strong className="font-medium">not</strong> been sent, saved or shared, and nobody at
              Digital Wolf has received it.
            </p>
          </div>
        </div>
        <div className={footerClass}>
          <Button variant="secondary" onClick={startOver}>
            Start again
          </Button>
          {isModal && onDone && <Button onClick={onDone}>Close</Button>}
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onValid)}
      className={cn(isModal && "flex min-h-0 flex-1 flex-col")}
      aria-describedby={id("demo-note")}
    >
      <div className={bodyClass} data-lenis-prevent={isModal ? "" : undefined}>
        {header}

        <div className={cn("grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2", header ? "mt-8" : undefined)}>
          <Field id={id("fullName")} label="Full name" error={errors.fullName?.message}>
            <Input
              id={id("fullName")}
              autoComplete="name"
              aria-invalid={!!errors.fullName || undefined}
              aria-describedby={errors.fullName ? `${id("fullName")}-error` : undefined}
              {...register("fullName")}
            />
          </Field>
          <Field id={id("email")} label="Work email" error={errors.email?.message}>
            <Input
              id={id("email")}
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-invalid={!!errors.email || undefined}
              aria-describedby={errors.email ? `${id("email")}-error` : undefined}
              {...register("email")}
            />
          </Field>
          <Field id={id("phone")} label="Phone" error={errors.phone?.message}>
            <Input
              id={id("phone")}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={!!errors.phone || undefined}
              aria-describedby={errors.phone ? `${id("phone")}-error` : undefined}
              {...register("phone")}
            />
          </Field>
          <Field id={id("company")} label="Company" error={errors.company?.message}>
            <Input
              id={id("company")}
              autoComplete="organization"
              aria-invalid={!!errors.company || undefined}
              aria-describedby={errors.company ? `${id("company")}-error` : undefined}
              {...register("company")}
            />
          </Field>
          <Field id={id("website")} label="Website" optional error={errors.website?.message} className="sm:col-span-2">
            <Input
              id={id("website")}
              inputMode="url"
              autoComplete="url"
              placeholder="example.com"
              aria-invalid={!!errors.website || undefined}
              aria-describedby={errors.website ? `${id("website")}-error` : undefined}
              {...register("website")}
            />
          </Field>

          <div className="sm:col-span-2">
            <ServiceSelector
              registration={register("services")}
              errorId={`${id("services")}-error`}
              invalid={!!errors.services}
            />
            <FieldError id={`${id("services")}-error`} message={errors.services?.message} />
          </div>

          <Field id={id("message")} label="Project description" error={errors.message?.message} className="sm:col-span-2">
            <Textarea
              id={id("message")}
              rows={5}
              placeholder="Tell us about your business, your challenges and where you want to go."
              aria-invalid={!!errors.message || undefined}
              aria-describedby={errors.message ? `${id("message")}-error` : undefined}
              {...register("message")}
            />
          </Field>
        </div>
      </div>

      <div className={footerClass}>
        <p id={id("demo-note")} className="flex items-start gap-2 text-[0.8125rem] leading-snug text-ink-muted sm:max-w-[34ch]">
          <Info className="mt-px size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          Frontend demo — submitting validates your details but sends and stores nothing.
        </p>
        <div className="flex flex-col sm:items-end">
          {/* Always mounted (never display:none) so screen readers announce changes. */}
          <p aria-live="polite" className="text-[0.8125rem] text-destructive [&:not(:empty)]:mb-2">
            {submitCount > 0 && errorCount > 0
              ? `Please check the ${errorCount === 1 ? "highlighted field" : `${errorCount} highlighted fields`}.`
              : ""}
          </p>
          <Button type="submit" size="lg" arrow disabled={!hydrated || isSubmitting} className="w-full sm:w-auto">
            {CTA.contact}
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  optional,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <Label htmlFor={id}>
        {label}
        {optional && <span className="font-normal text-ink-muted">(optional)</span>}
      </Label>
      {children}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-[0.8125rem] leading-snug text-destructive">
      {message}
    </p>
  );
}
