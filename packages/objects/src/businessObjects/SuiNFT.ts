import { WalletNFT } from "@objects/businessObjects/WalletNFT.js";
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
} from "@objects/primitives/index.js";

export class SuiCollection {
  public constructor(
    public address: SuiTokenAddress,
    public verified: boolean,
  ) {}
}

export class SuiNFT extends WalletNFT {
  public constructor(
    public chain: EChain,
    public owner: SuiAccountAddress,
    public mint: SuiTokenAddress,
    public collection: SuiCollection | null,
    public metadataUri: string,
    public isMutable: boolean,
    public primarySaleHappened: boolean,
    public sellerFeeBasisPoints: number,
    public updateAuthority: SuiAccountAddress,
    public tokenStandard: number | null,
    public symbol: TickerSymbol,
    public name: string,
  ) {
    super(EChainTechnology.Sui, chain, owner, mint, name);
  }
}
