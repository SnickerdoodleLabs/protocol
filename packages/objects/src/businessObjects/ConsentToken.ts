import {
  EVMAccountAddress,
  TokenId,
  TokenUri,
} from "@objects/primitives";

export class ConsentToken {
  public constructor(
    public ownerAddress: EVMAccountAddress,
    public tokenId: TokenId,
    public tokenUri: TokenUri,
  ) {}
}
