import { Brand, make } from "ts-brand";

// The R value of the P256 Signature represented as a Hex string in 32 bytes (it will be 64 characters, 66 with the leading 0x)
export type P256SignatureComponentArrayBuffer = Brand<
  ArrayBufferLike,
  "P256SignatureComponentArrayBuffer"
>;
export const P256SignatureComponentArrayBuffer =
  make<P256SignatureComponentArrayBuffer>();
