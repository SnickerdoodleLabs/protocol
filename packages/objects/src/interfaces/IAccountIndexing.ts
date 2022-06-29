import { ResultAsync } from "neverthrow";

import {
  IAvalancheEVMTransactionRepository,
  IEthereumEVMTransactionRepository,
} from "@objects/interfaces/chains";

export interface IAccountIndexing {
  getAvalancheEVMTransactionRepository(): ResultAsync<
    IAvalancheEVMTransactionRepository,
    never
  >;
  getEthereumEVMTransactionRepository(): ResultAsync<
    IEthereumEVMTransactionRepository,
    never
  >;
  //getSolanaRepository(): ResultAsync<ISolanaTransactionRepository, never>;
}

export const IAccountIndexingType = Symbol.for("IAccountIndexing");
