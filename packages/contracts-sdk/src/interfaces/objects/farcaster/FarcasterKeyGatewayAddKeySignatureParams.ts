
  import { FarcasterKeyGatewayAddKeyMessage, FarcasterKeyGatewayEIP712AddTypes, FarcasterKeyGatewayEIP712Domain} from "@contracts-sdk/interfaces/objects/farcaster/index.js";

  export class FarcasterKeyGatewayAddKeySignatureParams {
    public constructor(
      public keyGatewayEIP712Domain: FarcasterKeyGatewayEIP712Domain,
      public keyGatewayEIP712AddTypes: FarcasterKeyGatewayEIP712AddTypes,
      public addKeyMessage: FarcasterKeyGatewayAddKeyMessage,
    ) {}
  }