import {
  DomainName,
  EthereumContractAddress,
  Signature,
  TokenId,
} from "@objects/primatives";

export class CohortInvitation {
  public constructor(
    public domain: DomainName,
    public consentContractAddress: EthereumContractAddress,
    public tokenId: TokenId,
    public businessSignature: Signature | null,
  ) {}
}
