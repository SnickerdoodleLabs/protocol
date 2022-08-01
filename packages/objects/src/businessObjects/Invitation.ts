import {
  DomainName,
  EVMContractAddress,
  Signature,
  TokenId,
} from "@objects/primitives";

export class Invitation {
  public constructor(
    public domain: DomainName,
    public consentContractAddress: EVMContractAddress,
    public tokenId: TokenId,
    public businessSignature: Signature | null,
  ) {}
}
