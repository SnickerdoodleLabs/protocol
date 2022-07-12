import { Brand, make } from "ts-brand";

export type EVMChainCode = Brand<string, "EVMChainCode">;
export const EVMChainCode = make<EVMChainCode>();
