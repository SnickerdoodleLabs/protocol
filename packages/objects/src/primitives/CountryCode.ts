import { Brand, make } from "ts-brand";

export type CountryCode = Brand<string, "CountryCode">;
export const CountryCode = make<CountryCode>();
