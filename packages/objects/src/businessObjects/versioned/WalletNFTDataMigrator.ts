import { VersionedObjectMigrator } from "@objects/businessObjects/versioned/VersionedObject.js";
import { WalletNFTData } from "@objects/businessObjects/versioned/WalletNFTData.js";

export class WalletNFTDataMigrator extends VersionedObjectMigrator<WalletNFTData> {
  public getCurrentVersion(): number {
    return WalletNFTData.CURRENT_VERSION;
  }
  // TODO: @Ozan
  protected factory(
    data: Record<string, unknown> | { data: WalletNFTData },
  ): WalletNFTData {
    const walletNftData = data.data as WalletNFTData;
    return new WalletNFTData(walletNftData.id, walletNftData.nft);
  }

  protected getUpgradeFunctions(): Map<
    number,
    (data: Record<string, unknown>, version: number) => Record<string, unknown>
  > {
    return new Map();
  }
}
