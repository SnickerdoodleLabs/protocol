import { Brand, make } from "ts-brand";

export type PEMEncodedRSAPublicKey = Brand<string, "PEMEncodedRSAPublicKey">;
export const PEMEncodedRSAPublicKey = make<PEMEncodedRSAPublicKey>();
