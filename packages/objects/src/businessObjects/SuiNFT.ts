import { WalletNFT } from "@objects/businessObjects/versioned/WalletNFT.js";
import { EChain, EChainTechnology } from "@objects/enum/index.js";
import {
  EVMContractAddress,
  EVMAccountAddress,
  TokenUri,
  BigNumberString,
  BlockNumber,
  UnixTimestamp,
  SuiAccountAddress,
  SuiTokenAddress,
  TickerSymbol,
  SuiContractAddress,
  NftTokenAddressWithTokenId,
} from "@objects/primitives/index.js";

export class SuiCollection {
  public constructor(
    public address: SuiTokenAddress,
    public verified: boolean,
  ) {}
}

export class SuiNFT extends WalletNFT {
  public constructor(
    public token: SuiTokenAddress,
    public tokenId: BigNumberString,
    public contractType: string,
    public owner: SuiAccountAddress,
    public tokenUri: TokenUri | undefined,
    public metadata: object | undefined,
    public amount: BigNumberString,
    public name: string,
    public chain: EChain,
    public blockNumber?: BlockNumber,
    public lastOwnerTimeStamp?: UnixTimestamp,
  ) {
    super(
      EChainTechnology.Sui,
      chain,
      owner,
      token,
      name,
      NftTokenAddressWithTokenId(token, tokenId),
    );
  }
}
