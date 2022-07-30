import { Brand, make } from "ts-brand";

export type UnixTimestamp = Brand<number, "UnixTimestamp">;
export const UnixTimestamp = make<UnixTimestamp>();
