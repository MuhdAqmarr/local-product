import type { AboutMessages } from "../en/about";

/** `about` in Bahasa Melayu (DESIGN §8.8, §9.3, §9.4, §9.10). */
const about = {
  meta: {
    title: "Tentang",
    description: "Kenapa LokalLah! wujud, cara kami sync data dari kedai rasmi, apa maksud tier jenama, dan cara cadang jenama lokal.",
    socialDescription: "Kenapa LokalLah! wujud dan cara kami sync data dari kedai rasmi.",
  },

  hero: {
    eyebrow: "Tentang LokalLah!",
    title: "Semuanya bermula dengan satu {accent}.",
    accent: "soalan",
  },

  quote: {
    who: "seorang netizen kat Threads",
    glossLabel: "",
    gloss: "",
    answer: "Boleh.",
    answerSub: "Ni dia, dan kami pastikan sentiasa up to date.",
    chips: {
      sync: "Auto-sync",
      promos: "Promo dikesan",
      launches: "Launch baru ditangkap",
    },
  },

  sync: {
    eyebrow: "Cara kami sync",
    title: "Macam mana kami sentiasa {accent}?",
    accent: "up to date",
    steps: [
      {
        title: "Sync dari kedai rasmi",
        body: "Robot kecil kami ronda setiap kedai online yang boleh kami baca, lebih kurang setiap 3 jam, dan sekali lagi setiap pagi sekitar pukul 6.",
      },
      {
        title: "Kesan harga turun & produk baru",
        body: "Harga asal vs harga sekarang? Kami kira diskaun untuk kau. Produk baru terus naik rak.",
      },
      {
        title: "Klik terus ke kedai",
        body: "Kami tak jual apa-apa. Kau beli terus dari jenama, duit sampai kat diorang.",
      },
    ],
    stats: "Sekarang, {live} daripada {total} jenama ada kedai online yang kami boleh baca terus. Yang lain kami senaraikan dengan link rasmi diorang je. Sync terakhir: {when}.",
  },

  tiers: {
    eyebrow: "Saiz jenama",
    title: "Dari Cili Padi ke Jenama {accent}",
    accent: "Ikon",
    sub: "Setiap jenama besar pernah bermula kecil.",
    count: { one: "jenama", other: "jenama" },
    srCount: { one: "{count} jenama", other: "{count} jenama" },
    seeAll: "Tengok semua",
  },

  who: {
    title: "Siapa kami (dan siapa kami bukan)",
    weAre: "Kami ni…",
    weAreList: [
      "Direktori bebas jenama Malaysia, dari Cili Padi sampai Jenama Ikon.",
      "Harga, promo dan produk dibaca terus dari kedai online rasmi jenama (yang boleh kami baca).",
      "Link keluar ada tag utm_source=lokallah supaya jenama tahu trafik datang dari sini.",
    ],
    weAreNot: "Kami bukan…",
    weAreNotList: [
      "Kedai. Kami tak jual apa-apa; kau beli terus dari jenama.",
      "Rakan rasmi, penaja atau wakil mana-mana jenama.",
      "Link affiliate, komisen atau tempat berbayar.",
    ],
    prices: "Harga dan stok boleh berubah bila-bila masa. Sila sahkan harga akhir di kedai rasmi sebelum membeli.",
    trademarks: "Nama jenama, tanda dagangan dan gambar produk adalah milik pemilik masing-masing.",
    owners: "Pemilik jenama? Nak kemas kini info atau keluar dari senarai? {form}.",
    ownersForm: "Guna borang kat bawah",
    maker: "LokalLah! direka dan dibina oleh {maker}.",
    newTab: "(buka dalam tab baru)",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Soalan yang selalu orang tanya",
    source: {
      q: "Data harga dan promo ni datang dari mana?",
      a: "Terus dari kedai online rasmi jenama. Kami baca senarai produk kedai tu, kira diskaun dari harga asal vs harga sekarang, dan tandakan produk yang baru dilancar. Jenama yang kedainya belum boleh dibaca automatik tetap disenaraikan, dengan link rasmi diorang.",
    },
    frequency: {
      q: "Berapa kerap data dikemas kini?",
      a: "Lebih kurang setiap 3 jam di belakang tabir, dan sekali lagi setiap hari sekitar pukul 6 pagi. Sync terakhir: {when}. Setiap kad produk tunjuk bila harganya disemak.",
    },
    prices: {
      q: "Harga kat sini confirm sama dengan kat kedai?",
      a: "Harga dan stok boleh berubah bila-bila masa, termasuk antara dua sync. Sila sahkan harga akhir kat kedai rasmi jenama sebelum bayar.",
    },
    affiliation: {
      q: "LokalLah! ada kaitan dengan jenama-jenama ni?",
      a: "Tak ada. LokalLah! ialah direktori bebas. Kami tak bergabung dengan, ditaja atau disahkan oleh mana-mana jenama yang disenaraikan. Kami tak ambil komisen, dan tak ada tempat berbayar: susunan jenama dan produk bukan untuk dijual.",
    },
    utm: {
      q: "Kenapa link keluar ada utm_source=lokallah?",
      a: "Supaya jenama boleh nampak dalam analitik diorang yang lawatan tu datang dari LokalLah!. Ini bukan link affiliate dan kami tak dapat apa-apa bila kau beli.",
    },
    tiers: {
      q: "Apa beza Cili Padi, Naik Daun dan Jenama Ikon?",
      a: "Tier ni cerita saiz jenama: Cili Padi untuk pembuat kecil dan home-grown, Naik Daun untuk jenama yang tengah makin dikenali, Jenama Ikon untuk nama yang satu Malaysia kenal. {link}.",
      link: "Tengok tier",
    },
    saved: {
      q: "Simpanan aku disimpan kat mana?",
      a: "Dalam browser kau je (localStorage). Tak perlu login dan kami tak nampak apa yang kau simpan. Clear data browser, hilanglah dia.",
    },
    owners: {
      q: "Aku pemilik jenama. Nak betulkan info atau keluar dari senarai?",
      a: "Boleh. Guna {link} kat bawah, bagitahu nama jenama dan apa yang perlu diubah.",
      link: "borang cadangan",
    },
  },

  suggest: {
    eyebrow: "Cadang jenama",
    title: "Kenal jenama lokal yang best?",
    sub: "Cadang la. Oyen catat, kami semak.",
    emailNote: "Bila hantar, app email kau akan terbuka dengan semua dah siap diisi; kau cuma tekan hantar.",
    closedTitle: "Cadangan dibuka tak lama lagi!",
    closedBody: "Oyen tengah siapkan peti cadangan. Sementara tu, kau boleh hubungi team di sebalik LokalLah! kat {maker}.",
    handNote: "Oyen dah sedia pen!",
  },

  form: {
    name: "Nama jenama",
    link: "Link kedai / Instagram",
    linkPlaceholder: "kedaijenama.com atau @jenama",
    linkHelper: "Kedai online rasmi jenama ni (Shopify, WooCommerce, website) atau akaun Instagram.",
    category: "Kategori",
    state: "Negeri",
    notSure: "Tak pasti",
    why: "Kenapa best?",
    whyPlaceholder: "Produk paling laku, kenapa kau suka, apa-apa je.",
    email: "Email kau (tak wajib)",
    emailHelper: "Hanya untuk kami hubungi kau pasal cadangan ni.",
    honeypot: "Laman web (biar kosong)",
    required: "Medan bertanda {star} wajib.",
    noteEmail: "Cadangan kau dihantar dari app email kau sendiri.",
    noteWebhook: "Oyen catat, kami semak.",
    submit: "Hantar cadangan",

    sentTitle: "Terima kasih! Oyen dah catat cadangan kau.",
    sentBody: "Kami akan semak jenama ni. Kalau sesuai, dia akan naik rak LokalLah!.",
    emailTitle: "Hampir siap! Tinggal satu tekan je.",
    emailBody: "App email kau akan terbuka dengan cadangan yang dah siap diisi. Tekan hantar je.",
    emailCta: "Buka email & hantar",
    another: "Cadang satu lagi",

    sendFailed: "Alamak, tak jadi hantar. Cuba lagi, atau hantar guna email.",
    failed: "Alamak, tak jadi. Cuba lagi?",
    sendDirect: "Hantar guna email",

    errors: {
      nameShort: "Tulis nama jenama (sekurang-kurangnya 2 huruf).",
      linkMissing: "Letak link kedai online atau Instagram jenama ni.",
      linkInvalid: "Link tak sah. Contoh: kedaijenama.com atau @jenama",
      category: "Pilih kategori dari senarai.",
      state: "Pilih negeri dari senarai.",
      email: "Email tak sah. Boleh biar kosong.",
    },
  },

  issue: {
    title: "Cadangan jenama: {name}",
    name: "Nama jenama",
    link: "Link kedai / Instagram",
    category: "Kategori",
    state: "Negeri",
    why: "Kenapa best?",
    footer: "Dihantar dari borang Cadang jenama LokalLah!.",
  },
} satisfies AboutMessages;

export default about;
