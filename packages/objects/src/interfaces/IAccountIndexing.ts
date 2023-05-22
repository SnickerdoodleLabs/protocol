import { ResultAsync } from "neverthrow";

import { ChainTransaction } from "@objects/businessObjects";
import { AccountIndexingError, AjaxError } from "@objects/errors";
import {
  IEVMTransactionRepository,
  ISolanaTransactionRepository,
} from "@objects/interfaces/chains";
import { AccountAddress, ChainId, UnixTimestamp } from "@objects/primitives";

export interface IAccountIndexing {
  getLatestTransactions(
    accountAddress: AccountAddress,
    timestamp: UnixTimestamp,
    chainId: ChainId,
  ): ResultAsync<ChainTransaction[], AccountIndexingError | AjaxError>;
  getEVMTransactionRepository(): ResultAsync<IEVMTransactionRepository, never>;
  getEthereumTransactionRepository(): ResultAsync<
    IEVMTransactionRepository,
    never
  >;
  getSimulatorEVMTransactionRepository(): ResultAsync<
    IEVMTransactionRepository,
    never
  >;
  getSolanaTransactionRepository(): ResultAsync<
    ISolanaTransactionRepository,
    never
  >;
  getPolygonTransactionRepository(): ResultAsync<
    IEVMTransactionRepository,
    never
  >;
}

export const IAccountIndexingType = Symbol.for("IAccountIndexing");
