import { Brand, make } from "ts-brand";

export type Year = Brand<number, "Year">;
export const Year = make<Year>();
