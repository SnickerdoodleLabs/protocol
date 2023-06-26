import { VersionedObject } from "@objects/businessObjects/versioned/VersionedObject.js";
import {
  ChainId,
  TransactionHash,
  UnixTimestamp,
  VolatileStorageKey,
} from "@objects/primitives/index.js";

export abstract class ChainTransaction extends VersionedObject {
  public get primaryKey(): VolatileStorageKey {
    return `${this.chainId}_${this.hash}`;
  }

  public static CURRENT_VERSION = 1;

  constructor(
    public chainId: ChainId,
    public hash: TransactionHash,
    public timestamp: UnixTimestamp,
  ) {
    super();
  }

  public getVersion(): number {
    return ChainTransaction.CURRENT_VERSION;
  }
}
