import { Brand, make } from "ts-brand";

export type MillisecondTimestamp = Brand<number, "MillisecondTimestamp">;
export const MillisecondTimestamp = make<MillisecondTimestamp>();
