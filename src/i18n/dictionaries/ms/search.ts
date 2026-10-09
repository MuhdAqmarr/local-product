import type { SearchMessages } from "../en/search";

/** `search` in Bahasa Melayu (DESIGN §9.1, §9.5, §9.13). */
const search = {
  label: "Cari jenama atau produk",
  placeholder: "Cari jenama, produk, kategori…",
  clear: "Padam carian",
  cancel: "Batal",
  results: { one: "{count} hasil untuk {query}", other: "{count} hasil untuk {query}" },
  noResultsSr: "Tiada hasil untuk {query}",
  loading: "Sedang dimuatkan…",
  listbox: "Hasil carian",

  error: {
    title: "Alamak, carian tak dapat dimuat.",
    body: "Internet merajuk kot. Bukan salah kau.",
    retry: "Cuba lagi",
  },

  groups: {
    brands: "Jenama",
    categories: "Kategori",
    products: "Produk",
  },
  showMore: "Tunjuk lagi produk ({count})",
  priceNote: "Harga boleh berubah. Confirm kat kedai rasmi sebelum bayar ya.",

  keys: {
    move: "pilih",
    open: "buka",
    close: "tutup",
  },

  empty: {
    title: "Nak cari apa, bos?",
    body: "Jenama, produk atau kategori. Taip je.",
    recent: "Carian terkini",
    forget: "Buang “{query}” dari carian terkini",
    hot: "Paling banyak promo",
    tryThese: "Cuba cari",
  },
  examples: ["baju kurung", "kopi", "sunscreen", "tudung", "serum", "telekung", "batik", "lilin"],

  noResults: {
    title: "Alamak, “{query}” tak jumpa.",
    body: "Cuba ejaan lain, atau cari ikut kategori. Jenama ni belum ada?",
    suggest: "Cadang jenama ni",
  },

  row: {
    brand: "Jenama",
    srDiscount: ", diskaun {percent}%",
    srOpen: ", buka kedai rasmi {brand} (tab baru)",
    srCategory: ", kategori",
  },
} satisfies SearchMessages;

export default search;
