import {
  EVMAccountAddress,
  EncodedSignedKeyRequestMetadata,
  Signature,
  SignedKeyRequestSignature,
} from "@snickerdoodlelabs/objects/src/primitives/index.js";

// Combining Farcaster's Signed Key Request signature and encoded metadata

export class SignerParams {
  public constructor(
    public keyType: number,
    public key: EVMAccountAddress,
    public metadataType: number,
    public metadata: EncodedSignedKeyRequestMetadata,
    public signature: SignedKeyRequestSignature,
    public deadline: bigint,
  ) {}
}
