import { Brand, make } from "ts-brand";

export type CompensationIdentifier = Brand<string, "CompensationIdentifier">;
export const CompensationIdentifier = make<CompensationIdentifier>();
