import { Brand, make } from "ts-brand";

export type EVMBlockNumber = Brand<number, "EVMBlockNumber">;
export const EVMBlockNumber = make<EVMBlockNumber>();
