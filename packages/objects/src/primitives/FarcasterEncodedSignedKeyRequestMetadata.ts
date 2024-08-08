import { Brand, make } from "ts-brand";

// Encoded version of Farcaster's SignedKeyRequestMetadata
// https://docs.farcaster.xyz/reference/contracts/reference/signed-key-request-validator#signedkeyrequestmetadata-struct

export type FarcasterEncodedSignedKeyRequestMetadata = Brand<
  string,
  "FarcasterEncodedSignedKeyRequestMetadata"
>;
export const FarcasterEncodedSignedKeyRequestMetadata =
  make<FarcasterEncodedSignedKeyRequestMetadata>();
