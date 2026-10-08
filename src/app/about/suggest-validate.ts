import { CATEGORIES, STATES } from "@/lib/taxonomy";

/* Shared by the suggest form (client, on blur + submit) and the suggestBrand Server Action. */

export type SuggestField = "nama" | "link" | "kategori" | "negeri" | "kenapa" | "email";

export type SuggestResult =
  | { status: "sent" }
  | { status: "github"; url: string }
  | { status: "invalid"; errors: Partial<Record<SuggestField, string>> }
  | { status: "error"; message: string; url?: string };

export const LIMITS = { nama: 80, link: 200, kenapa: 600, email: 120 } as const;

export function text(form: FormData, key: string, max: number): string {
  const raw = form.get(key);
  return typeof raw === "string" ? raw.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

/** Accepts a URL, a bare domain ("kedai.my") or an Instagram handle ("@kedai"). */
export function normaliseLink(value: string): string | null {
  const v = value.trim();
  if (/^@[A-Za-z0-9._]{1,30}$/.test(v)) return v;
  const withScheme = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withScheme);
    if (!u.hostname.includes(".") || /\s/.test(v)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

/** Validation shared by the client (on blur / submit) and the server action. */
export function validateSuggestion(values: Record<SuggestField, string>): Partial<Record<SuggestField, string>> {
  const errors: Partial<Record<SuggestField, string>> = {};
  if (values.nama.length < 2) errors.nama = "Tulis nama jenama (sekurang-kurangnya 2 huruf).";
  if (!values.link) errors.link = "Letak link kedai online atau Instagram jenama ni.";
  else if (!normaliseLink(values.link)) errors.link = "Link tak sah. Contoh: kedaijenama.com atau @jenama";
  if (values.kategori && !CATEGORIES.some((c) => c.slug === values.kategori)) errors.kategori = "Pilih kategori dari senarai.";
  if (values.negeri && !(STATES as readonly string[]).includes(values.negeri)) errors.negeri = "Pilih negeri dari senarai.";
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Email tak sah. Boleh biar kosong.";
  return errors;
}

