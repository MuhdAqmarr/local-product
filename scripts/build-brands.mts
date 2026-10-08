/**
 * Merge researched brand lists into src/data/brands.json and detect which brands
 * run a store we can read live (Shopify products.json or the WooCommerce Store API).
 *
 *   npx tsx scripts/build-brands.mts <research-dir> [--report <file>]
 *
 * Research files look like {"key": "...", "brands": [...], "dropped": [...]}.
 * Manual corrections live in src/data/brand-overrides.json (keyed by slug) so they survive re-runs:
 *   { "<slug>": { ...Brand fields to replace, "drop": true, "allowForeignStore": true } }
 * A Shopify store registered outside Malaysia loses its live feed unless allowForeignStore is set
 * (some Malaysian brands run a global store from a Singapore entity).
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fetchJson, mapPool, USER_AGENT } from "../src/lib/feeds/http";
import { STATES } from "../src/lib/taxonomy";
import type { Brand, CategorySlug, FeedType, MalaysianState, TierSlug } from "../src/lib/types";
import { slugify } from "../src/lib/utils";

interface ResearchedBrand {
  name: string;
  website: string;
  category: CategorySlug;
  subcategory: string;
  tier: TierSlug;
  description: string;
  founded?: number;
  origin?: string;
  instagram?: string;
  tiktok?: string;
  shopee?: string;
  tags?: string[];
  platform?: string;
  evidence?: string;
  confidence?: string;
}

const root = resolve(import.meta.dirname, "..");
const dir = process.argv[2];
if (!dir) throw new Error("usage: tsx scripts/build-brands.mts <research-dir> [--report <file>]");
const reportIdx = process.argv.indexOf("--report");
const reportPath = reportIdx > 0 ? process.argv[reportIdx + 1] : undefined;

const CITY_TO_STATE: Array<[RegExp, MalaysianState]> = [
  [/\b(kuala lumpur|\bkl\b|cheras|bangsar|setapak|kepong|sentul|wangsa maju|bukit jalil|sri petaling|titiwangsa|mont kiara|brickfields|chow kit|kampung baru|desa parkcity|ttdi|taman tun|segambut|bukit bintang)\b/i, "Kuala Lumpur"],
  [/\b(shah alam|petaling jaya|\bpj\b|subang|klang|puchong|kajang|bangi|cyberjaya|seri kembangan|serdang|rawang|sepang|damansara|gombak|selayang|semenyih|sungai buloh|banting|puncak alam|setia alam|usj|glenmarie|bukit jelutong|ampang|batu caves|balakong|dengkil|kuala selangor|hulu langat)\b/i, "Selangor"],
  [/\b(penang|pulau pinang|george ?town|butterworth|bayan lepas|bukit mertajam|seberang perai|prai|air itam|balik pulau)\b/i, "Pulau Pinang"],
  [/\b(johor|\bjb\b|batu pahat|muar|kluang|skudai|pasir gudang|kulai|segamat|iskandar puteri|pontian)\b/i, "Johor"],
  [/\b(perak|ipoh|taiping|teluk intan|kampar|sitiawan|lumut|kuala kangsar|seri iskandar)\b/i, "Perak"],
  [/\b(kedah|alor setar|sungai petani|kulim|langkawi)\b/i, "Kedah"],
  [/\b(kelantan|kota bharu)\b/i, "Kelantan"],
  [/\b(terengganu|kemaman|dungun|marang)\b/i, "Terengganu"],
  [/\b(pahang|kuantan|bentong|cameron highlands|temerloh|raub|genting)\b/i, "Pahang"],
  [/\b(negeri sembilan|seremban|nilai|port dickson)\b/i, "Negeri Sembilan"],
  [/\b(melaka|malacca)\b/i, "Melaka"],
  [/\b(perlis|kangar)\b/i, "Perlis"],
  [/\b(sabah|kota kinabalu|sandakan|tawau|keningau)\b/i, "Sabah"],
  [/\b(sarawak|kuching|miri|sibu|bintulu)\b/i, "Sarawak"],
  [/\b(putrajaya)\b/i, "Putrajaya"],
  [/\b(labuan)\b/i, "Labuan"],
];

function stateOf(origin: string | undefined): MalaysianState | undefined {
  if (!origin) return undefined;
  const exact = STATES.find((s) => origin.toLowerCase().includes(s.toLowerCase()));
  if (exact) return exact;
  return CITY_TO_STATE.find(([re]) => re.test(origin))?.[1];
}

const NON_STORE_HOSTS = /(shopee|lazada|instagram|facebook|tiktok|linktr\.ee|wa\.me|whatsapp|x\.com|twitter)\./i;

interface Detection {
  finalUrl?: string;
  feed?: { type: FeedType; origin: string };
  country?: string;
  currency?: string;
  reachable: boolean;
  note?: string;
}

async function resolveHome(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url, { headers: { "user-agent": USER_AGENT }, redirect: "follow", signal: AbortSignal.timeout(20_000) });
    return res.status < 500 ? res.url || url : undefined;
  } catch {
    return undefined;
  }
}

async function detect(website: string): Promise<Detection> {
  const finalUrl = await resolveHome(website);
  if (!finalUrl) return { reachable: false, note: "unreachable" };
  const host = new URL(finalUrl).host;
  if (NON_STORE_HOSTS.test(host)) return { reachable: true, finalUrl };
  const origin = new URL(finalUrl).origin;

  try {
    const data = await fetchJson<{ products?: unknown[] }>(`${origin}/products.json?limit=1`, { timeoutMs: 15_000 });
    if (Array.isArray(data.products)) {
      let country: string | undefined;
      let currency: string | undefined;
      try {
        const meta = await fetchJson<{ country?: string; currency?: string }>(`${origin}/meta.json`, { timeoutMs: 15_000 });
        country = meta.country;
        currency = meta.currency;
      } catch {
        // optional
      }
      return { reachable: true, finalUrl, feed: { type: "shopify", origin }, country, currency };
    }
  } catch {
    // not Shopify
  }

  try {
    const data = await fetchJson<unknown>(`${origin}/wp-json/wc/store/v1/products?per_page=1`, { timeoutMs: 15_000 });
    if (Array.isArray(data)) return { reachable: true, finalUrl, feed: { type: "woocommerce", origin } };
  } catch {
    // not WooCommerce
  }
  return { reachable: true, finalUrl };
}

function cleanHandle(handle: string | undefined): string | undefined {
  if (!handle) return undefined;
  const h = handle
    .trim()
    .replace(/^https?:\/\/(www\.)?(instagram|tiktok)\.com\/@?/i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "");
  return h || undefined;
}

const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
const researched: ResearchedBrand[] = files.flatMap((f) => (JSON.parse(readFileSync(resolve(dir, f), "utf8")) as { brands: ResearchedBrand[] }).brands);

type Override = Partial<Brand> & { drop?: boolean; allowForeignStore?: boolean };
let overrides: Record<string, Override> = {};
try {
  overrides = JSON.parse(readFileSync(resolve(root, "src/data/brand-overrides.json"), "utf8")) as Record<string, Override>;
} catch {
  overrides = {};
}

// Dedupe by website (host + path, so group sites like padini.com and padini.com/vincci stay
// distinct) and by slug; first occurrence wins.
const siteKey = (url: string) => {
  try {
    const u = new URL(url);
    return `${u.host.replace(/^www\./, "")}${u.pathname.replace(/\/+$/, "")}`.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
};
const seenSites = new Set<string>();
const seenSlugs = new Set<string>();
const unique = researched.filter((b) => {
  const slug = slugify(b.name);
  const key = siteKey(b.website);
  if (seenSites.has(key) || seenSlugs.has(slug) || overrides[slug]?.drop) return false;
  seenSites.add(key);
  seenSlugs.add(slug);
  return true;
});

console.log(`[brands] ${researched.length} researched → ${unique.length} unique; probing stores…`);

const report: string[] = [];
const brands = await mapPool(unique, 6, async (r): Promise<Brand | null> => {
  const d = await detect(r.website);
  const slug = slugify(r.name);
  const override = overrides[slug] ?? {};
  const foreign = Boolean(d.country && d.country !== "MY" && !override.allowForeignStore);
  const flag = !d.reachable ? "UNREACHABLE" : foreign ? `COUNTRY=${d.country}` : "";
  report.push(`${flag ? "⚠" : "✓"} ${slug.padEnd(32)} ${(d.feed?.type ?? "-").padEnd(12)} ${d.country ?? ""} ${d.currency ?? ""} ${flag} ${d.finalUrl ?? r.website}`);
  if (!d.reachable) return null;
  const { drop: _drop, allowForeignStore: _allow, ...fields } = override;
  return {
    slug,
    name: r.name.trim(),
    category: r.category,
    subcategory: r.subcategory.toLowerCase(),
    tier: r.tier,
    description: r.description.trim(),
    ...(r.founded ? { founded: r.founded } : {}),
    ...(r.origin ? { origin: r.origin.trim() } : {}),
    ...(stateOf(r.origin) ? { state: stateOf(r.origin) } : {}),
    website: d.finalUrl ?? r.website,
    ...(cleanHandle(r.instagram) ? { instagram: cleanHandle(r.instagram) } : {}),
    ...(cleanHandle(r.tiktok) ? { tiktok: cleanHandle(r.tiktok) } : {}),
    ...(r.shopee ? { shopee: r.shopee } : {}),
    tags: (r.tags ?? []).map((t) => t.toLowerCase()).slice(0, 4),
    ...(d.feed && !foreign ? { feed: d.feed } : {}),
    ...fields,
  };
});

const kept = brands.filter((b): b is Brand => b !== null).sort((a, b) => a.name.localeCompare(b.name));
writeFileSync(resolve(root, "src/data/brands.json"), `${JSON.stringify(kept, null, 2)}\n`);
report.sort();
if (reportPath) writeFileSync(reportPath, `${report.join("\n")}\n`);
const live = kept.filter((b) => b.feed);
console.log(`[brands] wrote ${kept.length} brands (${live.length} with live feeds: ${live.filter((b) => b.feed!.type === "shopify").length} shopify, ${live.filter((b) => b.feed!.type === "woocommerce").length} woocommerce)`);
console.log(`[brands] flagged: ${report.filter((l) => l.startsWith("⚠")).length}`);
