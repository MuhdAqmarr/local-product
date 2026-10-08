"use client";

import { useEffect } from "react";
import { fontVariables } from "./fonts";
import "./globals.css";

/** Root-layout failure: renders its own document (no header/footer, no providers). */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ms-MY" className={fontVariables}>
      <body className="grid min-h-dvh place-items-center bg-santan p-6 font-sans text-ink">
        <title>Alamak · LokalLah!</title>
        <main className="w-full max-w-[460px] rounded-[28px] border-2 border-ink bg-senja p-8 text-center shadow-pop-lg">
          <p className="font-num text-[26px]">
            Lokal<span className="text-bandung-pekat">Lah!</span>
          </p>
          <h1 className="mt-4 text-title-2">Alamak, ada benda tak kena.</h1>
          <p className="mt-3 text-body text-ink-2">Bukan salah kau. Cuba lagi kejap?</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => retry()} className="pop" style={{ ["--pop-offset" as string]: "4px" }}>
              <span className="pop-face h-12 bg-bandung px-[22px] text-button text-ink">Cuba lagi</span>
            </button>
            {/* A full reload is intended here: the root layout itself failed. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="pop" style={{ ["--pop-offset" as string]: "4px" }}>
              <span className="pop-face h-12 bg-putih px-[22px] text-button text-ink">Balik ke kedai</span>
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
