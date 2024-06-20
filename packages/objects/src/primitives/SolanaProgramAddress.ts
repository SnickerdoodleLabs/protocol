import { Brand, make } from "ts-brand";

/**
 * A Solana Program Address. Program is the Solana term for a smart contract.
 * This could be refered to as a SolanaContractAddress.
 */
export type SolanaProgramAddress = Brand<string, "SolanaProgramAddress">;
export const SolanaProgramAddress = make<SolanaProgramAddress>();
