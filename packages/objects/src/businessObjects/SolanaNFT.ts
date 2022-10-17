import { IAccountNFT } from "@objects/interfaces";
import {
  ChainId,
  SolanaAccountAddress,
  SolanaTokenAddress,
} from "@objects/primitives";

export interface MetaplexInfo {
  metadataUri: string;
  masterEdition: boolean;
  isMutable: boolean;
  primarySaleHappened: boolean;
  sellerFeeBasisPoints: number;
  updateAuthority: string;
}

export class SolanaNFTMetadata {
  public constructor(
    public mint: string,
    public standard: string,
    public name: string,
    public symbol: string,
    public metaplex: MetaplexInfo,
  ) {}
}

export class SolanaNFT implements IAccountNFT {
  public constructor(
    public chain: ChainId,
    public owner: SolanaAccountAddress,
    public token: SolanaTokenAddress,
    public mint: string,
    public metadata: SolanaNFTMetadata,
  ) {}
}
