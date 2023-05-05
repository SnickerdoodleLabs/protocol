import { Brand, make } from "ts-brand";

export type CompensationKey = Brand<string, "CompensationKey">;
export const CompensationKey = make<CompensationKey>();
