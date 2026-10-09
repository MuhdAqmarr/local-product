import type { CategoriesMessages } from "../en/categories";

/** `categories` in Bahasa Melayu (same shape as English). */
const categories = {
  meta: {
    notFound: "Kategori tak jumpa",
    title: "{name}: jenama & promo lokal",
    socialTitle: "{name} · LokalLah!",
    description: "{blurb} Promo live dan produk baru dari jenama {label} Malaysia, terus dari kedai rasmi.",
  },

  hero: {
    overline: "Kategori",
    stats: "{name} dalam angka",
    brands: { one: "jenama", other: "jenama" },
    promos: { one: "promo", other: "promo" },
    new: { one: "baru", other: "baru" },
  },

  others: "Kategori lain",
  size: "Saiz jenama",
  scopeAll: "Semua",
  scopeStatus: "Tunjuk {promos} dan {brands}",
  scopeStatusTier: "Tunjuk {promos} dan {brands}, saiz {tier}",
  promoCount: { one: "{count} promo", other: "{count} promo" },
  brandCount: { one: "{count} jenama", other: "{count} jenama" },

  promo: {
    title: "Promo {accent} dalam {name}",
    titleAccent: "panas",
    sub: "Harga turun, dikesan terus dari kedai rasmi.",
    empty: "Takde promo dalam {name} buat masa ni. Oyen tengah jaga. Bila harga turun, keluar sini dulu.",
    emptyTier: "Takde promo {tier} dalam {name} buat masa ni. Oyen tengah jaga. Bila harga turun, keluar sini dulu.",
    seeNew: "Tengok yang baru",
    checked: "Harga disemak {time}. Confirm kat kedai rasmi sebelum bayar ya.",
  },

  fresh: {
    title: "Baru dalam {accent}",
    titleText: "Baru dalam {name}",
    sub: "Fresh dari oven: produk yang baru launch.",
    noun: { one: "produk baru", other: "produk baru" },
    railEmpty: "Senyap je. Takde produk baru bulan ni.",
    railEmptyTier: "Senyap je. Takde produk baru {tier} bulan ni.",
    empty: "Senyap je bulan ni. Jenama tengah masak produk baru. Check balik esok!",
  },

  brands: {
    title: "Jenama {accent}",
    sub: "Yang kedainya boleh disync dulu, lepas tu ikut A–Z.",
    emptyTier: "Belum ada jenama {tier} dalam {name}. Kenal satu? Cadangkan!",
    empty: "Rak ni kosong lagi. Kenal jenama {label} lokal? Cadangkan!",
    suggest: "Cadang jenama",
    noun: { one: "jenama", other: "jenama" },
  },
} satisfies CategoriesMessages;

export default categories;
