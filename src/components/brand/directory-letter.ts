import { normalizeText } from "@/lib/search";

/** A–Z rail letter: first letter of the (normalised) name, "#" for anything else. Server and client. */
export function letterOf(name: string): string {
  const c = normalizeText(name).charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : "#";
}
