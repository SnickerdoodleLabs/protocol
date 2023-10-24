import { Brand, make } from "ts-brand";

/**
 * An Ethereum Contract Address, specifically one without EIP-55 or EIP 1991 checksums-
 * meaning all lower case.
 */
export type EVMContractAddress = Brand<string, "EVMContractAddress">;
export const EVMContractAddress = make<EVMContractAddress>();
