import { Brand, make } from "ts-brand";

export type PageNumber = Brand<number, "PageNumber">;
export const PageNumber = make<PageNumber>();
