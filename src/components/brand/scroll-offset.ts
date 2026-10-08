/**
 * Height the sticky header occupies once the page is scrolled (awning tucked): `--header-h`.
 * Measuring the header's rect instead is wrong mid-scroll, because on phones it hides while
 * scrolling down and comes back on the way up.
 */
export function headerOffset(): number {
  if (typeof window === "undefined") return 0;
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h"));
  return Number.isFinite(v) ? v : 56;
}
