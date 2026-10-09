import type { ErrorsMessages } from "../en/errors";

/** `errors` in Bahasa Melayu (DESIGN §9.7). */
const errors = {
  notFound: {
    metaTitle: "Rak kosong",
    title: "Alamak, rak ni kosong!",
    body: "Page yang kau cari dah habis stok, atau memang tak pernah wujud. Oyen pun tertidur menunggu.",
    home: "Balik ke kedai",
    shortcuts: "Pintasan",
    categories: "Kategori",
  },
  error: {
    title: "Alamak, ada benda tak kena kat pihak kami.",
    body: "Bukan salah kau. Cuba lagi kejap? Kalau masih tak jadi, balik ke kedai dulu.",
    retry: "Cuba lagi",
    home: "Balik ke kedai",
  },
  global: {
    pageTitle: "Alamak",
    title: "Alamak, ada benda tak kena.",
    body: "Bukan salah kau. Cuba lagi kejap?",
    retry: "Cuba lagi",
    home: "Utama",
  },
} satisfies ErrorsMessages;

export default errors;
