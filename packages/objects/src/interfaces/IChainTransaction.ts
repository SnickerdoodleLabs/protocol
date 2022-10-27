import {
  AccountAddress,
  BigNumberString,
  ChainId,
  TransactionHash,
  UnixTimestamp,
} from "@objects/primitives";

export interface IChainTransaction {
  chainId: ChainId;
  hash: TransactionHash;
  timestamp: UnixTimestamp;
}
