import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Keyboard hint chip ("⌘K", "Esc"). */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-6 min-w-6 items-center justify-center rounded-xs border-[1.5px] border-garis bg-santan px-1.5 font-sans text-[11px] font-semibold leading-none text-ink-soft",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
