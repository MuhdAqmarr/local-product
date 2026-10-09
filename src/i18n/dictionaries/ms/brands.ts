import type { BrandsMessages } from "../en/brands";

/** `brands` in Bahasa Melayu (same shape as English). */
const brands = {
  meta: {
    title: "Direktori jenama",
    description:
      "Direktori jenama lokal Malaysia, dari Cili Padi ke Jenama Ikon. Tapis ikut kategori, saiz jenama, negeri dan promo, terus ke kedai rasmi mereka.",
    notFound: "Jenama tak jumpa",
    brandTitle: "{brand}: jenama {category} lokal",
    socialTitle: "{brand} · LokalLah!",
    feedTail: "Promo dan produk baru {brand} dari kedai rasmi, disemak lebih kurang setiap 3 jam.",
  },

  directory: {
    eyebrow: "Rak jenama",
    title: "Direktori jenama {accent}",
    titleAccent: "lokal",
    sub: "{count} jenama Malaysia, dari Cili Padi ke Jenama Ikon.",
    subLive: "{live} daripadanya ada kedai online yang kami semak live.",
    subLoading: "Jenama Malaysia, dari Cili Padi ke Jenama Ikon.",

    searchLabel: "Cari nama jenama",
    searchPlaceholder: "Cari nama jenama…",
    clearSearch: "Padam carian",
    filter: "Tapis",
    filterActive: "Tapis, {count} aktif",
    categories: "Kategori",
    size: "Saiz jenama",
    all: "Semua",
    allSizes: "Semua saiz",
    state: "Negeri",
    allStates: "Semua negeri",
    sort: "Susun",
    sortAz: "Jenama A–Z",
    sortPromo: "Paling banyak promo",
    sortNew: "Paling banyak produk baru",
    promoOnly: "Ada promo je",

    showing: "Tunjuk {count} daripada {total} jenama",
    activeFilters: "Tapisan aktif",
    removeFilter: "Buang tapisan {label}",
    resetAll: "Reset semua",
    list: "Senarai jenama",
    noun: { one: "jenama", other: "jenama" },
    end: "Dah habis! Kau dah tengok semua {count} jenama.",

    emptyQueryTitle: "Alamak, “{q}” tak jumpa.",
    emptyQueryBody: "Cuba ejaan lain, atau cari ikut kategori. Jenama ni belum ada?",
    suggestThis: "Cadang jenama ni",
    emptyFiltersTitle: "Takde yang padan semua tapisan ni.",
    emptyFiltersBody: "Buang satu dua tapisan, confirm jumpa.",
    resetFilters: "Reset tapisan",

    jump: "Lompat ikut huruf",
    letter: "Huruf {letter}",

    sheetTitle: "Tapis jenama",
    sheetDescription: "Senarai berubah terus bila kau pilih.",
    reset: "Reset",
    show: { one: "Tunjuk {count} jenama", other: "Tunjuk {count} jenama" },
  },

  profile: {
    back: "Semua jenama",
    share: "Kongsi {name}",
    copied: "Link dah copy. Share dengan geng!",
    shareFailed: "Alamak, tak jadi. Cuba lagi?",
    since: "Sejak {year}",
    tags: "Tag",
    tagLabels: {
      heritage: "warisan",
      affordable: "mampu milik",
      gift: "hadiah",
      handmade: "buatan tangan",
      premium: "premium",
      "small-batch": "batch kecil",
      kids: "kanak-kanak",
      unisex: "uniseks",
      "local-ingredients": "bahan tempatan",
      modest: "sopan",
      halal: "halal",
      eco: "mesra alam",
      "plant-based": "berasaskan tumbuhan",
      men: "lelaki",
      "cruelty-free": "cruelty-free",
      vegan: "vegan",
    },
    readMore: "Baca lagi",
    readLess: "Tutup balik",
    promoCount: { one: "{count} promo", other: "{count} promo" },
    newCount: { one: "{count} baru", other: "{count} baru" },

    statsLabel: "{brand} hari ni",
    statsTitle: "Kedai hari ni",
    statPromos: "Tengah promo",
    statNew: "Baru ({days} hari)",
    statMax: "Diskaun paling besar",
    statsNote: "Dikira daripada {count} produk dalam bacaan terakhir kedai rasmi. Harga boleh berubah, confirm kat kedai ya.",

    noStockBadge: "Takde stok dijumpai",
    noSyncBadge: "Belum boleh disync",
    noStockTitle: "Rak online kosong buat masa ni",
    noSyncTitle: "Kedai {brand} belum boleh disync",
    noStockBody: "Kami dah semak kedai rasmi diorang, tapi bacaan terakhir tak jumpa produk yang tengah dijual.",
    noSyncBody: "Kedai jenama ni belum boleh disync automatik, jadi kami tak tunjuk harga atau promo. Kami tengah usahakan.",
    noFeedVisit: "Tengok terus kat {link}.",
    noFeedLink: "kedai rasmi diorang",
    newTab: "(tab baru)",

    visit: "Lawat kedai rasmi",
    visitLabel: "Lawat kedai rasmi {brand} (tab baru)",
    website: "Laman web",
    websiteLabel: "Laman web {brand} (tab baru)",
    socialLabel: "{network} {brand} (tab baru)",
    links: "Pautan {brand}",

    tabsLabel: "Produk kedai",
    tabPromo: "Promo",
    tabNew: "Baru",

    noPromoTitle: "{brand} tengah takde promo.",
    noPromoBody: "Tapi produk diorang still best. Tengok yang baru!",
    noPromoCta: "Tengok Baru",
    morePromos: "Promo lain",

    priceNote: "Harga dan stok boleh berubah bila-bila masa. Confirm kat {link} sebelum bayar ya.",
    priceNoteLink: "kedai rasmi {brand}",

    noFresh: "Takde launch baru dari {brand} dalam {days} hari lepas.",
    noFreshLatest: "Ni produk terkini yang ada kat kedai diorang:",
    noFreshLater: "Check balik lepas sync seterusnya!",

    disclaimer: "Penafian",
    disclaimerSource: "Harga, promo dan produk diambil secara automatik dari kedai online rasmi {brand}, dan disemak lebih kurang setiap 3 jam.",
    disclaimerIndependent:
      "LokalLah! ialah direktori bebas. Kami tak jual apa-apa dan tak bergabung dengan, ditaja atau disahkan oleh {brand}. Nama jenama, tanda dagangan dan gambar produk adalah milik pemilik masing-masing.",
    disclaimerOutbound: "Link keluar ada tag utm_source=lokallah supaya jenama tahu trafik datang dari sini. Ini bukan link affiliate.",
    disclaimerOwner: "Pemilik {brand}? Nak kemas kini info atau keluar dari senarai? {link}.",
    disclaimerContact: "Hubungi kami",
  },

  bestDeal: {
    tag: "Deal terbaik",
    overline: "Diskaun paling besar",
    srBest: "deal terbaik {brand} sekarang",
    checked: "Harga disemak {time}",
    cta: "Beli kat kedai rasmi",
  },

  similar: {
    title: "Jenama serupa yang kau mungkin suka",
    sub: "Dari rak yang sama, saiz yang sama dulu.",
  },

  og: {
    alt: "Kad jenama LokalLah!: monogram, saiz jenama, kategori dan kiraan promo live dari kedai rasmi.",
    promos: { one: "{count} promo", other: "{count} promo" },
    new: { one: "{count} baru", other: "{count} baru" },
    live: "Kedai rasmi disemak live",
    empty: "Rak online kosong buat masa ni",
    directory: "Direktori jenama lokal",
  },
} satisfies BrandsMessages;

export default brands;
