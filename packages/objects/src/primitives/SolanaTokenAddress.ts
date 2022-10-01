import { Brand, make } from "ts-brand";

export type SolanaTokenAddress = Brand<string, "SolanaTokenAddress">;
export const SolanaTokenAddress = make<SolanaTokenAddress>();
