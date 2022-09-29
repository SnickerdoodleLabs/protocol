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

export class SolanaNFT {
  public constructor(
    public associatedTokenAddress: string,
    public mint: string,
    public metadata: SolanaNFTMetadata,
  ) {}
}
