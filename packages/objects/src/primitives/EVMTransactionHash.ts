import { Brand, make } from "ts-brand";

export type EVMTransactionHash = Brand<string, "EVMTransactionHash">;
export const EVMTransactionHash = make<EVMTransactionHash>();
