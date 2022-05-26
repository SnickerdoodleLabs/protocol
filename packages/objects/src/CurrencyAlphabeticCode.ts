import { Brand, make } from "ts-brand";

export type CurrencyAlphabeticCode = Brand<string, "CurrencyAlphabeticCode">;
export const CurrencyAlphabeticCode = make<CurrencyAlphabeticCode>();
