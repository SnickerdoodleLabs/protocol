import { Brand, make } from "ts-brand";

export type CountryCodeLetter = Brand<string, "CountryCode">;
export const CountryCodeLetter = make<CountryCodeLetter>();

export type CountryCodeNumber = Brand<number, "CountryCode">;
export const CountryCodeNumber = make<CountryCodeNumber>();
