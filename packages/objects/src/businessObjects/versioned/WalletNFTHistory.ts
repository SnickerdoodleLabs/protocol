import { VersionedObject } from "@objects/businessObjects/versioned/VersionedObject.js";
import { WalletNFTData } from "@objects/businessObjects/versioned/WalletNFTData.js";
import { EIndexedDbOp } from "@objects/enum/index.js";
import {
  AccountAddress,
  BigNumberString,
  NftIdWithMeasurementDate,
  UnixTimestamp,
} from "@objects/primitives/index.js";

export class WalletNFTHistory extends VersionedObject {
  public static CURRENT_VERSION = 1;

  public constructor(
    public id: NftIdWithMeasurementDate,
    public event: EIndexedDbOp,
    public amount: BigNumberString,
  ) {
    super();
  }

  public getVersion(): number {
    return WalletNFTHistory.CURRENT_VERSION;
  }
}

export type WalletNftWithHistory = Omit<WalletNFTData, "getVersion"> & {
  history: {
    measurementDate: UnixTimestamp;
    event: EIndexedDbOp;
    amount: BigNumberString;
  }[];
  owner: AccountAddress;
  totalAmount: BigNumberString;
};
