import { Brand, make } from "ts-brand";

export type AdKey = Brand<string, "AdKey">;
export const AdKey = make<AdKey>();
