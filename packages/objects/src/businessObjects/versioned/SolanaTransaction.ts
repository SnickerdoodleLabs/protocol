import { ChainTransaction } from "@objects/businessObjects/versioned/ChainTransaction.js";
import {
  ChainId,
  ISO8601DateString,
  SolanaTransactionSignature,
  UnixTimestamp,
} from "@objects/primitives/index.js";

export class SolanaTransaction extends ChainTransaction {
  public constructor(
    public chainId: ChainId,
    public hash: SolanaTransactionSignature,
    public timestamp: UnixTimestamp,
    public slot: number,
    public err: object | null,
    public memo: string | null,
    public measurementDate: ISO8601DateString,
  ) {
    super(chainId, hash, timestamp, measurementDate);
  }
}
