import type { HomeMessages } from "../en/home";

/** `home` in Bahasa Melayu (same shape as English). Voice: DESIGN §9 copy deck. */
const home = {
  meta: {
    title: "LokalLah! — Semua jenama lokal, sentiasa up to date",
    description:
      "Direktori jenama Malaysia dari Cili Padi ke Jenama Ikon, dengan promo live dan launch baru terus dari kedai rasmi mereka. Auto-update setiap beberapa jam.",
  },

  hero: {
    title: "Semua jenama {local}, sentiasa {fresh}.",
    local: "lokal",
    fresh: "up to date",
    note: "psst… harga live!",
    upTo: "sampai!",
    burstLabel: "{discount}, diskaun paling besar sekarang. Tengok promo",
    sub: "Promo dan produk terbaru dari {brands} jenama Malaysia, dari skincare sampai sambal: {liveBrands} kedai rasmi kami semak live. Auto-update setiap beberapa jam, so kau tak terlepas apa-apa.",
    ctaPromos: "Tengok promo hari ni",
    ctaNew: "Jumpa launch baru",
    quickLabel: "Tapis pantas",
    quick: {
      discount: "Diskaun 40%+",
      thisWeek: "Baru minggu ni",
      ciliPadi: "Cili Padi",
      under30: "Bawah RM30",
    },
    stats: {
      brands: { one: "jenama", other: "jenama" },
      promos: { one: "promo live", other: "promo live" },
      new: { one: "baru", other: "baru" },
    },
    stackPromo: "Rak promo live",
    stackNew: "Baru sampai, live",
    stackPromoList: "Promo paling besar sekarang",
    stackNewList: "Launch terbaru",
  },

  search: {
    placeholder: "Cari jenama, produk, kategori…",
    placeholderShort: "Cari jenama, produk…",
    name: "Cari jenama, produk, kategori",
    button: "Cari",
    examples: ["Cari “baju kurung”…", "Cari “kopi”…", "Cari “sunscreen”…", "Cari “tudung”…", "Cari “serum”…", "Cari “telekung”…"],
  },

  ticker: {
    label: "Papan tanda live: promo dan launch terkini",
    tag: "Live",
    now: "sekarang",
    launched: "launch",
    pause: "Jeda ticker",
  },

  categories: {
    eyebrow: "Rak kategori",
    title: "Nak {accent} apa hari ni?",
    accent: "usha",
    sub: "{count} kategori, dari dapur sampai almari.",
    link: "Semua jenama",
  },

  promoRail: {
    title: "Promo {accent} sekarang",
    accent: "panas",
    titleText: "Promo panas sekarang",
    sub: "Harga turun, dikesan terus dari kedai rasmi.",
    noun: { one: "promo", other: "promo" },
  },

  newRail: {
    title: "Baru {accent}",
    accent: "sampai",
    titleText: "Baru sampai",
    eyebrowWeek: "Minggu ni",
    eyebrowLatest: "Launch terkini",
    sub: "Fresh dari oven: produk yang baru launch.",
    noun: { one: "produk baru", other: "produk baru" },
  },

  explainer: {
    title: "Macam mana kami sentiasa {accent}?",
    accent: "up to date",
    stepsLabel: "Tiga langkah",
    step: "Langkah {n}",
    replay: "Main semula",
    syncTitle: "Sync dari kedai rasmi",
    syncBody: "Robot kecil kami ronda kedai online {liveBrands} jenama, lebih kurang setiap 3 jam.",
    trackTitle: "Kesan harga turun & produk baru",
    trackBody: "Harga asal vs harga sekarang? Kami kira diskaun untuk kau. Produk baru terus naik rak.",
    example: "Contoh sebenar: {brand}, masa sync terakhir.",
    buyTitle: "Klik terus ke kedai",
    buyBody: "Kami tak jual apa-apa. Kau beli terus dari jenama, duit sampai kat diorang.",
  },

  origin: {
    quote:
      "boleh tak ada sorang buat website yang compile all local brand products daripada skincare, fashion, food to all other things yang Malaysian buat? and MUST BE UP TO DATE dari segi promotion and new products they launched",
    quoteLang: "ms",
    source: "— seorang netizen kat Threads",
    answer: "Boleh",
    answerSub: "Ni dia, dan kami pastikan sentiasa up to date.",
    promisesLabel: "Janji kami",
    promises: {
      sync: "Auto-sync",
      promos: "Promo dikesan",
      launches: "Launch baru ditangkap",
    },
  },

  tiers: {
    title: "Dari Cili Padi ke Jenama Ikon",
    sub: "Setiap jenama besar pernah bermula kecil.",
    listLabel: "Tiga saiz jenama",
    brands: { one: "jenama", other: "jenama" },
    seeAll: "Tengok semua {name}",
  },

  spotlight: {
    eyebrow: "Pilihan minggu ni",
    title: "{accent} minggu ni",
    accent: "Cili Padi",
    sub: "Kecil-kecil cili padi. Jom sokong yang baru bertatih.",
    visit: "Kenali {brand}",
    productsLabel: "Produk terbaru {brand}",
  },

  states: {
    title: "Jelajah ikut negeri",
    sub: "Dari Perlis sampai Sabah.",
    listLabel: "Negeri",
    count: { one: ", {count} jenama", other: ", {count} jenama" },
    empty: "· Belum ada, cadangkan!",
  },

  suggest: {
    title: "Kenal jenama lokal yang best?",
    sub: "Cadang la. Oyen catat, kami semak.",
    cta: "Cadang jenama",
  },
} satisfies HomeMessages;

export default home;
