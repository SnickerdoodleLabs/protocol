import { Brand, make } from "ts-brand";

// The hex string of the P256 signature
export type P256Signature = Brand<string, "P256Signature">;
export const P256Signature = make<P256Signature>();
