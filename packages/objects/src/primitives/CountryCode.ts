import { Brand, make } from "ts-brand";

export type CountryCode = Brand<string | number, "CountryCode">;
export const CountryCode = make<CountryCode>();
