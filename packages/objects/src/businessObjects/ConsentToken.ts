import {
  EthereumAccountAddress,
  TokenIdNumber,
  TokenUri,
} from "@objects/primitives";

export class ConsentToken {
  public constructor(
    public ownerAddress: EthereumAccountAddress,
    public tokenId: TokenIdNumber,
    public tokenUri: TokenUri,
  ) {}
}
