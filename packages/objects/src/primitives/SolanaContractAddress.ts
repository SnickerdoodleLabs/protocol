import { Brand, make } from "ts-brand";

export type SolanaContractAddress = Brand<string, "SolanaContractAddress">;
export const SolanaContractAddress = make<SolanaContractAddress>();
