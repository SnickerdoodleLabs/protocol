import { ResultAsync } from "neverthrow";

import {
  IEVMTransactionRepository,
  ISolanaTransactionRepository,
} from "@objects/interfaces/chains";

export interface IAccountIndexing {
  getEVMTransactionRepository(): ResultAsync<IEVMTransactionRepository, never>;
  getETHTransactionRepository(): ResultAsync<IEVMTransactionRepository, never>;
  getSimulatorEVMTransactionRepository(): ResultAsync<
    IEVMTransactionRepository,
    never
  >;
  getSolanaTransactionRepository(): ResultAsync<
    ISolanaTransactionRepository,
    never
  >;
}

export const IAccountIndexingType = Symbol.for("IAccountIndexing");
