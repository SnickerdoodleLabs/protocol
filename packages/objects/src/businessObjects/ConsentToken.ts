import {
  EVMAccountAddress,
  TokenIdNumber,
  TokenUri,
} from "@objects/primitives";

export class ConsentToken {
  public constructor(
    public ownerAddress: EVMAccountAddress,
    public tokenId: TokenIdNumber,
    public tokenUri: TokenUri | null,
  ) {}
}
