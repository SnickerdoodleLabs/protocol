import { ChainId, TransactionHash, UnixTimestamp } from "@objects/primitives";

export abstract class ChainTransaction {
  constructor(
    public chainId: ChainId,
    public hash: TransactionHash,
    public timestamp: UnixTimestamp,
  ) {}
}
