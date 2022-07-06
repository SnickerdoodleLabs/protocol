import { Brand, make } from "ts-brand";

export type DomainName = Brand<string, "DomainName">;
export const DomainName = make<DomainName>();
