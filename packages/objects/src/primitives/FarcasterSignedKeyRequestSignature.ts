import { Brand, make } from "ts-brand";

// Fascaster's SignedKeyRequest signature
// https://docs.farcaster.xyz/reference/contracts/reference/signed-key-request-validator#signedkeyrequest-signature

export type FarcasterSignedKeyRequestSignature = Brand<
  string,
  "FarcasterSignedKeyRequestSignature"
>;
export const FarcasterSignedKeyRequestSignature =
  make<FarcasterSignedKeyRequestSignature>();
