import { Brand, make } from "ts-brand";

// The R value of the P256 Signature represented as a Hex string in 32 bytes (it will be 64 characters, 66 with the leading 0x)
export type P256SignatureR = Brand<string, "P256SignatureR">;
export const P256SignatureR = make<P256SignatureR>();
