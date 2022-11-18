import { WalletNFT } from "@objects/businessObjects/WalletNFT";
import { EChainTechnology } from "@objects/enum";
import {
  EVMContractAddress,
  EVMAccountAddress,
  TickerSymbol,
  ChainId,
  TokenUri,
  BigNumberString,
} from "@objects/primitives";

export class EVMNFT extends WalletNFT {
  public constructor(
    public token: EVMContractAddress,
    public tokenId: BigNumberString,
    public contractType: string,
    public owner: EVMAccountAddress,
    public tokenUri: TokenUri | undefined,
    public metadata: object | undefined,
    public amount: BigNumberString,
    public name: string,
    public chain: ChainId,
  ) {
    super(EChainTechnology.EVM, chain, owner, token);
  }
}
