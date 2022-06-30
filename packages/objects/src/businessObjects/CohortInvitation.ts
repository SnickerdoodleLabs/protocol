import {
  DomainName,
  EVMContractAddress,
  Signature,
  TokenId,
} from "@objects/primatives";

export class CohortInvitation {
  public constructor(
    public domain: DomainName,
    public consentContractAddress: EVMContractAddress,
    public tokenId: TokenId,
    public businessSignature: Signature | null,
  ) {}
}
