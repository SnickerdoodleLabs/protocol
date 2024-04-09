import { WalletNFT } from "@objects/businessObjects/WalletNFT.js";
import {
  EChain,
  EChainTechnology,
  EContractStandard,
} from "@objects/enum/index.js";
import {
  EVMContractAddress,
  EVMAccountAddress,
  TokenUri,
  BigNumberString,
  BlockNumber,
  UnixTimestamp,
} from "@objects/primitives/index.js";
export class EVMNFT extends WalletNFT {
  public constructor(
    public token: EVMContractAddress,
    public tokenId: BigNumberString,
    public contractType: EContractStandard,
    public owner: EVMAccountAddress,
    public tokenUri: TokenUri | undefined,
    public metadata: object | undefined,
    public name: string,
    public chain: EChain,
    public amount: BigNumberString,
    public measurementDate: UnixTimestamp,
    public blockNumber?: BlockNumber,
    public lastOwnerTimeStamp?: UnixTimestamp,
  ) {
    super(
      EChainTechnology.EVM,
      chain,
      owner,
      token,
      name,
      amount,
      measurementDate,
    );
  }
}
