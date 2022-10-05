import {
  EVMContractAddress,
  EVMAccountAddress,
  TickerSymbol,
  ChainId,
  TokenUri,
  BigNumberString,
} from "@objects/primitives";
import { AccountNFT } from "@objects/businessObjects";

export class EVMNFT implements AccountNFT {
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
