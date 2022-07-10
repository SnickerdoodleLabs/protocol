import { Brand, make } from "ts-brand";

export type GivenName = Brand<string, "GivenName">;
export const GivenName = make<GivenName>();
