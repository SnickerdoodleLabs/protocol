import {
  EthereumContractAddress,
  Signature,
  TokenId,
} from "@objects/primitives";

export class CohortInvitation {
  public constructor(
    public consentContractAddress: EthereumContractAddress,
    public tokenId: TokenId,
    public businessSignature: Signature | null,
  ) {}
}
