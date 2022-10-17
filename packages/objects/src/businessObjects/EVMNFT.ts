import { IAccountNFT } from "@objects/interfaces";
import {
  EVMContractAddress,
  EVMAccountAddress,
  TickerSymbol,
  ChainId,
  TokenUri,
  BigNumberString,
} from "@objects/primitives";

export class EVMNFT implements IAccountNFT {
  public constructor(
    public token: EVMContractAddress,
    public tokenId: BigNumberString,
    public contractType: string,
    public owner: EVMAccountAddress,
    public tokenUri: TokenUri,
    public metadata: string,
    public amount: BigNumberString,
    public name: string,
    public ticker: TickerSymbol,
    public chain: ChainId,
  ) {}
}
