import { WalletNFT } from "@objects/businessObjects/WalletNFT";
import { EChainTechnology } from "@objects/enum";
import {
  EVMContractAddress,
  EVMAccountAddress,
  ChainId,
  TokenUri,
  BigNumberString,
  BlockNumber,
  UnixTimestamp,
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
    public blockNumber?: BlockNumber,
    public lastOwnerTimeStamp?: UnixTimestamp,
  ) {
    super(EChainTechnology.EVM, chain, owner, token);
  }
}
