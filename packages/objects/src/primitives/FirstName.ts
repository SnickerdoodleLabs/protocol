import { Brand, make } from "ts-brand";

export type FirstName = Brand<string, "FirstName">;
export const FirstName = make<FirstName>();
