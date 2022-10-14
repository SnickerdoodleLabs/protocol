import { Brand, make } from "ts-brand";

export type CompensationId = Brand<string, "CompensationId">;
export const CompensationId = make<CompensationId>();
