import { Brand, make } from "ts-brand";

export type ProviderUrl = Brand<string, "ProviderUrl">;
export const ProviderUrl = make<ProviderUrl>();
