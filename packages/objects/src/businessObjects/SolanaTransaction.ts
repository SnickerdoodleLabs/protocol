import { IChainTransaction } from "@objects/interfaces/IChainTransaction";
import {
  ChainId,
  SolanaTransactionSignature,
  UnixTimestamp,
} from "@objects/primitives";

export class SolanaTransaction implements IChainTransaction {
  public constructor(
    public chainId: ChainId,
    public hash: SolanaTransactionSignature,
    public timestamp: UnixTimestamp,
    public slot: number,
    public err: object | null,
    public memo: string | null,
  ) {}
}
