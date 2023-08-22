import { URLString } from "@snickerdoodlelabs/objects";

import { Exemplar } from "@ai-scraper/interfaces";

export const AMAZON_URL = URLString(
  "https://www.amazon.com/gp/css/order-history?ref_=nav_orders_first",
);

export const GOOGLE_URL = URLString("https://www.google.com");

export const INVALID_URL = URLString("invalidUrl");

export const AMAZON_HOST_NAME = "www.amazon.com";

// region exemplars

export const Exemplars = [Exemplar("Q: 1 + 2 \n A: 3")];
