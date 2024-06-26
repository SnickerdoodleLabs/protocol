import {
  FarcasterEncodedSignedKeyRequestMetadata,
  FarcasterSignedKeyRequestSignature,
} from "@snickerdoodlelabs/objects/src/primitives/index.js";

// Combining Farcaster's Signed Key Request signature and encoded metadata

export class SignedKeyRequest {
  public constructor(
    public signedKeyRequestSignature: FarcasterSignedKeyRequestSignature,
    public encodedSignedKeyRequestMetadata: FarcasterEncodedSignedKeyRequestMetadata,
  ) {}
}
