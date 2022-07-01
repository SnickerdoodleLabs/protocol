import { Brand, make } from "ts-brand";

export type EVMAccountAddress = Brand<string, "EVMAccountAddress">;
export const EVMAccountAddress = make<EVMAccountAddress>();
