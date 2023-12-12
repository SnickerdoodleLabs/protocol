import { EVMIndexerNft } from "@objects/businessObjects/EVMIndexerNft.js";
import { EVMNFT } from "@objects/businessObjects/EVMNFT.js";
import { SolanaNFT } from "@objects/businessObjects/SolanaNFT.js";
import { SuiNFT } from "@objects/businessObjects/SuiNFT.js";
import { VersionedObjectMigrator } from "@objects/businessObjects/versioned/VersionedObject.js";
import { WalletNFT } from "@objects/businessObjects/versioned/WalletNFT.js";
import { EChainTechnology } from "@objects/enum/index.js";

export class WalletNFTMigrator extends VersionedObjectMigrator<WalletNFT> {
  public getCurrentVersion(): number {
    return WalletNFT.CURRENT_VERSION;
  }

  protected factory<T extends WalletNFT>(
    data: Record<string, unknown> | T,
  ): WalletNFT {
    if (isEVMNft(data)) {
      return new EVMNFT(
        data.token,
        data.tokenId,
        data.contractType,
        data.owner,
        data.tokenUri,
        data.metadata,
        data.name,
        data.chain,
        data.blockNumber,
        data.lastOwnerTimeStamp,
      );
    }
    if (isSuiNft(data)) {
      return new SuiNFT(
        data.token,
        data.tokenId,
        data.contractType,
        data.owner,
        data.tokenUri,
        data.metadata,
        data.amount,
        data.name,
        data.chain,
        data.blockNumber,
        data.lastOwnerTimeStamp,
      );
    }
    if (isSolanaNft(data)) {
      return new SolanaNFT(
        data.chain,
        data.owner,
        data.mint,
        data.collection,
        data.metadataUri,
        data.isMutable,
        data.primarySaleHappened,
        data.sellerFeeBasisPoints,
        data.updateAuthority,
        data.tokenStandard,
        data.symbol,
        data.name,
      );
    }
    throw new Error(
      "Encountered unknown chain nft while creating nft from indexed db data",
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}

/**
 * Only checks the type field !
 */
export function isEVMNft(
  nft: Record<string, unknown> | WalletNFT,
): nft is EVMNFT {
  return nft.type === EChainTechnology.EVM;
}

/**
 * Only checks the type and indexer  response field !
 */
export function isEVMIndexerNft(
  nft: WalletNFT | EVMIndexerNft | Record<string, unknown>,
): nft is EVMIndexerNft {
  return (
    "indexerResponse" in nft &&
    nft.indexerResponse === true &&
    "type" in nft &&
    nft.type === EChainTechnology.EVM
  );
}

/**
 * Only checks the type field !
 */
export function isSolanaNft(
  nft: Record<string, unknown> | WalletNFT,
): nft is SolanaNFT {
  return nft.type === EChainTechnology.Solana;
}

/**
 * Only checks the type field !
 */
export function isSuiNft(
  nft: Record<string, unknown> | WalletNFT,
): nft is SuiNFT {
  return nft.type === EChainTechnology.Sui;
}
