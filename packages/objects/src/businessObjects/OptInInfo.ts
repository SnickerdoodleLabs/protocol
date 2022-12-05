import { EVMContractAddress, TokenId } from "@objects/primitives";

export class OptInInfo {
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public tokenId: TokenId,
  ) {}
}
