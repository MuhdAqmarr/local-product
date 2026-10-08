import type { ReactNode } from "react";
import { Oyen, type OyenMood } from "@/components/art/oyen";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateAction {
  label: string;
  /** Internal path or external URL (set `external`). Omit `href` and pass `onClick` from client parents. */
  href?: string;
  external?: boolean;
  onClick?: () => void;
  trailing?: "arrow" | "outbound";
}

export interface EmptyStateProps {
  mood?: OyenMood;
  title: ReactNode;
  body?: ReactNode;
  primary?: EmptyStateAction;
  secondary?: EmptyStateAction;
  /** Optional Gochi Hand side note (decorative; never the only carrier of information). */
  note?: string;
  /** Heading level for the title (default h2). */
  as?: "h1" | "h2" | "h3";
  className?: string;
  children?: ReactNode;
}

function Action({ action, variant }: { action: EmptyStateAction; variant: "primary" | "ghost" }) {
  if (action.href) {
    return action.external ? (
      <Button variant={variant} href={action.href} external trailing={action.trailing ?? "outbound"}>
        {action.label}
      </Button>
    ) : (
      <Button variant={variant} href={action.href} trailing={action.trailing}>
        {action.label}
      </Button>
    );
  }
  return (
    <Button variant={variant} onClick={action.onClick} trailing={action.trailing}>
      {action.label}
    </Button>
  );
}

/**
 * Empty state (DESIGN §6.13): sunburst disc + Oyen (mood) → title → body → one primary + one ghost.
 * Copy lives in DESIGN §9.5. Oyen pops in once, then blinks/snoozes (paused offscreen by CSS reduce rules).
 */
export function EmptyState({ mood = "tidur", title, body, primary, secondary, note, as: H = "h2", className, children }: EmptyStateProps) {
  return (
    <div className={cn("mx-auto flex max-w-[360px] flex-col items-center py-12 text-center", className)}>
      <div aria-hidden className="relative grid size-40 place-items-center">
        <span className="absolute inset-0 rounded-full bg-sunburst opacity-60" />
        <Oyen mood={mood} size={120} className="relative animate-pop-in" />
        {note && <span className="hand text-hand absolute -right-10 top-2 whitespace-nowrap">{note}</span>}
      </div>
      <H className="mt-4 text-title-3 text-ink">{title}</H>
      {body && <p className="mt-2 max-w-[34ch] text-body text-ink-soft">{body}</p>}
      {(primary || secondary) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {primary && <Action action={primary} variant="primary" />}
          {secondary && <Action action={secondary} variant="ghost" />}
        </div>
      )}
      {children}
    </div>
  );
}
