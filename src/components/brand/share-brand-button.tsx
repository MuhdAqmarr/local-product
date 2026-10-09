"use client";

import { Share2 } from "@/components/ui/lucide";
import { toast } from "@/components/feedback/toast-store";
import { IconButton } from "@/components/ui/icon-button";
import { useI18n } from "@/i18n/client";
import { fmt } from "@/i18n/format";

/** Brand profile "Share" / "Kongsi" (DESIGN §8.5 #1): Web Share where available, else copy the link + toast. */
export function ShareBrandButton({ name, text, className }: { name: string; text: string; className?: string }) {
  const t = useI18n().m.brands.profile;
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
      toast({ message: t.copied, tone: "success" });
    } catch {
      toast({ message: t.shareFailed, tone: "error" });
    }
  };

  return <IconButton label={fmt(t.share, { name })} icon={<Share2 aria-hidden strokeWidth={2.25} />} onClick={share} className={className} />;
}
