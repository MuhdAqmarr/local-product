"use client";

import { Share2 } from "@/components/ui/lucide";
import { toast } from "@/components/feedback/toast-store";
import { IconButton } from "@/components/ui/icon-button";

/** Brand profile "Kongsi" (DESIGN §8.5 #1): Web Share where available, else copy the link + toast. */
export function ShareBrandButton({ name, text, className }: { name: string; text: string; className?: string }) {
  const share = async () => {
    const url = window.location.origin + window.location.pathname;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: `${name} · LokalLah!`, text, url });
        return;
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast({ message: "Link dah copy. Share dengan geng!", tone: "success" });
    } catch {
      toast({ message: "Alamak, tak jadi. Cuba lagi?", tone: "error" });
    }
  };

  return <IconButton label={`Kongsi ${name}`} icon={<Share2 aria-hidden strokeWidth={2.25} />} onClick={share} className={className} />;
}
