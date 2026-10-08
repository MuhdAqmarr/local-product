/**
 * Refresh src/data/snapshot.json from every brand's official store.
 *
 *   npm run sync              fails (exit 1) when no store could be read
 *   npm run sync -- --soft    never fails; `prebuild` uses this so a network blip cannot break a deploy
 *   --if-ci                   only run on Vercel/CI
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { refreshCatalog } from "../src/lib/feeds/refresh";
import type { Brand, Snapshot } from "../src/lib/types";

const root = resolve(import.meta.dirname, "..");
const soft = process.argv.includes("--soft");

// prebuild passes --if-ci: deploys refresh the data, local builds reuse the committed snapshot.
if (process.argv.includes("--if-ci") && !process.env.VERCEL && !process.env.CI) {
  console.log("[sync] skipped for local build (run `npm run sync` to refresh)");
  process.exit(0);
}
const snapshotPath = resolve(root, "src/data/snapshot.json");

const brands = JSON.parse(readFileSync(resolve(root, "src/data/brands.json"), "utf8")) as Brand[];
let prev: Snapshot | null = null;
try {
  prev = JSON.parse(readFileSync(snapshotPath, "utf8")) as Snapshot;
} catch {
  prev = null;
}

/** One product per line: small file, readable diffs. */
function serialize(snapshot: Snapshot): string {
  const products = snapshot.products.map((p) => JSON.stringify(p)).join(",\n");
  return `{"version":1,"syncedAt":${JSON.stringify(snapshot.syncedAt)},\n"feeds":${JSON.stringify(snapshot.feeds)},\n"products":[\n${products}\n]}\n`;
}

const started = Date.now();
const total = brands.filter((b) => b.feed).length;
console.log(`[sync] reading ${total} stores…`);

try {
  const next = await refreshCatalog(brands, prev, {
    withMeta: true,
    concurrency: 6,
    onBrand(brand, status, count) {
      const mark = status.status === "live" ? "✓" : status.status === "snapshot" ? "~" : "✗";
      const warn = status.country && status.country !== "MY" ? `  ⚠ store country ${status.country}` : "";
      const err = status.error ? `  (${status.error})` : "";
      console.log(`${mark} ${brand.slug.padEnd(30)} ${String(count).padStart(3)} items  ${status.currency}${warn}${err}`);
    },
  });

  const live = Object.values(next.feeds).filter((f) => f.status === "live").length;
  const promos = next.products.filter((p) => p.discount !== undefined).length;
  console.log(`[sync] ${live}/${total} stores live, ${next.products.length} products, ${promos} promos in ${((Date.now() - started) / 1000).toFixed(1)}s`);

  if (total > 0 && live === 0) {
    // Nothing fresh: keep the old snapshot (and its honest syncedAt) untouched.
    console.warn("[sync] no store could be read; keeping the existing snapshot");
    process.exit(soft ? 0 : 1);
  }
  writeFileSync(snapshotPath, serialize(next));
} catch (err) {
  console.error("[sync] failed:", err);
  process.exit(soft ? 0 : 1);
}
