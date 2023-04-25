import { Brand, make } from "ts-brand";

export type BearerToken = Brand<string, "BearerToken">;
export const BearerToken = make<BearerToken>();
