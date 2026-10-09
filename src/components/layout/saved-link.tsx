"use client";

import { ShellLink } from "./shell-link";
import { Heart } from "@/components/ui/lucide";
import { useSaved } from "@/lib/saved";
import { popStyle } from "@/components/ui/pop";
import { CountBubble } from "@/components/ui/count-bubble";
import { isActivePath } from "./nav-link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** Desktop header "Simpan" heart (44 px pop), count bubble, and the fly-to-Simpan target on desktop. */
export function SavedLink() {
  const { count } = useSaved();
  const active = isActivePath(usePathname(), "/saved");
  return (
    <ShellLink
      href="/saved"
      transitionTypes={["nav-tab"]}
      aria-label={count ? `Simpan, ${count} item` : "Simpan"}
      aria-current={active ? "page" : undefined}
      data-saved-target=""
      className="pop relative shrink-0"
      style={popStyle({ offset: 2 })}
    >
      <span className={cn("pop-face size-11", active ? "bg-bandung-tint" : "bg-putih")}>
        <Heart aria-hidden size={20} strokeWidth={2.25} className={active ? "fill-bandung" : undefined} />
      </span>
      <CountBubble count={count} className="absolute -right-1.5 -top-1.5 z-10" />
    </ShellLink>
  );
}
