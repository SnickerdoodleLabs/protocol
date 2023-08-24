import { URLString } from "@snickerdoodlelabs/objects";
import { ChatCompletion } from "openai/resources/chat";

import { Exemplar, IScraperConfig, LLMResponse } from "@ai-scraper/interfaces";

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

export const chatGPTPurchaseHistoryResponse = LLMResponse(
  '[\n    {\n        "name": "VANMASS Universal Car Phone Mount",\n        "brand": "VANMASS",\n        "price": 23.8,\n        "classification": "Electronics",\n        "keywords": ["car phone mount", "handsfree stand", "phone holder", "dashboard", "windshield", "compatible", "iPhone", "Samsung", "Android", "pickup truck"],\n        "date": "July 12, 2023"\n    },\n    {\n        "name": "Genie 7155-TKV Smart Garage Door Opener",\n        "brand": "Genie",\n        "price": 246.8,\n        "classification": "Home Improvement",\n        "keywords": ["garage door opener", "smart", "WiFi", "battery backup", "Alexa", "Google Home"],\n        "date": "July 12, 2023"\n    },\n    {\n        "name": "Flexzilla Garden Hose",\n        "brand": "Flexzilla",\n        "price": 57.99,\n        "classification": "Patio, Lawn & Garden",\n        "keywords": ["garden hose", "heavy duty", "lightweight", "drinking water safe", "ZillaGreen"],\n        "date": "July 11, 2023"\n    },\n    {\n        "name": "Homall L Shaped Gaming Desk",\n        "brand": "Homall",\n        "price": 64.94,\n        "classification": "Office Products",\n        "keywords": ["gaming desk", "computer corner desk", "PC gaming desk", "monitor riser stand", "home office", "writing workstation"],\n        "date": "July 9, 2023"\n    },\n    {\n        "name": "ASURION 3 Year Furniture Protection Plan",\n        "brand": "ASURION",\n        "price": 15.14,\n        "classification": "Home & Kitchen",\n        "keywords": ["furniture protection plan"],\n        "date": "July 9, 2023"\n    },\n    {\n        "name": "Rust-Oleum 261845 EpoxyShield Garage Floor Coating",\n        "brand": "Rust-Oleum",\n        "price": 200.25,\n        "classification": "Tools & Home Improvement",\n        "keywords": ["garage floor coating", "2 gal", "gray"],\n        "date": "July 3, 2023"\n    },\n    {\n        "name": "Bonnlo 3 Burner Outdoor Portable Propane Stove Gas Cooker",\n        "brand": "Bonnlo",\n        "price": 115.92,\n        "classification": "Sports & Outdoors",\n        "keywords": ["outdoor portable propane stove", "gas cooker", "heavy duty", "iron cast", "patio burner", "camp cooking"],\n        "date": "July 1, 2023"\n    },\n    {\n        "name": "Purrfectzone Bidet Sprayer for Toilet",\n        "brand": "Purrfectzone",\n        "price": 0,\n        "classification": "Tools & Home Improvement",\n        "keywords": ["bidet sprayer", "handheld sprayer kit", "cloth diaper sprayer set"],\n        "date": "June 27, 2023"\n    },\n    {\n        "name": "Mielle Organics Rosemary Mint Scalp & Hair Strengthening Oil",\n        "brand": "Mielle Organics",\n        "price": 9.78,\n        "classification": "Beauty & Personal Care",\n        "keywords": ["hair strengthening oil", "biotin", "essential oils", "nourishing treatment", "split ends", "dry scalp"],\n        "date": "June 26, 2023"\n    },\n    {\n        "name": "Cantu Coconut Curling Cream with Shea Butter",\n        "brand": "Cantu",\n        "price": 25.64,\n        "classification": "Beauty & Personal Care",\n        "keywords": ["coconut curling cream", "shea butter", "natural hair"],\n        "date": "June 26, 2023"\n    },\n    {\n        "name": "Amazon Brand - Mama Bear Organic Kids Vitamin D3 25 mcg (1000 IU) Gummies",\n        "brand": "Amazon Brand - Mama Bear",\n        "price": 25.64,\n        "classification": "Health & Household",\n        "keywords": ["organic kids vitamin D3", "bone health", "immune health", "strawberry"],\n        "date": "June 26, 2023"\n    },\n    {\n        "name": "Garnier Fructis Sleek & Shine Moroccan Sleek Smoothing Oil",\n        "brand": "Garnier Fructis",\n        "price": 25.64,\n        "classification": "Beauty & Personal Care",\n        "keywords": ["sleek & shine oil", "frizzy hair", "dry hair", "argan oil"],\n        "date": "June 26, 2023"\n    }\n]',
);

export const firstPurchase = {
  name: "VANMASS Universal Car Phone Mount",
  brand: "VANMASS",
  price: 23.8,
  classification: "Electronics",
  keywords: [
    "car phone mount",
    "handsfree stand",
    "phone holder",
    "dashboard",
    "windshield",
    "compatible",
    "iPhone",
    "Samsung",
    "Android",
    "pickup truck",
  ],
  date: "July 12, 2023",
};

export const multiplePurchasesInOneOrder = [
  {
    name: "Cantu Coconut Curling Cream with Shea Butter",
    brand: "Cantu",
    price: 25.64,
    classification: "Beauty & Personal Care",
    keywords: ["coconut curling cream", "shea butter", "natural hair"],
    date: "June 26, 2023",
  },
  {
    name: "Amazon Brand - Mama Bear Organic Kids Vitamin D3 25 mcg (1000 IU) Gummies",
    brand: "Amazon Brand - Mama Bear",
    price: 25.64,
    classification: "Health & Household",
    keywords: [
      "organic kids vitamin D3",
      "bone health",
      "immune health",
      "strawberry",
    ],
    date: "June 26, 2023",
  },
  {
    name: "Garnier Fructis Sleek & Shine Moroccan Sleek Smoothing Oil",
    brand: "Garnier Fructis",
    price: 25.64,
    classification: "Beauty & Personal Care",
    keywords: ["sleek & shine oil", "frizzy hair", "dry hair", "argan oil"],
    date: "June 26, 2023",
  },
];
