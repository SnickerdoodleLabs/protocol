import { Brand, make } from "ts-brand";

export type DecimalString = Brand<string, "DecimalString">;
export const DecimalString = make<DecimalString>();
