import { VersionedObject } from "@objects/businessObjects/versioned/VersionedObject.js";
import { EChain } from "@objects/enum/index.js";
import { ISO8601DateString, TransactionHash, UnixTimestamp } from "@objects/primitives/index.js";

export abstract class ChainTransaction extends VersionedObject {
  public static CURRENT_VERSION = 1;
 
  constructor(
    public chain: EChain,
    public hash: TransactionHash,
    public timestamp: UnixTimestamp,
    public measurementDate: ISO8601DateString
  ) {
    super();
  }

  public getVersion(): number {
    return ChainTransaction.CURRENT_VERSION;
  }
}
