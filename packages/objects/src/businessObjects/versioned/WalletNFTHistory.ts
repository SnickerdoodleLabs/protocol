import { VersionedObject } from "./VersionedObject";

import { WalletNFT } from "@objects/businessObjects/versioned/WalletNFT.js";
import { EIndexedDbOp } from "@objects/enum/index.js";
import {
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

export type WalletNftWithHistory = Omit<WalletNFT, "getVersion"> & {
  history: {
    measurementDate: UnixTimestamp;
    event: EIndexedDbOp;
    amount: BigNumberString;
  }[];
  totalAmount: BigNumberString;
};
