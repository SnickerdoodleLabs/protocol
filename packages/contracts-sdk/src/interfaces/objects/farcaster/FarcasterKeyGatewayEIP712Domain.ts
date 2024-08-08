import {SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_TYPES} from "@farcaster/hub-nodejs";
  
export class FarcasterKeyGatewayEIP712Domain {
    public readonly name: string;
    public readonly version: string;
    public readonly chainId: number;
    public readonly verifyingContract: string;

    public constructor() {
        this.name = SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_TYPES.domain.name;
        this.version = SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_TYPES.domain.version;
        this.chainId = SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_TYPES.domain.chainId;
        this.verifyingContract = SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_TYPES.domain.verifyingContract;
    }
}