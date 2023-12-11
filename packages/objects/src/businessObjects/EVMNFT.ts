import { WalletNFT } from "@objects/businessObjects/versioned/WalletNFT.js";
import {
  EChain,
  EChainTechnology,
  EContractStandard,
  ERewardType,
} from "@objects/enum/index.js";
import {
  EVMContractAddress,
  EVMAccountAddress,
  TokenUri,
  BigNumberString,
  BlockNumber,
  UnixTimestamp,
  NftTokenAddressWithTokenId,
} from "@objects/primitives/index.js";

export class EVMNFT extends WalletNFT {
  public constructor(
    public token: EVMContractAddress,
    public tokenId: BigNumberString,
    public contractType: EContractStandard | ERewardType | "Unknown",
    public owner: EVMAccountAddress,
    public tokenUri: TokenUri | undefined,
    public metadata: object | undefined,
    public name: string,
    public chain: EChain,
    public amount?: BigNumberString,
    public blockNumber?: BlockNumber,
    public lastOwnerTimeStamp?: UnixTimestamp,
  ) {
    super(
      EChainTechnology.EVM,
      chain,
      owner,
      token,
      name,
      NftTokenAddressWithTokenId(token, tokenId),
    );
  }
}
