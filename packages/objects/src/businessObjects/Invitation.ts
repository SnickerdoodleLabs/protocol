import { OptInInfo } from "@objects/businessObjects/OptInInfo.js";
import {
  DomainName,
  EVMContractAddress,
  Signature,
  TokenId,
} from "@objects/primitives";

export class Invitation extends OptInInfo {
  public constructor(
    public domain: DomainName,
    public consentContractAddress: EVMContractAddress,
    public tokenId: TokenId,
    public businessSignature: Signature | null,
  ) {
    super(consentContractAddress, tokenId);
  }
}
