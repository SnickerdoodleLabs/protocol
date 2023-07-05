import { Brand, make } from "ts-brand";

export type Integer = Brand<number, "Integer">;
export const Integer = make<Integer>();
