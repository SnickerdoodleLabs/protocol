import {
  EthereumAccountAddress,
  TokenIdNumber,
  TokenUri,
} from "@objects/primatives";

export class ConsentToken {
  public constructor(
    public ownerAddress: EthereumAccountAddress,
    public tokenId: TokenIdNumber,
    public tokenUri: TokenUri,
  ) {}
}
