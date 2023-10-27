import { Brand, make } from "ts-brand";

/**
 * An Ethereum Account Address, specifically one without EIP-55 or EIP 1991 checksums-
 * meaning all lower case.
 */
export type EVMAccountAddress = Brand<string, "EVMAccountAddress">;
export const EVMAccountAddress = make<EVMAccountAddress>();

export const EVMAccountAddressRegex = /^0x[a-fA-F0-9]{40}$/;
