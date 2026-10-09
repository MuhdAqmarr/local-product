"use client";

import { useEffect, useMemo, useRef, useState, useTransition, type FocusEvent, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { Send } from "@/components/ui/lucide";
import { Oyen } from "@/components/art/oyen";
import { Particles } from "@/components/art/particles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { suggestBrand } from "@/app/[lang]/about/actions";
import { LIMITS, validateSuggestion, type SuggestErrors, type SuggestField, type SuggestResult } from "@/app/[lang]/about/suggest-validate";
import { useI18n } from "@/i18n/client";
import { rich } from "@/i18n/rich";
import { CATEGORIES, categoryName, STATES } from "@/lib/taxonomy";

const EMPTY: Record<SuggestField, string> = { nama: "", link: "", kategori: "", negeri: "", kenapa: "", email: "" };
const STATE_OPTIONS = STATES.map((s) => ({ value: s, label: s }));

/**
 * "Cadang jenama" form (DESIGN §8.8 #6). Validates on blur and submit (shared rules with the
 * Server Action), prefills `?nama=` after mount, and is honest about where the suggestion goes:
 * - webhook configured → saved; Oyen `happy` + celebrate burst + thank-you (role=status)
 * - email mode (no webhook, `SUGGEST_EMAIL` set) → nothing is stored here; we hand over a
 *   prefilled email for the visitor to send from their own email app.
 * The page doesn't render the form at all when neither is configured. Never link to the source repo.
 * Validation returns codes; messages come from `about.form.errors` (needs the `about` namespace).
 */
export function SuggestForm({ mode = "email" }: { mode?: "webhook" | "email" }) {
  const { m, locale, plural } = useI18n();
  const t = m.about.form;
  const categoryOptions = useMemo(() => CATEGORIES.map((c) => ({ value: c.slug, label: categoryName(c, locale) })), [locale]);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<SuggestErrors>({});
  const errorText = (field: SuggestField) => {
    const code = errors[field];
    return code ? t.errors[code] : undefined;
  };
  const [result, setResult] = useState<SuggestResult | null>(null);
  const [pending, startTransition] = useTransition();
  const [burst, setBurst] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  /** Error count for screen readers, announced on submit (polite live region). */
  const [announce, setAnnounce] = useState("");
  /** When the form became usable; the time taken to fill it goes with the submit (bot check). */
  const openedAt = useRef(0);
  useEffect(() => {
    openedAt.current = performance.now();
  }, []);

  // ?nama= prefill (from search "Cadang jenama ni" / directory empty state). Client-only URL read.
  useEffect(() => {
    const nama = new URLSearchParams(window.location.search).get("nama")?.trim();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL state is client-only; read once after hydration
    if (nama) setValues((v) => (v.nama ? v : { ...v, nama: nama.slice(0, LIMITS.nama) }));
  }, []);

  useEffect(() => {
    if (result?.status === "sent" || result?.status === "email") doneRef.current?.focus();
  }, [result]);

  const set = (field: SuggestField) => (e: { target: { value: string } }) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: validateSuggestion({ ...values, [field]: value })[field] }));
  };

  const blur = (field: SuggestField) => (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!e.target.value && field !== "nama" && field !== "link") return;
    setErrors((prev) => ({ ...prev, [field]: validateSuggestion({ ...values, [field]: e.target.value })[field] }));
  };

  const focusFirstError = (found: SuggestErrors): boolean => {
    const first = (Object.keys(EMPTY) as SuggestField[]).find((f) => found[f]);
    if (!first) return false;
    // Render aria-invalid + the error text first, so focusing the field reads the error out.
    flushSync(() => setErrors(found));
    setAnnounce(plural(Object.keys(found).length, t.errorSummary));
    formRef.current?.querySelector<HTMLElement>(`#cadang-${first}`)?.focus();
    return true;
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateSuggestion(values);
    if (focusFirstError(found)) return;
    setErrors(found);
    setAnnounce("");
    const data = new FormData(event.currentTarget);
    data.set("e", String(Math.round(performance.now() - openedAt.current)));
    startTransition(async () => {
      const res = await suggestBrand(data).catch((): SuggestResult => ({ status: "error" }));
      if (res.status === "invalid") focusFirstError(res.errors);
      if (res.status === "sent") setBurst((b) => b + 1);
      setResult(res);
    });
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setResult(null);
  };

  if (result?.status === "sent" || result?.status === "email") {
    const sent = result.status === "sent";
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="flex flex-col items-center py-6 text-center outline-none animate-rise-in">
        <div className="relative grid size-36 place-items-center">
          <span aria-hidden="true" className="absolute inset-0 rounded-full bg-sunburst opacity-60" />
          <Oyen mood="happy" size={112} className="relative animate-pop-in" />
          <Particles burst={burst} preset="celebrate" />
        </div>
        {sent ? (
          <>
            <p className="mt-4 text-title-3 text-ink">{t.sentTitle}</p>
            <p className="mt-2 max-w-[40ch] text-body text-ink-2">{t.sentBody}</p>
          </>
        ) : (
          <>
            <p className="mt-4 text-title-3 text-ink">{t.emailTitle}</p>
            <p className="mt-2 max-w-[42ch] text-body text-ink-2">{t.emailBody}</p>
            {/* mailto: opens the visitor's email app; no new tab. */}
            <Button className="mt-5" href={result.url} external target="_self" variant="primary" icon={<Send aria-hidden="true" />}>
              {t.emailCta}
            </Button>
          </>
        )}
        <Button className="mt-3" variant="ghost" size="sm" onClick={reset}>
          {t.another}
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate aria-describedby="cadang-note" className="grid gap-4 sm:grid-cols-2">
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
      <Input
        id="cadang-nama"
        name="nama"
        label={t.name}
        required
        maxLength={LIMITS.nama}
        autoComplete="off"
        value={values.nama}
        onChange={set("nama")}
        onBlur={blur("nama")}
        error={errorText("nama")}
        fieldClassName="sm:col-span-2"
      />
      <Input
        id="cadang-link"
        name="link"
        label={t.link}
        required
        inputMode="url"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={LIMITS.link}
        placeholder={t.linkPlaceholder}
        helper={t.linkHelper}
        value={values.link}
        onChange={set("link")}
        onBlur={blur("link")}
        error={errorText("link")}
        fieldClassName="sm:col-span-2"
      />
      <Select
        id="cadang-kategori"
        name="kategori"
        label={t.category}
        placeholder={t.notSure}
        options={categoryOptions}
        value={values.kategori}
        onChange={set("kategori")}
        error={errorText("kategori")}
      />
      <Select
        id="cadang-negeri"
        name="negeri"
        label={t.state}
        placeholder={t.notSure}
        options={STATE_OPTIONS}
        value={values.negeri}
        onChange={set("negeri")}
        error={errorText("negeri")}
      />
      <Textarea
        id="cadang-kenapa"
        name="kenapa"
        label={t.why}
        maxLength={LIMITS.kenapa}
        placeholder={t.whyPlaceholder}
        value={values.kenapa}
        onChange={set("kenapa")}
        fieldClassName="sm:col-span-2"
      />
      {mode === "webhook" && (
        <Input
          id="cadang-email"
          name="email"
          type="email"
          label={t.email}
          inputMode="email"
          autoComplete="email"
          maxLength={LIMITS.email}
          helper={t.emailHelper}
          value={values.email}
          onChange={set("email")}
          onBlur={blur("email")}
          error={errorText("email")}
          fieldClassName="sm:col-span-2"
        />
      )}
      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="cadang-laman">{t.honeypot}</label>
        <input id="cadang-laman" name="laman" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      {/* Lets the action label the prefilled issue in the visitor's language. */}
      <input type="hidden" name="lang" value={locale} />

      {result?.status === "error" && (
        <div
          role="alert"
          className="flex flex-col gap-2 rounded-input border-[1.5px] border-sambal-pekat bg-sambal-tint p-3 text-body-sm text-sambal-pekat sm:col-span-2"
        >
          <p className="font-semibold">{result.url ? t.sendFailed : t.failed}</p>
          {result.url && (
            <a href={result.url} className="inline-flex items-center gap-1 text-telang underline underline-offset-4">
              {t.sendDirect}
            </a>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p id="cadang-note" className="text-caption text-ink-soft">
          {rich(t.required, { star: <span className="text-bandung-pekat">*</span> })} {mode === "email" ? t.noteEmail : t.noteWebhook}
        </p>
        <Button type="submit" variant="primary" loading={pending} icon={<Send aria-hidden="true" />} className="sm:shrink-0">
          {t.submit}
        </Button>
      </div>
    </form>
  );
}
