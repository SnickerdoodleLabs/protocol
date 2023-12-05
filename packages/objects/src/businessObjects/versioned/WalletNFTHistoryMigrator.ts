import { VersionedObjectMigrator } from "@objects/businessObjects/versioned/VersionedObject.js";
import { WalletNFTHistory } from "@objects/businessObjects/versioned/WalletNFTHistory.js";

export class WalletNFTHistoryMigrator extends VersionedObjectMigrator<WalletNFTHistory> {
  public getCurrentVersion(): number {
    return WalletNFTHistory.CURRENT_VERSION;
  }

  protected factory(
    data: Record<string, unknown> | WalletNFTHistory,
  ): WalletNFTHistory {
    if (this.isNftHistory(data)) {
      return new WalletNFTHistory(data.id, data.event);
    }
    throw new Error(
      "Encountered malformed nft history while creating it from indexed db data",
    );
  }

  protected isNftHistory(
    nftHistory: Record<string, unknown> | WalletNFTHistory,
  ): nftHistory is WalletNFTHistory {
    return nftHistory.id != null && nftHistory.event != null;
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
