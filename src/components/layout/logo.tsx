import { ShellLink } from "./shell-link";
import { LogoMark } from "@/components/art/logo-mark";
import { cn } from "@/lib/utils";

/** Mark + Fredoka wordmark: "Lokal" ink + "Lah!" bandung-pekat (on ink: santan + jambu). Links home. */
export function Logo({ onInk = false, size = "md", className }: { onInk?: boolean; size?: "sm" | "md"; className?: string }) {
  return (
    <ShellLink
      href="/"
      aria-label="LokalLah! — Utama"
      transitionTypes={["nav-tab"]}
      className={cn("group inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full font-num leading-none", className)}
    >
      <LogoMark size={size === "sm" ? 20 : 22} className={size === "md" ? "lg:size-7" : undefined} />
      <span aria-hidden className={cn(size === "sm" ? "text-[20px]" : "text-[22px] lg:text-[26px]", "tracking-[-0.01em]")}>
        <span className={onInk ? "text-santan" : "text-ink"}>Lokal</span>
        <span className={onInk ? "text-jambu" : "text-bandung-pekat"}>Lah!</span>
      </span>
    </ShellLink>
  );
}
