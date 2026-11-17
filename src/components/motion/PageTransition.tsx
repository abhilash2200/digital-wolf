import { ViewTransition, type ReactNode } from "react";

/**
 * Wraps a page's content so route changes tagged "liquid" (by SmartLink) play
 * the liquid wipe defined in globals.css. Other updates don't animate.
 * Lives in each page, not the layout: layouts persist, so enter/exit never fire there.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ liquid: "liquid", default: "none" }}
      exit={{ liquid: "liquid", default: "none" }}
      default="none"
    >
      <div>{children}</div>
    </ViewTransition>
  );
}
