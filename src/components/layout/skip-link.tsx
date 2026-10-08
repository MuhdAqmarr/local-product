/** First focusable element on every page (WCAG 2.4.1). */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:inline-flex focus:h-11 focus:items-center focus:rounded-full focus:border-2 focus:border-ink focus:bg-mangga focus:px-5 focus:text-label focus:text-ink focus:shadow-pop"
    >
      Langkau ke kandungan
    </a>
  );
}
