import { CATEGORIES, STATES } from "@/lib/taxonomy";

/* Shared by the suggest form (client, on blur + submit) and the suggestBrand Server Action. */

export type SuggestField = "nama" | "link" | "kategori" | "negeri" | "kenapa" | "email";

/**
 * Validation results are language-neutral codes; the form shows `about.form.errors[code]` in the
 * page language (the Server Action has no locale of its own).
 */
export type SuggestError = "nameShort" | "linkMissing" | "linkInvalid" | "category" | "state" | "email";
export type SuggestErrors = Partial<Record<SuggestField, SuggestError>>;

export type SuggestResult =
  | { status: "sent" }
  /** No webhook: a prefilled `mailto:` for the visitor to send from their own email app. */
  | { status: "email"; url: string }
  | { status: "invalid"; errors: SuggestErrors }
  /** `url`: a prefilled email to send instead (the webhook failed and `SUGGEST_EMAIL` is set). */
  | { status: "error"; url?: string };

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
export function validateSuggestion(values: Record<SuggestField, string>): SuggestErrors {
  const errors: SuggestErrors = {};
  if (values.nama.length < 2) errors.nama = "nameShort";
  if (!values.link) errors.link = "linkMissing";
  else if (!normaliseLink(values.link)) errors.link = "linkInvalid";
  if (values.kategori && !CATEGORIES.some((c) => c.slug === values.kategori)) errors.kategori = "category";
  if (values.negeri && !(STATES as readonly string[]).includes(values.negeri)) errors.negeri = "state";
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "email";
  return errors;
}


/**
 * Where suggestions go: POSTed to `SUGGEST_WEBHOOK_URL`, else a prefilled email to `SUGGEST_EMAIL`,
 * else nowhere yet ("closed": the page shows a short note instead of the form).
 */
export type SuggestMode = "webhook" | "email" | "closed";

/**
 * The Google Form receives suggestions in production only (so dev servers and preview deploys never
 * add rows to the owner's sheet). SUGGEST_GOOGLE_FORM=on forces it on (local testing), =off disables it.
 */
export function googleFormSwitch(): boolean {
  const flag = process.env.SUGGEST_GOOGLE_FORM;
  if (flag === "off") return false;
  return flag === "on" || process.env.VERCEL_ENV === "production";
}

/** "webhook" = we store suggestions ourselves (Google Form or webhook); "email" = visitor sends it. */
export function suggestMode(): SuggestMode {
  if (googleFormSwitch() || process.env.SUGGEST_WEBHOOK_URL) return "webhook";
  if (process.env.SUGGEST_EMAIL?.trim()) return "email";
  return "closed";
}
