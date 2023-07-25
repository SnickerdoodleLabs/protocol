import { Brand, make } from "ts-brand";

export type ProofString = Brand<string, "ProofString">;
export const ProofString = make<ProofString>();
