"use client";

import { useEffect } from "react";
import en from "@/i18n/dictionaries/en/errors";
import ms from "@/i18n/dictionaries/ms/errors";
import { fontVariables } from "./fonts";
import "./globals.css";

/**
 * Root-layout failure: renders its own document (no header/footer, no providers, no i18n context),
 * so the copy is bilingual: English first, Bahasa Melayu underneath.
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  const t = en.global;
  const b = ms.global;

  return (
    <html lang="en-MY" className={fontVariables}>
      <body className="grid min-h-dvh place-items-center bg-santan p-6 font-sans text-ink">
        <title>{`${t.pageTitle} · LokalLah!`}</title>
        <main className="w-full max-w-[460px] rounded-[28px] border-2 border-ink bg-senja p-8 text-center shadow-pop-lg">
          <p className="font-num text-[26px]">
            Lokal<span className="text-bandung-pekat">Lah!</span>
          </p>
          <h1 className="mt-4 text-title-2">{t.title}</h1>
          <p className="mt-3 text-body text-ink-2">{t.body}</p>
          <p lang="ms" className="mt-2 text-body-sm text-ink-2">
            {b.title} {b.body}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => retry()} className="pop" style={{ ["--pop-offset" as string]: "4px" }}>
              <span className="pop-face h-12 bg-bandung px-[22px] text-button text-ink">
                {t.retry} · <span lang="ms">{b.retry}</span>
              </span>
            </button>
            {/* A full reload is intended here: the root layout itself failed. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="pop" style={{ ["--pop-offset" as string]: "4px" }}>
              <span className="pop-face h-12 bg-putih px-[22px] text-button text-ink">
                {t.home} · <span lang="ms">{b.home}</span>
              </span>
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
