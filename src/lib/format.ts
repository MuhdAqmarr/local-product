/** RM29 / RM29.90 for ringgit; Intl currency format for anything else. */
export function formatPrice(amount: number, currency = "MYR"): string {
  if (currency === "MYR") return `RM${Number.isInteger(amount) ? amount.toFixed(0) : amount.toFixed(2)}`;
  try {
    return new Intl.NumberFormat("en-MY", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/** Manglish relative time: "baru tadi", "12 min lepas", "3 jam lepas", "2 hari lepas". */
export function timeAgo(iso: string, now: number = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - Date.parse(iso)) / 1000));
  if (seconds < 60) return "baru tadi";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min lepas`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} jam lepas`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} hari lepas`;
  const weeks = Math.round(days / 7);
  if (days < 30) return `${weeks} minggu lepas`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} bulan lepas`;
  return `${Math.round(months / 12)} tahun lepas`;
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-MY").format(value);
}

/** Tag outbound links so brands can see the traffic we send them. */
export function outboundUrl(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "lokallah");
    u.searchParams.set("utm_medium", "referral");
    return u.toString();
  } catch {
    return url;
  }
}
