import { VersionedObjectMigrator } from "@objects/businessObjects/versioned/VersionedObject.js";
import { WalletNFTHistory } from "@objects/businessObjects/versioned/WalletNFTHistory.js";
import { PropertiesOf } from "@objects/utilities/index.js";

export class WalletNFTHistoryMigrator extends VersionedObjectMigrator<WalletNFTHistory> {
  public getCurrentVersion(): number {
    return WalletNFTHistory.CURRENT_VERSION;
  }

  protected factory(data: PropertiesOf<WalletNFTHistory>): WalletNFTHistory {
    return new WalletNFTHistory(data.id, data.event, data.amount);
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
