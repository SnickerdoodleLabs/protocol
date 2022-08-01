import {
  EVMAccountAddress,
  EVMContractAddress,
  TokenId,
  TokenUri,
} from "@objects/primitives";

export class ConsentToken {
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public ownerAddress: EVMAccountAddress,
    public tokenId: TokenId,
    public tokenUri: TokenUri,
  ) {}
}
