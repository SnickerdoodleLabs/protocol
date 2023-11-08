import { Brand, make } from "ts-brand";

export type SuiTransactionHash = Brand<string, "SuiTransactionHash">;
export const SuiTransactionHash = make<SuiTransactionHash>();
