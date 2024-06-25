import { Brand, make } from "ts-brand";

// Encoded version of Farcaster's SignedKeyRequestMetadata
// https://docs.farcaster.xyz/reference/contracts/reference/signed-key-request-validator#signedkeyrequestmetadata-struct

export type EncodedSignedKeyRequestMetadata = Brand<
  string,
  "EncodedSignedKeyRequestMetadata"
>;
export const EncodedSignedKeyRequestMetadata =
  make<EncodedSignedKeyRequestMetadata>();
