import { ViewTransition, type ReactNode } from "react";

const TYPES = { "nav-forward": "nav-forward", "nav-back": "nav-back", "nav-tab": "nav-tab", default: "none" } as const;

/**
 * Wrap each PAGE's content (not the layout) so route changes slide/fade by transition type
 * (DESIGN §7.5 #16–17): Links pass `transitionTypes={["nav-forward" | "nav-back" | "nav-tab"]}`.
 * Without browser support it simply renders the children.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={TYPES} exit={TYPES} default="none">
      {children}
    </ViewTransition>
  );
}

/** Suspense fallback wrapper: the skeleton fades out (120 ms) when content arrives. */
export function SkeletonOut({ children }: { children: ReactNode }) {
  return (
    <ViewTransition exit="skeleton-out" default="none">
      {children}
    </ViewTransition>
  );
}

/** Suspense content wrapper: fades in + rises 8 px (DESIGN §7.5 #18). */
export function ContentIn({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="content-in" default="none">
      {children}
    </ViewTransition>
  );
}
