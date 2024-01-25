import { VersionedObjectMigrator } from "@objects/businessObjects/versioned/VersionedObject.js";
import { WalletNFTData } from "@objects/businessObjects/versioned/WalletNFTData.js";
import { PropertiesOf } from "@objects/utilities/index.js";
export class WalletNFTDataMigrator extends VersionedObjectMigrator<WalletNFTData> {
  public getCurrentVersion(): number {
    return WalletNFTData.CURRENT_VERSION;
  }

  protected factory(data: PropertiesOf<WalletNFTData>): WalletNFTData {
    return new WalletNFTData(data.id, data.nft);
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
