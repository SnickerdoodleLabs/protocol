import { VersionedObject } from "@objects/businessObjects/versioned/VersionedObject.js";
import { WalletNFT } from "@objects/businessObjects/WalletNFT.js";
import { NftAddressesWithTokenId } from "@objects/primitives/index.js";

export class WalletNFTData extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(
    public id: NftAddressesWithTokenId,
    public nft: Omit<WalletNFT, "amount" | "measurementDate">,
  ) {
    super();
  }

  public getVersion(): number {
    return WalletNFTData.CURRENT_VERSION;
  }
}
