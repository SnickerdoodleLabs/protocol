import { Brand, make } from "ts-brand";

export type UUID = Brand<string, "UUID">;
export const UUID = make<UUID>();
