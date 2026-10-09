/** `errors`: 404 and error frames (DESIGN §8.10, §9.7). English source shape. */
const errors = {
  notFound: {
    metaTitle: "Empty shelf",
    title: "Oops, this shelf is empty!",
    body: "The page you're looking for is out of stock, or never existed. Oyen, our shop cat, fell asleep waiting.",
    home: "Back to the shop",
    shortcuts: "Shortcuts",
    categories: "Categories",
  },
  error: {
    title: "Oops, something went wrong on our side.",
    body: "It's not your fault. Try again in a moment? If it still doesn't work, head back to the shop.",
    retry: "Try again",
    home: "Back to the shop",
  },
  /** Root-layout failure (global-error.tsx): no i18n context there, so it shows both languages. */
  global: {
    pageTitle: "Oops",
    title: "Oops, something went wrong.",
    body: "It's not your fault. Try again in a moment?",
    retry: "Try again",
    home: "Home",
  },
};

export default errors;
export type ErrorsMessages = typeof errors;
