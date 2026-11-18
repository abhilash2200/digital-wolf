import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { Plus } from "lucide-react"
import { cn } from "@/lib/cn"

// shadcn Accordion (Base UI primitives), restyled for the Digital Wolf editorial system.

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col border-t border-line", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, children, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("group/item relative border-b border-line", className)}
      {...props}
    >
      {children}
      {/* The open item's rule draws across in ember (the FAQ's one accent). */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-ember transition-transform duration-700 ease-editorial group-data-open/item:scale-x-100 motion-reduce:transition-none"
      />
    </AccordionPrimitive.Item>
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex min-h-16 flex-1 items-center justify-between gap-6 py-6 text-left text-[1.25rem] leading-[1.2] font-normal tracking-[-0.02em] text-ink transition-colors outline-none hover:text-ink-muted md:py-7 lg:text-[clamp(1.5rem,1rem+0.9vw,1.875rem)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solid focus-visible:outline-ink aria-disabled:pointer-events-none aria-disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <span
          aria-hidden="true"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-[border-color] duration-300 group-aria-expanded/accordion-trigger:border-ink/40"
        >
          <Plus
            className="size-4 transition-transform duration-500 ease-editorial group-aria-expanded/accordion-trigger:rotate-45 motion-reduce:transition-none"
            strokeWidth={1.75}
          />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up motion-reduce:animate-none"
      {...props}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) max-w-[58ch] pr-4 pb-8 text-body md:pr-14 text-ink-muted data-ending-style:h-0 data-starting-style:h-0 [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
