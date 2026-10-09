import type { SavedMessages } from "../en/saved";

/** `saved` in Bahasa Melayu (DESIGN §8.7, §9.5, §9.8). */
const saved = {
  meta: {
    title: "Simpanan kau",
    description: "Produk dan jenama yang kau simpan, dengan semakan harga terkini.",
  },

  eyebrow: "Simpan",
  title: "Simpanan kau",
  sub: "Disimpan dalam browser ni je, tak perlu login.",
  srCount: { one: "{count} item", other: "{count} item" },
  clearAll: "Kosongkan semua",

  dropsLead: "Psst!",
  drops: { one: "{count} barang simpanan kau turun harga.", other: "{count} barang simpanan kau turun harga." },

  tabs: {
    label: "Jenis simpanan",
    products: "Produk",
    brands: "Jenama",
  },

  sort: {
    label: "Susun",
    newest: "Baru disimpan",
    drops: "Harga turun dulu",
    discount: "Diskaun paling besar",
  },

  status: {
    checked: "Harga disemak dengan sync terakhir.",
    confirm: "Confirm kat kedai rasmi sebelum bayar ya.",
    error: "Tak dapat semak harga terkini. Harga ni masa kau simpan.",
    checking: "Tengah semak harga terkini…",
  },

  srProducts: "Produk disimpan",
  srBrands: "Jenama disimpan",

  emptyProducts: {
    title: "Simpanan kau kosong lagi.",
    body: "Tekan ♥ kat mana-mana produk, nanti Oyen simpankan sini (dalam browser kau je).",
    primary: "Jom usha promo",
    secondary: "Tengok yang baru",
  },
  emptyBrands: {
    title: "Belum ada jenama kegemaran.",
    body: "Simpan jenama yang kau suka, senang nak check promo dia nanti.",
    primary: "Jelajah jenama",
  },

  storageNote: "Simpanan disimpan dalam browser ni je. Clear data browser, hilanglah dia.",

  fresh: {
    drop: "Turun lagi {amount} sejak kau simpan!",
    up: "Naik {amount} sejak kau simpan",
    ended: "Promo dah tamat",
    unknown: "Tak dapat semak harga terkini. Harga masa simpan: {price}.",
    view: "Tengok kat kedai rasmi ↗",
    viewLabel: "Tengok {title} kat kedai rasmi (tab baru)",
    savedAgo: "Disimpan {time}",
  },

  brandRow: {
    promos: { one: "{count} promo sekarang", other: "{count} promo sekarang" },
    noPromos: "Takde promo sekarang",
  },

  thisProduct: "produk ni",
  brandName: "jenama {name}",

  toast: {
    removed: "Dah buang {title}. Tekan Undo dalam notifikasi untuk batal.",
    cleared: "Simpanan dah dikosongkan.",
    undo: "Undo",
  },

  confirm: {
    title: "Kosongkan semua simpanan?",
    description: { one: "{count} item simpanan akan dibuang dari browser ni.", other: "Semua {count} produk dan jenama simpanan akan dibuang dari browser ni." },
    body: "Lepas kosongkan, kau masih boleh tekan Undo sekejap.",
    cancel: "Batal",
    confirm: "Kosongkan semua",
  },
} satisfies SavedMessages;

export default saved;
