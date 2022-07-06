import { Brand, make } from "ts-brand";

export type EVMPrivateKey = Brand<string, "EVMPrivateKey">;
export const EVMPrivateKey = make<EVMPrivateKey>();
