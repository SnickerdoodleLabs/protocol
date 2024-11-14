import { Brand, make } from "ts-brand";

// The X value of the p256's public key, represented as a Hex string in 32 bytes (it will be 64 characters, 66 with the leading 0x)
export type P256PublicKey = Brand<string, "P256PublicKey">;
export const P256PublicKey = make<P256PublicKey>();
