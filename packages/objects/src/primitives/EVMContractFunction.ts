import { Brand, make } from "ts-brand";

export type EVMContractFunction = Brand<string, "EVMContractFunction">;
export const EVMContractFunction = make<EVMContractFunction>();
