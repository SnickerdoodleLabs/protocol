import { Brand, make } from "ts-brand";

export type SuiTransactionDigest = Brand<string, "SuiTransactionDigest">;
export const SuiTransactionDigest = make<SuiTransactionDigest>();
