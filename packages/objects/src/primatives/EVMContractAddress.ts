import { Brand, make } from "ts-brand";

export type EVMContractAddress = Brand<string, "EVMContractAddress">;
export const EVMContractAddress = make<EVMContractAddress>();
