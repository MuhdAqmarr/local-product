"use client";

import { setMotionPref, useMotionPref, useSiteMotionReduced } from "@/components/providers/motion-pref";
import { toast } from "@/components/feedback/toast-store";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/utils";


/**
 * The site-wide "Kurangkan animasi" control (WCAG 2.2.2 pause mechanism). Persists in localStorage
 * and is applied before first paint by MotionPrefScript.
 * - `switch`: a labelled switch (Kategori sheet)
 * - `footer`: "Animasi: Penuh / Kurang" two-option toggle on ink
 */
export function MotionToggle({ variant = "footer", className }: { variant?: "switch" | "footer"; className?: string }) {
  const siteReduced = useSiteMotionReduced();
  const pref = useMotionPref();
  const osReduced = pref === "always" && !siteReduced;
  const t = useI18n().m.common.motion;
  const apply = (reduce: boolean) => {
    setMotionPref(reduce);
    toast({ message: reduce ? t.toastReduced : t.toastFull, tone: "success" });
  };

  if (variant === "switch") {
    return (
      <Switch
        className={className}
        checked={siteReduced}
        onCheckedChange={apply}
        label={t.switchLabel}
        description={osReduced ? t.switchOs : t.switchHelp}
      />
    );
  }

  return (
    <div role="group" aria-label={t.group} className={cn("inline-flex items-center gap-2", className)}>
      <span aria-hidden="true" className="text-caption text-ink-dim">{t.footerLabel}</span>
      <div className="inline-flex rounded-full border-[1.5px] border-ink-dim p-0.5">
        {[
          { label: t.full, reduce: false },
          { label: t.reduced, reduce: true },
        ].map((o) => {
          const pressed = siteReduced === o.reduce;
          return (
            <button
              key={o.label}
              type="button"
              aria-pressed={pressed}
              onClick={() => !pressed && apply(o.reduce)}
              className={cn(
                "relative min-h-8 rounded-full px-3 text-[12px] font-semibold transition-colors duration-150 after:absolute after:-inset-y-1.5 after:inset-x-0 after:content-['']",
                pressed ? "bg-mangga text-ink" : "text-santan hover:bg-white/10",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
