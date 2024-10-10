import { Brand, make } from "ts-brand";

// The X value of the passkey's public key, represented as a Hex string in 32 bytes (it will be 64 characters, 66 with the leading 0x)
export type ECDSASignaturePointS = Brand<string, "ECDSASignaturePointS">;
export const ECDSASignaturePointS = make<ECDSASignaturePointS>();
