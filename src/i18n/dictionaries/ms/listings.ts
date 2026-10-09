import type { ListingsMessages } from "../en/listings";

/** `listings` in Bahasa Melayu (same shape as English). Voice: DESIGN §9. */
const listings = {
  meta: {
    promos: {
      title: "Promo panas",
      description: "Produk jenama lokal yang tengah promo, terus dari kedai rasmi. Harga disemak lebih kurang setiap 3 jam.",
      socialDescription: "Produk jenama lokal yang tengah promo, terus dari kedai rasmi.",
    },
    new: {
      title: "Baru sampai",
      description: "Produk yang baru launch kat kedai rasmi jenama lokal, dikumpul ikut hari. Disemak lebih kurang setiap 3 jam.",
      socialDescription: "Produk yang baru launch kat kedai rasmi jenama lokal.",
    },
  },

  promos: {
    eyebrow: "Harga turun",
    title: "Promo {accent}",
    titleAccent: "panas",
    sub: "Produk tengah promo, terus dari kedai rasmi.",
    summary: "{products} tengah promo dari {brands}. Terus dari kedai rasmi.",
    products: { one: "{count} produk", other: "{count} produk" },
    brands: { one: "{count} jenama", other: "{count} jenama" },
    checked: "Harga disemak {time}. Confirm kat kedai rasmi sebelum bayar ya.",
    upTo: "sampai",
    region: "Senarai promo",
  },

  new: {
    eyebrow: "Launch baru",
    title: "Baru {accent}",
    titleAccent: "sampai",
    sub: "Produk yang baru launch kat kedai rasmi jenama lokal.",
    summary: "{products} dari {brands} dalam {days} hari terakhir.",
    products: { one: "{count} produk", other: "{count} produk" },
    brands: { one: "{count} jenama", other: "{count} jenama" },
    windowDays: "{days} hari terakhir",
    windowCount: { one: "{count} produk", other: "{count} produk" },
    region: "Senarai produk baru",
    sinceCounting: "Tengah kira produk baru sejak kau datang last…",
    sinceCount: { one: "{count} produk baru sejak kau datang last", other: "{count} produk baru sejak kau datang last" },
    sinceClose: "Tutup dan tunjuk semua",
  },

  found: {
    promos: { one: "Jumpa {count} promo", other: "Jumpa {count} promo" },
    new: { one: "Jumpa {count} produk", other: "Jumpa {count} produk" },
  },
  noun: {
    promos: { one: "promo", other: "promo" },
    new: { one: "produk", other: "produk" },
  },

  view: {
    label: "Paparan",
    grid: "Grid",
    list: "Senarai",
  },

  loadError: "Alamak, senarai penuh tak dapat dimuat. Cuba lagi?",

  empty: {
    promosTitle: "Takde promo buat masa ni.",
    promosBody: "Oyen tengah jaga. Bila harga turun, keluar sini dulu.",
    promosAction: "Tengok yang baru",
    newTitle: "Senyap je minggu ni.",
    newBody: "Jenama tengah masak produk baru. Check balik esok!",
    newAction: "Tengok promo",
    filteredTitle: "Takde yang padan semua tapisan ni.",
    filteredBody: "Buang satu dua tapisan, confirm jumpa.",
    filteredAction: "Reset tapisan",
  },

  end: {
    filtered: { one: "Dah habis! Kau dah tengok {count} {noun} yang padan.", other: "Dah habis! Kau dah tengok semua {count} {noun} yang padan." },
    promos: "Dah habis! Kau dah tengok semua promo hari ni.",
    new: { one: "Dah habis! Kau dah tengok {count} produk baru.", other: "Dah habis! Kau dah tengok semua {count} produk baru." },
    toNew: "Tengok yang baru sampai",
    toPromos: "Tengok promo panas",
  },

  filters: {
    filter: "Tapis",
    filterActive: { one: "Tapis, {count} tapisan aktif", other: "Tapis, {count} tapisan aktif" },
    sidebar: "Tapisan",
    quick: "Tapis pantas",
    sort: "Susun",
    sortBy: "Susun ikut",
    sortCurrent: "Susun: {label}",
    sortOptions: {
      diskaun: "Diskaun paling besar",
      murah: "Harga paling murah",
      jimat: "Jimat paling banyak",
      az: "Jenama A–Z",
      baru: "Paling baru",
    },
    sheetPromos: "Pilih apa yang kau nak usha.",
    sheetNew: "Cari launch yang kena dengan kau.",
    reset: "Reset",
    resetAll: "Reset semua",
    show: "Tunjuk {count} {noun}",
    searchSheet: "Tapis produk, jenama…",
    searchSidebar: "Tapis nama…",
    clearSearch: "Padam carian",
    whenLaunched: "Bila launch",
    launchWindow: "Tempoh launch",
    masa: { minggu: "Minggu ni", bulan: "Bulan ni" },
    categories: "Kategori",
    brandSize: "Saiz jenama",
    discount: "Diskaun",
    minDiscount: "Diskaun minimum",
    discountAll: "Semua",
    discountAny: "Semua diskaun",
    discountStep: "Diskaun {value}% ke atas",
    discountPill: "Diskaun {value}",
    price: "Harga",
    priceAll: "Semua harga",
    priceUnder: "Bawah RM{max}",
    priceOver: "Atas RM{min}",
    priceBetween: "RM{min}–{max}",
    nonMyr: {
      one: "Produk dalam US$ ({count}) tak termasuk dalam tapisan harga RM.",
      other: "Produk dalam US$ ({count}) tak termasuk dalam tapisan harga RM.",
    },
    tierCount: { one: "{count} item", other: "{count} item" },
    active: "Tapisan aktif",
    since: "Sejak lawatan lepas",
    remove: "Buang tapisan {label}",
  },
} satisfies ListingsMessages;

export default listings;
