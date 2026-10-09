import about from "./about";
import brands from "./brands";
import categories from "./categories";
import common from "./common";
import errors from "./errors";
import home from "./home";
import listings from "./listings";
import meta from "./meta";
import saved from "./saved";
import search from "./search";

/** Every namespace in one object (server: getDictionary(); client: a subset via getMessages()). */
const messages = { common, home, listings, brands, categories, search, saved, about, errors, meta };

export default messages;
export type Messages = typeof messages;
export type Namespace = keyof Messages;
