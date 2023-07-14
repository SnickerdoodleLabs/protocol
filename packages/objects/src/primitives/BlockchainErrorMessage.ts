import { Brand, make } from "ts-brand";

export type BlockchainErrorMessage = Brand<string, "BlockchainErrorMessage">;
export const BlockchainErrorMessage = make<BlockchainErrorMessage>();
