import { Brand, make } from "ts-brand";

// The S value of the P256 Signature represented as a Hex string in 32 bytes (it will be 64 characters, 66 with the leading 0x)
export type P256SignatureS = Brand<string, "P256SignatureS">;
export const P256SignatureS = make<P256SignatureS>();
