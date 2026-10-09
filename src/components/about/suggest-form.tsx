"use client";

import { useEffect, useRef, useState, useTransition, type FocusEvent, type FormEvent } from "react";
import { ExternalLink, Send } from "@/components/ui/lucide";
import { Oyen } from "@/components/art/oyen";
import { Particles } from "@/components/art/particles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { suggestBrand } from "@/app/about/actions";
import { LIMITS, validateSuggestion, type SuggestField, type SuggestResult } from "@/app/about/suggest-validate";
import { CATEGORIES, STATES } from "@/lib/taxonomy";

const EMPTY: Record<SuggestField, string> = { nama: "", link: "", kategori: "", negeri: "", kenapa: "", email: "" };
const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ value: c.slug, label: c.nameMs }));
const STATE_OPTIONS = STATES.map((s) => ({ value: s, label: s }));

/**
 * "Cadang jenama" form (DESIGN §8.8 #6). Validates on blur and submit (shared rules with the
 * Server Action), prefills `?nama=` after mount, and is honest about where the suggestion goes:
 * - webhook configured → saved; Oyen `happy` + celebrate burst + thank-you (role=status)
 * - no webhook → nothing is stored here; we hand over a prefilled GitHub issue to submit.
 */
export function SuggestForm({ mode = "github" }: { mode?: "webhook" | "github" }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<SuggestField, string>>>({});
  const [result, setResult] = useState<SuggestResult | null>(null);
  const [pending, startTransition] = useTransition();
  const [burst, setBurst] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  // ?nama= prefill (from search "Cadang jenama ni" / directory empty state). Client-only URL read.
  useEffect(() => {
    const nama = new URLSearchParams(window.location.search).get("nama")?.trim();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL state is client-only; read once after hydration
    if (nama) setValues((v) => (v.nama ? v : { ...v, nama: nama.slice(0, LIMITS.nama) }));
  }, []);

  useEffect(() => {
    if (result?.status === "sent" || result?.status === "github") doneRef.current?.focus();
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

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateSuggestion(values);
    setErrors(found);
    const first = (Object.keys(EMPTY) as SuggestField[]).find((f) => found[f]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#cadang-${first}`)?.focus();
      return;
    }
    const data = new FormData(event.currentTarget);
    startTransition(async () => {
      const res = await suggestBrand(data).catch((): SuggestResult => ({ status: "error", message: "Alamak, tak jadi. Cuba lagi?" }));
      if (res.status === "invalid") setErrors(res.errors);
      if (res.status === "sent") setBurst((b) => b + 1);
      setResult(res);
    });
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setResult(null);
  };

  if (result?.status === "sent" || result?.status === "github") {
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
            <p className="mt-4 text-title-3 text-ink">Terima kasih! Oyen dah catat cadangan kau.</p>
            <p className="mt-2 max-w-[40ch] text-body text-ink-2">Kami akan semak jenama ni. Kalau sesuai, dia akan naik rak LokalLah!.</p>
          </>
        ) : (
          <>
            <p className="mt-4 text-title-3 text-ink">Hampir siap! Tinggal satu tekan je.</p>
            <p className="mt-2 max-w-[42ch] text-body text-ink-2">
              Kami catat cadangan kat GitHub — tekan hantar kat sana ya. Borang isu dah siap diisi untuk kau (perlu akaun GitHub).
            </p>
            <Button className="mt-5" href={result.url} external variant="primary" trailing="outbound">
              Buka GitHub &amp; hantar
            </Button>
          </>
        )}
        <Button className="mt-3" variant="ghost" size="sm" onClick={reset}>
          Cadang satu lagi
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate aria-describedby="cadang-note" className="grid gap-4 sm:grid-cols-2">
      <Input
        id="cadang-nama"
        name="nama"
        label="Nama jenama"
        required
        maxLength={LIMITS.nama}
        autoComplete="off"
        value={values.nama}
        onChange={set("nama")}
        onBlur={blur("nama")}
        error={errors.nama}
        fieldClassName="sm:col-span-2"
      />
      <Input
        id="cadang-link"
        name="link"
        label="Link kedai / Instagram"
        required
        inputMode="url"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={LIMITS.link}
        placeholder="kedaijenama.com atau @jenama"
        helper="Kedai online rasmi jenama ni (Shopify, WooCommerce, website) atau akaun Instagram."
        value={values.link}
        onChange={set("link")}
        onBlur={blur("link")}
        error={errors.link}
        fieldClassName="sm:col-span-2"
      />
      <Select
        id="cadang-kategori"
        name="kategori"
        label="Kategori"
        placeholder="Tak pasti"
        options={CATEGORY_OPTIONS}
        value={values.kategori}
        onChange={set("kategori")}
        error={errors.kategori}
      />
      <Select
        id="cadang-negeri"
        name="negeri"
        label="Negeri"
        placeholder="Tak pasti"
        options={STATE_OPTIONS}
        value={values.negeri}
        onChange={set("negeri")}
        error={errors.negeri}
      />
      <Textarea
        id="cadang-kenapa"
        name="kenapa"
        label="Kenapa best?"
        maxLength={LIMITS.kenapa}
        placeholder="Produk paling laku, kenapa kau suka, apa-apa je."
        value={values.kenapa}
        onChange={set("kenapa")}
        fieldClassName="sm:col-span-2"
      />
      {mode === "webhook" && (
        <Input
          id="cadang-email"
          name="email"
          type="email"
          label="Email kau (tak wajib)"
          inputMode="email"
          autoComplete="email"
          maxLength={LIMITS.email}
          helper="Hanya untuk kami hubungi kau pasal cadangan ni."
          value={values.email}
          onChange={set("email")}
          onBlur={blur("email")}
          error={errors.email}
          fieldClassName="sm:col-span-2"
        />
      )}
      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="cadang-laman">Laman web (biar kosong)</label>
        <input id="cadang-laman" name="laman" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {result?.status === "error" && (
        <div
          role="alert"
          className="flex flex-col gap-2 rounded-input border-[1.5px] border-sambal-pekat bg-sambal-tint p-3 text-body-sm text-sambal-pekat sm:col-span-2"
        >
          <p className="font-semibold">{result.message}</p>
          {result.url && (
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-telang underline underline-offset-4">
              Hantar terus kat GitHub <ExternalLink aria-hidden="true" size={14} />
              <span className="sr-only"> (tab baru)</span>
            </a>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p id="cadang-note" className="text-caption text-ink-soft">
          Medan bertanda <span className="text-bandung-pekat">*</span> wajib.{" "}
          {mode === "github" ? "Cadangan dihantar sebagai isu GitHub awam, jadi jangan letak maklumat peribadi." : "Oyen catat, kami semak."}
        </p>
        <Button type="submit" variant="primary" loading={pending} icon={<Send aria-hidden="true" />} className="sm:shrink-0">
          Hantar cadangan
        </Button>
      </div>
    </form>
  );
}
