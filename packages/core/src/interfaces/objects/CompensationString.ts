import { Brand, make } from "ts-brand";

export type CompensationString = Brand<string, "CompensationString">;
export const CompensationString = make<CompensationString>();
