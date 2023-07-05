import { Brand, make } from "ts-brand";

export type EVMAccountAddress = Brand<string, "EVMAccountAddress">;
export const EVMAccountAddress = make<EVMAccountAddress>();

export const EVMAccountAddressRegex = /^0x[a-fA-F0-9]{40}$/;
