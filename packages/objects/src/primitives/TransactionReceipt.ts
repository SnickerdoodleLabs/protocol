import { Brand, make } from "ts-brand";

export type TransactionReceipt = Brand<string, "TransactionReceipt">;
export const TransactionReceipt = make<TransactionReceipt>();
