import {
  EVMAccountAddress,
  FarcasterEncodedSignedKeyRequestMetadata,
  FarcasterSignedKeyRequestSignature,
} from "@snickerdoodlelabs/objects/src/primitives/index.js";

// Farcaster's Bundler's Signer param
// https://docs.farcaster.xyz/reference/contracts/reference/bundler#register

export class FarcasterBundlerSignerParams {
  public constructor(
    public keyType: number,
    public key: EVMAccountAddress,
    public metadataType: number,
    public metadata: FarcasterEncodedSignedKeyRequestMetadata,
    public signature: FarcasterSignedKeyRequestSignature,
    public deadline: bigint,
  ) {}
}
