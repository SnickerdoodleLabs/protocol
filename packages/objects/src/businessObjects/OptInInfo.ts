import { EVMContractAddress, TokenId } from "@objects/primitives/index.js";

export class OptInInfo {
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public tokenId: TokenId,
  ) {}
}
