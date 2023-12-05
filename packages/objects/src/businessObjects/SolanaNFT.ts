import { WalletNFT } from "@objects/businessObjects/versioned/WalletNFT.js";
import { EChain, EChainTechnology } from "@objects/enum/index.js";
import {
  NftTokenAddressWithTokenId,
  SolanaAccountAddress,
  SolanaTokenAddress,
  TickerSymbol,
} from "@objects/primitives/index.js";

export class SolanaCollection {
  public constructor(
    public address: SolanaTokenAddress,
    public verified: boolean,
  ) {}
}

export class SolanaNFT extends WalletNFT {
  public constructor(
    public chain: EChain,
    public owner: SolanaAccountAddress,
    public mint: SolanaTokenAddress, //seems like token id
    // should have mint.address?
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
    //!!!!
    super(
      EChainTechnology.Solana,
      chain,
      owner,
      mint,
      name,
      NftTokenAddressWithTokenId(mint, mint),
    );
  }
}
