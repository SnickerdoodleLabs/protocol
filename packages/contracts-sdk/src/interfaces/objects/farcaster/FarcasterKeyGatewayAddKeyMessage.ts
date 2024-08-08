import { ED25519PublicKey, EVMAccountAddress, FarcasterEncodedSignedKeyRequestMetadata, UnixTimestamp } from "@snickerdoodlelabs/objects";

// Farcaster's Add Signature https://docs.farcaster.xyz/reference/contracts/reference/key-gateway#add-signature

export class FarcasterKeyGatewayAddKeyMessage {
    public constructor(
        public owner: EVMAccountAddress,
        public keyType: number,
        public key: ED25519PublicKey,
        public metadataType: number,
        public metadata: FarcasterEncodedSignedKeyRequestMetadata,
        public nonce: bigint,
        public deadline: UnixTimestamp,
    ) {
    }
}