import { Brand, make } from "ts-brand";

export type Keyword = Brand<string, "Keyword">;
export const Keyword = make<Keyword>();
