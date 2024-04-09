import {
  DomainName,
  EVMContractAddress,
  Signature,
  TokenId,
} from "@objects/primitives/index.js";

export class Invitation {
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public tokenId: TokenId | null,
    public domain: DomainName | null,
    public businessSignature: Signature | null,
  ) {}
}
