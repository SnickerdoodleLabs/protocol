import { Brand, make } from "ts-brand";

// Fascaster's SignedKeyRequest signature
// https://docs.farcaster.xyz/reference/contracts/reference/signed-key-request-validator#signedkeyrequest-signature

export type SignedKeyRequestSignature = Brand<
  string,
  "SignedKeyRequestSignature"
>;
export const SignedKeyRequestSignature = make<SignedKeyRequestSignature>();
