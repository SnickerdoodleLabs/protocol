import { Brand, make } from "ts-brand";

export type ConsentName = Brand<string, "ConsentName">;
export const ConsentName = make<ConsentName>();
