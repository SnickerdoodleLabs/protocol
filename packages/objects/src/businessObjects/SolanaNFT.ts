import { WalletNFT } from "@objects/businessObjects/WalletNFT";
import { EChainTechnology } from "@objects/enum";
import {
  ChainId,
  SolanaAccountAddress,
  SolanaTokenAddress,
  TickerSymbol,
} from "@objects/primitives";

export class SolanaCollection {
  public constructor(
    public address: SolanaTokenAddress,
    public verified: boolean,
  ) {}
}

export class SolanaNFT extends WalletNFT {
  public constructor(
    public chain: ChainId,
    public owner: SolanaAccountAddress,
    public mint: SolanaTokenAddress,
    public collection: SolanaCollection | null,
    public metadataUri: string,
    public isMutable: boolean,
    public primarySaleHappened: boolean,
    public sellerFeeBasisPoints: number,
    public updateAuthority: SolanaAccountAddress,
    public tokenStandard: number | null,
    public symbol: TickerSymbol,
    public name: string,
  ) {
    super(EChainTechnology.Solana, chain, owner, mint);
  }
}
