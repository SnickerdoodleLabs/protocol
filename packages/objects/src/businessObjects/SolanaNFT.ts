import { WalletNFT } from "@objects/businessObjects/WalletNFT.js";
import { EChain, EChainTechnology } from "@objects/enum/index.js";
import {
  BigNumberString,
  SolanaAccountAddress,
  SolanaTokenAddress,
  TickerSymbol,
  UnixTimestamp,
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
    public amount: BigNumberString,
    public measurementDate: UnixTimestamp,
  ) {
    super(
      EChainTechnology.Solana,
      chain,
      owner,
      mint,
      name,
      amount,
      measurementDate,
    );
  }
}
