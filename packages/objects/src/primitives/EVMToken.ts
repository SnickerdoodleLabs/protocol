import { Brand, make } from "ts-brand";

export type EVMToken = Brand<string, "EVMToken">;
export const EVMToken = make<EVMToken>();
