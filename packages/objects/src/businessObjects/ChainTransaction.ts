import {
  VersionedObject,
} from "@objects/businessObjects/VersionedObject";
import {
  ChainId,
  TransactionHash,
  UnixTimestamp,
} from "@objects/primitives";

export abstract class ChainTransaction extends VersionedObject {
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
