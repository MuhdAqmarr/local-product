import { SITE_URL } from "../site";

/** Identify ourselves honestly; stores can find out who we are and ask us to stop. */
export const USER_AGENT = `Mozilla/5.0 (compatible; LokalLahBot/1.0; +${SITE_URL}/about)`;

export class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * GET a JSON document with a timeout. Retries once on 429/5xx (stores rate-limit
 * products.json per IP), honouring Retry-After when it is short.
 */
export async function fetchJson<T>(url: string, { timeoutMs = 12_000, retries = 1 } = {}): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    let res: Response;
    try {
      res = await fetch(url, {
        headers: { "user-agent": USER_AGENT, accept: "application/json" },
        signal: AbortSignal.timeout(timeoutMs),
        cache: "no-store",
        redirect: "follow",
      });
    } catch (err) {
      if (attempt < retries) {
        await sleep(1_500);
        continue;
      }
      throw err;
    }

    if (res.ok) {
      const text = await res.text();
      try {
        return JSON.parse(text) as T;
      } catch {
        throw new HttpError(`Not JSON from ${url}`, res.status);
      }
    }

    if ((res.status === 429 || res.status >= 500) && attempt < retries) {
      const retryAfter = Number(res.headers.get("retry-after"));
      await sleep(Number.isFinite(retryAfter) && retryAfter > 0 && retryAfter <= 10 ? retryAfter * 1_000 : 2_500);
      continue;
    }
    throw new HttpError(`HTTP ${res.status} from ${url}`, res.status);
  }
}

/** Run `fn` over `items` with at most `limit` in flight; results keep input order. */
export async function mapPool<T, R>(items: readonly T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
