import { ChainTransaction } from "@objects/businessObjects";
import {
  ChainId,
  SolanaTransactionSignature,
  UnixTimestamp,
} from "@objects/primitives";

export class SolanaTransaction extends ChainTransaction {
  public constructor(
    public chainId: ChainId,
    public hash: SolanaTransactionSignature,
    public timestamp: UnixTimestamp,
    public slot: number,
    public err: object | null,
    public memo: string | null,
  ) {
    super(chainId, hash, timestamp);
  }
}
