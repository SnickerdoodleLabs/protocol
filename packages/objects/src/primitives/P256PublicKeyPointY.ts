import { Brand, make } from "ts-brand";

// The Y value of the p256's public key, represented as a Hex string in 32 bytes (it will be 64 characters, 66 with the leading 0x)
export type P256PublicKeyPointY = Brand<string, "P256PublicKeyPointY">;
export const P256PublicKeyPointY = make<P256PublicKeyPointY>();
