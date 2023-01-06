import { Brand, make } from "ts-brand";

export type AdId = Brand<string, "AdId">;
export const AdId = make<AdId>();
