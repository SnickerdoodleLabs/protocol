import { Brand, make } from "ts-brand";

// The X value of the p256's public key, represented as a Hex string in 32 bytes (it will be 64 characters, 66 with the leading 0x)
export type P256PublicKeyPointX = Brand<string, "P256PublicKeyPointX">;
export const P256PublicKeyPointX = make<P256PublicKeyPointX>();
