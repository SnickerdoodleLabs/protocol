import { Brand, make } from "ts-brand";

// These are ISO 639-1 two-letter codes
export type LanguageCode = Brand<string, "LanguageCode">;
export const LanguageCode = make<LanguageCode>();
