"use client";

import { SmartLink as Link } from "@/components/ui/SmartLink";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useLiquidLens } from "@/hooks/useLiquidLens";

type Variant = "primary" | "secondary" | "inverse" | "ghost" | "glass";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full font-medium tracking-[-0.005em] transition-[background-color,color,border-color,box-shadow] duration-300 ease-editorial disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:bg-[#2a2a2a] shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]",
  secondary:
    "border border-ink/20 text-ink hover:border-ink hover:bg-ink/[0.03]",
  inverse: "bg-paper text-ink hover:bg-white",
  ghost: "text-ink hover:text-ink-muted px-0",
  // Liquid glass (refracts on Chromium desktop; frosted elsewhere).
  glass: "liquid-glass text-ink",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-6 text-base sm:h-14 sm:px-7",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
};

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="relative -mr-1 inline-flex size-5 items-center justify-center overflow-hidden"
    >
      <ArrowRight
        className="size-4 transition-transform duration-500 ease-editorial group-hover/btn:translate-x-5 motion-reduce:transition-none"
        strokeWidth={1.75}
      />
      <ArrowRight
        className="absolute size-4 -translate-x-5 transition-transform duration-500 ease-editorial group-hover/btn:translate-x-0 motion-reduce:transition-none"
        strokeWidth={1.75}
      />
    </span>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  ...props
}: CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children" | "ref">) {
  const glass = variant === "glass";
  const lensRef = useLiquidLens<HTMLAnchorElement>(glass);
  return (
    <Link
      ref={lensRef}
      data-liquid-glass={glass ? "" : undefined}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  type = "button",
  ...props
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children" | "ref">) {
  const glass = variant === "glass";
  const lensRef = useLiquidLens<HTMLButtonElement>(glass);
  return (
    <button
      ref={lensRef}
      type={type}
      data-liquid-glass={glass ? "" : undefined}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
