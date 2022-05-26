import { Brand, make } from "ts-brand";

export type CountryCode = Brand<number, "CountryCode">;
export const CountryCode = make<CountryCode>();
