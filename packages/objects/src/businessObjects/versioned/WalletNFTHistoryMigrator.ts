import { VersionedObjectMigrator } from "@objects/businessObjects/versioned/VersionedObject.js";
import { WalletNFTHistory } from "@objects/businessObjects/versioned/WalletNFTHistory.js";

export class WalletNFTHistoryMigrator extends VersionedObjectMigrator<WalletNFTHistory> {
  public getCurrentVersion(): number {
    return WalletNFTHistory.CURRENT_VERSION;
  }

  protected factory(
    data: Record<string, unknown> | WalletNFTHistory,
  ): WalletNFTHistory {
    const walletData = data as WalletNFTHistory;

    return new WalletNFTHistory(
      walletData.id,
      walletData.event,
      walletData.amount,
    );
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
