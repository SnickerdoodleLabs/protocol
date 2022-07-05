import { Brand, make } from "ts-brand";

export type FamilyName = Brand<string, "FamilyName">;
export const FamilyName = make<FamilyName>();
