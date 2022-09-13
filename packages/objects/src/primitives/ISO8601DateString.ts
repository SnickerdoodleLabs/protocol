import { Brand, make } from "ts-brand";

export type ISO8601DateString = Brand<string, "ISO8601DateString">;
export const ISO8601DateString = make<ISO8601DateString>();
