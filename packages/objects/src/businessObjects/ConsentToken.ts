import {
  EVMAccountAddress,
  TokenIdNumber,
  TokenUri,
} from "@objects/primatives";

export class ConsentToken {
  public constructor(
    public ownerAddress: EVMAccountAddress,
    public tokenId: TokenIdNumber,
    public tokenUri: TokenUri,
  ) {}
}
