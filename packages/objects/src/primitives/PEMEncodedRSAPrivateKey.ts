import { Brand, make } from "ts-brand";

export type PEMEncodedRSAPrivateKey = Brand<string, "PEMEncodedRSAPrivateKey">;
export const PEMEncodedRSAPrivateKey = make<PEMEncodedRSAPrivateKey>();
