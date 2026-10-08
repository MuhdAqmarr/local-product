import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export interface OdometerProps {
  value: number;
  prefix?: string;
  suffix?: string;
  /**
   * "intro": CSS roll from 0 at first paint (+70 ms per digit), before hydration; skipped once
   *          html[data-intro="done"] (hero stats only).
   * "reveal": digits sit at 0 until the nearest `[data-reveal]` ancestor gets `.is-in`, then roll.
   *          Put the odometer inside a `data-reveal` element.
   * "none":  static (still rolls old → new when `value` changes in a client parent).
   */
  roll?: "intro" | "reveal" | "none";
  className?: string;
  /** Screen-reader text; defaults to the formatted value with prefix/suffix. */
  srText?: string;
}

/**
 * Digit-cell odometer (DESIGN §6.18). Server-safe (no hooks): SSR prints the correct value,
 * digits are fixed 0.62em cells holding a 0–9 column translated to `--d`. Usable inside
 * client components too: changing `value` rolls via the CSS transition.
 */
export function Odometer({ value, prefix = "", suffix = "", roll = "none", className, srText }: OdometerProps) {
  const text = `${prefix}${formatCount(value)}${suffix}`;
  let p = 0;
  return (
    <span className={cn("relative inline-flex", className)}>
      <span className="sr-only">{srText ?? text}</span>
      <span aria-hidden className="odo leading-none" data-roll={roll === "none" ? undefined : roll}>
        {Array.from(text).map((ch, i) => {
          if (!/\d/.test(ch)) {
            return (
              <span key={`s${i}`} className="inline-block">
                {ch}
              </span>
            );
          }
          const style = { ["--d" as string]: Number(ch), ["--p" as string]: p++ };
          return (
            // Key by position from the right so a growing number keeps its cells (smooth roll).
            <span key={`d${text.length - i}`} className="odo-d" style={style}>
              <span>
                {DIGITS.map((d) => (
                  <i key={d}>{d}</i>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
