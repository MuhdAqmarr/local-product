import { cn } from "@/lib/utils";
import { displayPrice, jimatText, priceSentence, type PriceFields } from "./price-text";

export interface PriceProps extends PriceFields {
  size?: "md" | "lg";
  /**
   * "Jimat RM13" pill. `auto` shows it only when the price row's container is ≥ 360 px
   * (needs an `@container` ancestor, e.g. the product card); `always` / `never` force it.
   */
  jimat?: "auto" | "always" | "never";
  /** Include the sr-only sentence. Off inside cards, whose link label already carries it. */
  announce?: boolean;
  className?: string;
}

/** Fredoka price, struck compare-at, "Jimat" pill, sr-only sentence (DESIGN §6.7). Works for USD stores too. */
export function Price({ price, compareAt, discount, currency, size = "md", jimat = "auto", announce = true, className }: PriceProps) {
  const promo = compareAt != null && compareAt > price;
  const saved = promo ? jimatText({ price, compareAt, currency }) : undefined;
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-1.5 gap-y-1", className)}>
      {announce && <span className="sr-only">{priceSentence({ price, compareAt, discount, currency })}</span>}
      <data
        value={price.toFixed(2)}
        aria-hidden="true"
        className={cn(
          "font-num tracking-[-0.01em] leading-none",
          size === "lg" ? "text-price-lg" : "text-[17px] min-[380px]:text-price",
          promo ? "text-bandung-pekat" : "text-ink",
        )}
      >
        {displayPrice(price, currency)}
      </data>
      {promo && (
        <s aria-hidden="true" className="text-caption whitespace-nowrap text-ink-soft decoration-bandung-pekat decoration-2">
          {displayPrice(compareAt, currency)}
        </s>
      )}
      {saved && jimat !== "never" && (
        <span
          aria-hidden="true"
          className={cn(
            "h-5 items-center rounded-full bg-pandan-tint px-1.5 text-[11px] leading-none font-semibold whitespace-nowrap text-pandan-pekat",
            jimat === "always" ? "inline-flex" : "hidden @[360px]:inline-flex",
          )}
        >
          {saved}
        </span>
      )}
    </div>
  );
}
