import type { CommonMessages } from "../en/common";

/** `common` in Bahasa Melayu: the Manglish copy deck (DESIGN §9). Same shape as English. */
const common = {
  skipLink: "Langkau ke kandungan",

  nav: {
    main: "Navigasi utama",
    mainDesktop: "Navigasi utama desktop",
    home: "Utama",
    promos: "Promo",
    new: "Baru",
    brands: "Jenama",
    categories: "Kategori",
    about: "Tentang",
    saved: "Simpan",
    logo: "LokalLah! — Utama",
    savedCount: { one: "Simpan, {count} item", other: "Simpan, {count} item" },
    itemCount: { one: ", {count} item", other: ", {count} item" },
  },

  searchTrigger: {
    label: "Cari jenama atau produk",
    placeholder: "Cari jenama, produk…",
    tab: "Cari",
  },

  lang: {
    label: "Language / Bahasa",
    readIn: { en: "Read in English", ms: "Baca dalam Bahasa Melayu" },
  },

  kategori: {
    button: "Kategori",
    panelTitle: "Rak kategori",
    sheetTitle: "Nak usha apa hari ni?",
    sheetDescription: "Pilih rak, atau tengok ikut saiz jenama.",
    brandSize: "Saiz jenama",
    brandSizeLabel: "Saiz jenama:",
    allBrands: "Semua jenama",
    brandCount: { one: "{count} jenama", other: "{count} jenama" },
    aboutLink: "Tentang LokalLah!",
    suggestLink: "Cadang jenama",
  },

  motion: {
    group: "Animasi",
    footerLabel: "Animasi:",
    full: "Penuh",
    reduced: "Kurang",
    switchLabel: "Kurangkan animasi",
    switchOs: "Peranti kau dah minta kurang animasi, kami ikut.",
    switchHelp: "Hentikan gerakan hiasan di seluruh laman.",
    toastReduced: "Animasi dikurangkan.",
    toastFull: "Animasi penuh dihidupkan.",
  },

  backToTop: "Naik ke atas",

  footer: {
    tagline: "Kedai runcit digital untuk jenama lokal Malaysia. Sokong lokal, satu klik je.",
    explore: "Teroka",
    categories: "Kategori",
    randomBrand: "Jenama rawak",
    about: "Tentang",
    howWeSync: "Cara kami sync",
    suggest: "Cadang jenama",
    forOwners: "Untuk pemilik jenama",
    disclaimers: {
      source: "Harga, promo dan produk diambil secara automatik dari kedai online rasmi jenama (yang boleh kami baca), dan disemak lebih kurang setiap 3 jam.",
      prices: "Harga dan stok boleh berubah bila-bila masa. Sila sahkan harga akhir di kedai rasmi sebelum membeli.",
      independent:
        "LokalLah! ialah direktori bebas. Kami tak jual apa-apa dan tak bergabung dengan, ditaja atau disahkan oleh mana-mana jenama yang disenaraikan.",
      trademarks: "Nama jenama, tanda dagangan dan gambar produk adalah milik pemilik masing-masing.",
      outbound: "Link keluar ada tag utm_source=lokallah supaya jenama tahu trafik datang dari sini. Ini bukan link affiliate.",
      owners: "Pemilik jenama? Nak kemas kini info atau keluar dari senarai?",
      contact: "Hubungi kami",
    },
    copyright: "© 2026 LokalLah! · Direktori bebas",
    madeWith: "Dibuat dengan",
    flower: "bunga raya",
    by: "oleh",
    newTab: "(buka tab baru)",
    lastSync: "Sync terakhir:",
  },

  live: {
    tag: "LIVE",
    howWeSync: "Cara kami sync",
    srHowWeSync: "(cara kami sync)",
    site: "Kami semak kedai rasmi {count} jenama lebih kurang setiap 3 jam.",
    siteNoCount: "Kami semak kedai rasmi jenama lebih kurang setiap 3 jam.",
    siteLast: "Sync terakhir: {when}.",
    snapshot: "Data ni dari salinan terakhir yang kami simpan, bukan bacaan live.",
    ratio: "{live} daripada {total} jenama ada kedai yang boleh dibaca live.",
    brand: "Kami semak kedai rasmi {brand} lebih kurang setiap 3 jam.",
    brandLast: "Semakan terakhir: {when}.",
    brandError: "Semakan terakhir tak berjaya, jadi data mungkin lapuk.",
    brandNoFeed: "Kedai jenama ni belum boleh disync automatik. Tengok terus kat kedai rasmi diorang.",
    newSync: { one: "Sync baru masuk: {count} promo baru!", other: "Sync baru masuk: {count} promo baru!" },
  },

  feedback: {
    loading: "Sedang dimuatkan…",
    loadingLines: [
      "Oyen tengah susun rak…",
      "Kejap, tengah kira diskaun…",
      "Tengah usha kedai rasmi…",
      "Sabar jap, barang baru sampai…",
      "Tengah tarik teh… jap.",
      "Tauke tengah tulis kad harga…",
    ],
    offline: "Internet tengah merajuk. Data mungkin bukan yang terkini.",
    online: "Dah online balik!",
    close: "Tutup",
    error: "Alamak, tak jadi. Cuba lagi?",
    retry: "Cuba lagi",
    loadMore: "Muat lagi",
    seen: "Kau dah tengok {shown} daripada {total} {noun}",
    nounProducts: { one: "produk", other: "produk" },
  },

  save: {
    save: "Simpan {title}",
    unsave: "Buang {title} dari simpanan",
    saveBrand: "Simpan jenama {name}",
    unsaveBrand: "Buang jenama {name} dari simpanan",
    firstSave: "Masuk Simpan! Semua ada kat tab Simpan.",
    view: "Tengok",
    saved: "Disimpan",
    removed: "Dah buang dari Simpan.",
    undo: "Undo",
    brandSaved: "Jenama disimpan. Senang nak check promo dia nanti.",
  },

  product: {
    justIn: "Baru je",
    new: "Baru",
    soldOut: "Habis",
    srNew: "baru dilancar",
    srSoldOut: "habis stok",
    srOpen: "buka kedai rasmi {brand} (tab baru)",
    photoAlt: "Produk {brand}",
    tier: "Tier: {name}",
    launched: "Lancar {time}",
    priceNow: "Harga sekarang {price}",
    priceWas: "harga asal {price}",
    priceOff: "diskaun {percent}%",
    youSave: "Jimat {amount}",
    groupCount: { one: "{count} promo", other: "{count} promo" },
    today: "Hari ni",
    yesterday: "Semalam",
    dayCount: { one: "{count} produk", other: "{count} produk" },
  },

  brand: {
    promos: { one: "promo", other: "promo" },
    new: { one: "baru", other: "baru" },
    live: "Live",
    emptyShelf: "Rak online kosong buat masa ni",
    noFeed: "Kedai ni belum boleh disync",
    photoAlt: "Produk {brand}",
  },

  tier: {
    sr: "Tier: {name}",
    whatIs: "Tier: {name}. Apa maksudnya?",
    size: "Saiz jenama",
    learn: "Kenali tier",
  },

  category: {
    allBrands: "Semua jenama",
    all: "Semua",
    promos: { one: "{count} promo", other: "{count} promo" },
    brands: { one: "{count} jenama", other: "{count} jenama" },
  },

  rail: {
    seeAll: "Tengok semua",
    region: "{title}, skrol mendatar",
    left: "Skrol ke kiri",
    right: "Skrol ke kanan",
    nounProducts: { one: "produk", other: "produk" },
  },
} satisfies CommonMessages;

export default common;
