import { URLString } from "@snickerdoodlelabs/objects";
import { ChatCompletion } from "openai/resources/chat";

import {
  Exemplar,
  IScraperConfig,
  LLMData,
  LLMResponse,
} from "@ai-scraper/interfaces";

export const AMAZON_URL = URLString(
  "https://www.amazon.com/gp/css/order-history?ref_=nav_orders_first",
);

export const GOOGLE_URL = URLString("https://www.google.com");

export const INVALID_URL = URLString("invalidUrl");

export const AMAZON_HOST_NAME = "www.amazon.com";

// region exemplars

export const Exemplars = [Exemplar("Q: 1 + 2 \n A: 3")];

export const scraperConfig: IScraperConfig = {
  scraper: {
    OPENAI_API_KEY: "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", // TODO: this is risky. What should we do
    timeout: 5 * 60 * 1000, // 5 minutes
  },
};

export const chatCompletion: ChatCompletion = {
  id: "cmpl-3QJ8Z5jX9J5X3",
  object: "text_completion",
  created: 1627770949,
  model: "gpt-3.5-turbo",
  choices: [
    {
      finish_reason: "stop",
      index: 0,
      message: { content: "chatCompletion test content", role: "user" },
    },
  ],
};
